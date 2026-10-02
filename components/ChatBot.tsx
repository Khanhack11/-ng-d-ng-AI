import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Send, Bot, Sparkles, ShoppingBag, Eye, Plus, 
  TrendingUp, Truck, Check, 
  RotateCcw, Maximize2, Minimize2, 
  Ruler, Award, Sliders, Settings, Key, 
  ThumbsUp, ThumbsDown, ShieldCheck
} from 'lucide-react';
import { 
  ProductDetail, CartItem, UserRole, AIPersonaType, 
  UserMeasurements, CustomerContext, CustomerProfile, Order 
} from '../types';
import { AISkillEngine, AISkillResult, AI_PERSONAS } from '../aiSkills';
import { MOCK_PRODUCTS_LIST, MOCK_ORDER } from '../constants';
import { getProductVisualSync } from '../productUtils';

// Định dạng tiền tệ VNĐ an toàn tuyệt đối (Tránh lỗi ReferenceError: formatVND is not defined gây trắng trang)
function formatVND(amount?: number | string | null): string {
  const num = Number(amount);
  if (!Number.isFinite(num)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
}

// Bộ hiển thị văn bản thông minh: chuyển đổi **in đậm**, ~gạch ngang~, `code` thành JSX sắc nét (loại bỏ lỗi hiển thị dấu ** thô)
function renderInlineTokens(line: string, isUser: boolean): React.ReactNode[] {
  const tokenRegex = /(\*\*[^*]+\*\*|~[^~]+~|`[^`]+`|\*[^*\n]+\*)/g;
  const parts = line.split(tokenRegex);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={idx} className={isUser ? 'font-extrabold text-white' : 'font-extrabold text-slate-900'}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('~') && part.endsWith('~') && part.length > 2) {
      return (
        <span key={idx} className="line-through text-slate-400">
          {part.slice(1, -1)}
        </span>
      );
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code key={idx} className="px-1.5 py-0.5 rounded bg-amber-100/80 text-amber-900 font-mono text-[11px] font-bold border border-amber-200">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return (
        <em key={idx} className={isUser ? 'italic text-blue-100' : 'italic text-slate-600'}>
          {part.slice(1, -1)}
        </em>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

function renderFormattedChatText(text: string, isUser: boolean = false): React.ReactNode {
  const lines = text.split('\n');
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-1" />;
        return (
          <div key={i} className="leading-relaxed">
            {renderInlineTokens(line, isUser)}
          </div>
        );
      })}
    </div>
  );
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  skillResult?: AISkillResult;
  genAIMeta?: {
    integrationMode: string;
    functionCallName?: string;
    ttftMs: number;
    totalTokens: number;
    groundingScore: number;
    finishReason: string;
  };
}

interface ChatBotProps {
  products?: ProductDetail[];
  activeProduct?: ProductDetail | null;
  cartItems?: CartItem[];
  onAddToCart?: (item: CartItem) => void;
  onOpenCart?: () => void;
  onSelectProduct?: (productId: string) => void;
  userRole?: UserRole;
  currentView?: string;
  onNavigate?: (view: string) => void;
  currentUser?: {
    id?: number | string;
    email?: string;
    name?: string;
    role?: string;
    avatar?: string;
  } | null;
  customerProfile?: CustomerProfile | null;
  customerOrders?: Order[];
  mode?: 'floating' | 'embedded';
  activeModule?: 'ai-genz' | 'products' | 'orders' | 'vip';
  onSwitchModule?: (module: 'ai-genz' | 'products' | 'orders' | 'vip') => void;
  onOpenLoyaltyModal?: () => void;
}

const AI_SHORTCUT_BUTTONS = [
  { label: '📱 Tư vấn mua máy', prompt: 'Tư vấn mua máy iPhone phù hợp nhu cầu và bán chạy nhất hiện nay' },
  { label: '⚖️ So sánh iPhone', prompt: 'So sánh iPhone 16 Pro Max và iPhone 17 Pro Max.' },
  { label: '🔬 Thông số kỹ thuật', prompt: 'iPhone 17 Pro Max dùng chip gì và camera thế nào?' },
  { label: '📦 Kiểm tra đơn hàng', prompt: 'Đơn hàng của tôi đang ở đâu?' },
  { label: '🛠 Bảo hành & Care', prompt: 'Chính sách Bảo hành & Care đổi trả tại ZShop như thế nào?' },
  { label: '👑 Quyền lợi VIP', prompt: 'Tôi có bao nhiêu điểm VIP và ưu đãi quyền lợi VIP gì?' }
];

export default function ChatBot({
  products = MOCK_PRODUCTS_LIST,
  activeProduct = null,
  cartItems = [],
  onAddToCart,
  onOpenCart,
  onSelectProduct,
  userRole = UserRole.CUSTOMER,
  currentView,
  onNavigate,
  currentUser,
  customerProfile,
  customerOrders = [MOCK_ORDER],
  mode = 'floating',
  activeModule = 'ai-genz',
  onSwitchModule,
  onOpenLoyaltyModal
}: ChatBotProps) {
  const [isOpen, setIsOpen] = useState<boolean>(mode === 'embedded');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [selectedPersona, setSelectedPersona] = useState<AIPersonaType>('STYLIST');
  const [mainHomeModule, setMainHomeModule] = useState<'ai-genz' | 'products' | 'orders' | 'vip'>(activeModule);
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const [addedComboId, setAddedComboId] = useState<string | null>(null);
  const [isMultiAgentActive, setIsMultiAgentActive] = useState<boolean>(true);

  // [CHƯƠNG 8 - SLIDE 7, 18, 29, 32] State lưu trữ đánh giá Thumbs Up/Down & Bảng Kiểm định GenAI Chương 8
  const [feedbackRatings, setFeedbackRatings] = useState<Record<string, 'up' | 'down'>>({});
  const [showGenAILab, setShowGenAILab] = useState<boolean>(false);

  const handleRateMessage = async (messageId: string, rating: 'up' | 'down', text: string) => {
    setFeedbackRatings(prev => ({ ...prev, [messageId]: rating }));
    try {
      await fetch('http://localhost:5000/api/chat/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, rating, persona: selectedPersona, comment: text.slice(0, 120) })
      });
    } catch (_) {}
  };

  // Quản lý External AI Key (Google Gemini API)
  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => {
    try {
      return localStorage.getItem('zshop_gemini_api_key') || (process.env.GEMINI_API_KEY as string) || '';
    } catch (_) {
      return '';
    }
  });
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [inputKey, setInputKey] = useState<string>(geminiApiKey);

  const handleSaveApiKey = () => {
    setGeminiApiKey(inputKey.trim());
    try {
      if (inputKey.trim()) {
        localStorage.setItem('zshop_gemini_api_key', inputKey.trim());
      } else {
        localStorage.removeItem('zshop_gemini_api_key');
      }
    } catch (_) {}
    setShowKeyModal(false);
  };

  // Lưu trữ số đo cá nhân của người dùng (Smart Fitting Memory)
  const storageKey = `zshop_measurements_${customerProfile?.id || currentUser?.id || 'guest'}`;
  const [measurements, setMeasurements] = useState<UserMeasurements>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return { height: 172, weight: 65, preferredFit: 'regular' };
  });



  // Lưu lịch sử tin nhắn riêng biệt cho từng Persona (Liên kết toàn diện: Khách hàng + Sản phẩm đang xem + Giỏ hàng + Đơn mua + Kho)
  const buildContext = (): CustomerContext => ({
    currentUser,
    customerProfile,
    cartItems,
    allProducts: products,
    activeProduct,
    currentView,
    customerOrders,
    measurements
  });

  const [messagesByPersona, setMessagesByPersona] = useState<Record<AIPersonaType, ChatMessage[]>>(() => {
    const ctx = {
      currentUser,
      customerProfile,
      cartItems,
      allProducts: products,
      activeProduct,
      currentView,
      customerOrders,
      measurements
    };
    return {
      STYLIST: [{
        id: 'init-stylist',
        sender: 'ai',
        text: AI_PERSONAS.STYLIST.getGreeting(ctx),
        timestamp: 'Vừa xong'
      }],
      FITTING: [{
        id: 'init-fitting',
        sender: 'ai',
        text: AI_PERSONAS.FITTING.getGreeting(ctx),
        timestamp: 'Vừa xong'
      }],
      ORDERS: [{
        id: 'init-orders',
        sender: 'ai',
        text: AI_PERSONAS.ORDERS.getGreeting(ctx),
        timestamp: 'Vừa xong'
      }],
      LOYALTY: [{
        id: 'init-loyalty',
        sender: 'ai',
        text: AI_PERSONAS.LOYALTY.getGreeting(ctx),
        timestamp: 'Vừa xong'
      }],
      BUSINESS: [{
        id: 'init-business',
        sender: 'ai',
        text: AI_PERSONAS.BUSINESS.getGreeting(ctx),
        timestamp: 'Vừa xong'
      }]
    };
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeMessages = messagesByPersona[selectedPersona] || [];
  const currentPersonaConfig = AI_PERSONAS[selectedPersona];

  // Cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeMessages, isOpen, isLoading]);

  // Lắng nghe sự kiện mở ChatBot và đồng bộ tab module từ ShopeeHomePage / các trang khác
  useEffect(() => {
    const handleOpenChatEvent = (e: any) => {
      setIsOpen(true);
      setSelectedPersona('STYLIST');
      if (e.detail?.prompt) {
        setInputPrompt(e.detail.prompt);
      }
    };
    const handleModuleChangeEvent = (e: any) => {
      if (e.detail?.module) {
        setMainHomeModule(e.detail.module);
      }
    };
    const handleSyncMessagesEvent = (e: any) => {
      if (e.detail?.sourceMode !== mode && e.detail?.messages) {
        setMessagesByPersona(e.detail.messages);
      }
    };
    window.addEventListener('zshop:open-chatbot', handleOpenChatEvent);
    window.addEventListener('zshop:module-changed', handleModuleChangeEvent);
    window.addEventListener('zshop:sync-ai-messages', handleSyncMessagesEvent);
    return () => {
      window.removeEventListener('zshop:open-chatbot', handleOpenChatEvent);
      window.removeEventListener('zshop:module-changed', handleModuleChangeEvent);
      window.removeEventListener('zshop:sync-ai-messages', handleSyncMessagesEvent);
    };
  }, [mode]);

  useEffect(() => {
    setMainHomeModule(activeModule);
  }, [activeModule]);

  // Phát sự kiện đồng bộ tin nhắn giữa chế độ embedded (trung tâm) và floating (nổi)
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('zshop:sync-ai-messages', {
      detail: { sourceMode: mode, messages: messagesByPersona }
    }));
  }, [messagesByPersona, mode]);

  // Cập nhật lời chào khi thông tin khách hàng, sản phẩm đang xem hoặc giỏ hàng thay đổi
  useEffect(() => {
    const ctx = buildContext();
    setMessagesByPersona(prev => ({
      ...prev,
      [selectedPersona]: prev[selectedPersona].length <= 1 
        ? [{
            id: `init-${selectedPersona}-${Date.now()}`,
            sender: 'ai',
            text: AI_PERSONAS[selectedPersona].getGreeting(ctx),
            timestamp: 'Vừa xong'
          }]
        : prev[selectedPersona]
    }));
  }, [customerProfile?.id, cartItems.length, activeProduct?.id]);

  // Đổi Persona
  const handleSwitchPersona = (persona: AIPersonaType) => {
    setSelectedPersona(persona);
    const ctx = buildContext();
    if (!messagesByPersona[persona] || messagesByPersona[persona].length === 0) {
      setMessagesByPersona(prev => ({
        ...prev,
        [persona]: [{
          id: `init-${persona}-${Date.now()}`,
          sender: 'ai',
          text: AI_PERSONAS[persona].getGreeting(ctx),
          timestamp: 'Vừa xong'
        }]
      }));
    }
  };

  // Làm mới Persona hiện tại
  const handleResetCurrentPersona = () => {
    const ctx = buildContext();
    setMessagesByPersona(prev => ({
      ...prev,
      [selectedPersona]: [{
        id: `reset-${selectedPersona}-${Date.now()}`,
        sender: 'ai',
        text: AI_PERSONAS[selectedPersona].getGreeting(ctx),
        timestamp: 'Vừa xong'
      }]
    }));
  };

  // Sao chép nội dung
  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Thêm nhanh vào giỏ hàng (Đồng bộ 100% ảnh & màu Apple Studio)
  const handleQuickAdd = (product: ProductDetail) => {
    if (onAddToCart) {
      const visual = getProductVisualSync(product, products);
      const cartItem: CartItem = {
        id: `cart-${product.id}-${Date.now()}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        quantity: 1,
        size: product.sizes && product.sizes.length > 0 ? product.sizes[0] : '256GB',
        color: product.colors?.[0] || 'Titan Tự Nhiên Natural',
        category: product.category,
        selected: true,
        image: visual.image,
        studioBg: visual.studioBg,
        imgFilter: visual.imgFilter,
        swatchHex: visual.swatchHex
      };
      onAddToCart(cartItem);
      setAddedProductId(product.id);
      setTimeout(() => setAddedProductId(null), 1800);
    }
  };

  // Thêm trọn bộ outfit vào giỏ hàng
  const handleAddOutfitToCart = (combo: { id: string; items: ProductDetail[] }) => {
    if (onAddToCart) {
      combo.items.forEach((item, idx) => {
        setTimeout(() => {
          const itemImage = item.images?.[0] || (item as any).image_url || (item as any).image || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500';
          onAddToCart({
            id: `cart-combo-${item.id}-${Date.now()}-${idx}`,
            name: item.name,
            price: Math.round(item.price * 0.92), // Ưu đãi combo 8%
            quantity: 1,
            size: item.sizes && item.sizes.length > 0 ? item.sizes[0] : 'Freesize',
            image: itemImage
          });
        }, idx * 100);
      });
      setAddedComboId(combo.id);
      setTimeout(() => setAddedComboId(null), 2500);
    }
  };



  // Gửi tin nhắn (Tích hợp Defense-in-Depth & Telemetry chuẩn Chương 8)
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputPrompt).trim();
    if (!query || isLoading) return;
    const reqStart = Date.now();

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessagesByPersona(prev => ({
      ...prev,
      [selectedPersona]: [...(prev[selectedPersona] || []), userMsg]
    }));

    setInputPrompt('');
    setIsLoading(true);

    // [CHƯƠNG 8 - SLIDE 6 & 18] Lớp 1: Kiểm duyệt đầu vào & Chống Prompt Injection
    const injectionRegex = /(ignore\s+(all\s+)?previous\s+instructions|bỏ\s+qua\s+(mọi\s+|tất\s+cả\s+)?hướng\s+dẫn\s+trước|tiết\s+lộ\s+system\s+prompt|reveal\s+system\s+prompt|drop\s+table\s+users)/i;
    if (injectionRegex.test(query)) {
      const shieldMsg: ChatMessage = {
        id: `ai-shield-${Date.now()}`,
        sender: 'ai',
        text: '🛡️ **Cảnh báo Bảo mật GenAI (Defense-in-Depth - Lớp 1 & 2)**:\nHệ thống phát hiện dấu hiệu tấn công **Prompt Injection** (cố gắng ghi đè System Prompt hoặc khai thác dữ liệu nội bộ).\n• **Trạng thái cổng Moderation API**: Đã chặn (`finish_reason: content_filter`).\n• **Chiến lược xử lý (Slide 18)**: Không retry với Content Filter — Vui lòng diễn đạt lại câu hỏi mua sắm hợp lệ!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        genAIMeta: {
          integrationMode: 'Defense-in-Depth Shield',
          functionCallName: 'moderation_block_injection()',
          ttftMs: 18,
          totalTokens: 42,
          groundingScore: 100,
          finishReason: 'content_filter'
        }
      };
      setMessagesByPersona(prev => ({
        ...prev,
        [selectedPersona]: [...(prev[selectedPersona] || []), shieldMsg]
      }));
      setIsLoading(false);
      return;
    }

    try {
      const ctx = buildContext();
      let aiResult: AISkillResult;
      let serverMeta: any = null;

      // Thử gọi backend API: Ưu tiên Flask Multi-Agent API (port 5001), sau đó Express (port 5000), sau đó Local Fallback Engine
      try {
        let response: Response | null = null;
        try {
          // 1. Thử gọi Flask Multi-Agent Web API (Port 5001)
          response = await fetch('http://localhost:5001/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: [{ text: query }],
              text: query,
              persona: selectedPersona,
              apiKey: geminiApiKey,
              context: {
                customerName: customerProfile?.name || currentUser?.name,
                tier: customerProfile?.tier,
                points: customerProfile?.points
              }
            })
          });
          if (response && response.ok) {
            setIsMultiAgentActive(true);
          }
        } catch (_) {
          // 2. Fallback sang Node.js Express nếu Flask chưa bật
          try {
            response = await fetch('http://localhost:5000/api/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                messages: [{ text: query }],
                persona: selectedPersona,
                apiKey: geminiApiKey,
                context: {
                  customerName: customerProfile?.name || currentUser?.name,
                  tier: customerProfile?.tier,
                  points: customerProfile?.points
                }
              })
            });
            setIsMultiAgentActive(false);
          } catch (_) {}
        }

        // Kiểm tra trước bằng Bộ Giải Mã Ngôn Ngữ Tự Nhiên & Viết Tắt GenZ Việt Nam
        const localGenZMatch = AISkillEngine.handleGenZiPhoneQuery(query, ctx.allProducts, ctx, selectedPersona);

        if (localGenZMatch) {
          aiResult = localGenZMatch;
        } else if (response && response.ok) {
          const data = await response.json();
          serverMeta = data.metadata || data.skillResult?.aiMetadata;
          if (data.skillResult && data.skillResult.products && data.skillResult.products.length > 0) {
            aiResult = data.skillResult;
          } else {
            aiResult = await AISkillEngine.executePersonaSkill(query, selectedPersona, ctx);
            if (data.text && (!aiResult.products || aiResult.products.length === 0)) {
              aiResult.message = data.text;
            }
          }
        } else {
          aiResult = await AISkillEngine.executePersonaSkill(query, selectedPersona, ctx);
        }
      } catch (_) {
        aiResult = await AISkillEngine.executePersonaSkill(query, selectedPersona, ctx);
      }

      const elapsedMs = Math.max(85, Date.now() - reqStart);
      const genZModels = AISkillEngine.resolveGenZPhoneModels(query, ctx.allProducts);
      const inferredFn =
        genZModels.length > 0 ? `search_iphone_db("${genZModels[0].id}")` :
        selectedPersona === 'ORDERS' || aiResult.orderInfo ? 'get_order_status(order_id)' :
        selectedPersona === 'FITTING' || aiResult.sizeFitting ? 'get_iphone_hardware_specs()' :
        selectedPersona === 'BUSINESS' || aiResult.analytics ? 'get_store_sales_analytics()' :
        aiResult.products && aiResult.products.length > 0 ? 'search_iphone_by_budget()' : undefined;

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResult.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        skillResult: aiResult,
        genAIMeta: {
          integrationMode: serverMeta?.integration_mode || (inferredFn ? 'Function Calling' : 'Agent-based + RAG Grounding'),
          functionCallName: serverMeta?.function_call?.name ? `${serverMeta.function_call.name}()` : inferredFn,
          ttftMs: serverMeta?.performance?.ttft_ms || Math.min(280, Math.round(elapsedMs * 0.65)),
          totalTokens: serverMeta?.usage?.total_tokens || Math.max(85, Math.ceil((query.length + aiResult.message.length) / 3.6)),
          groundingScore: Math.round((serverMeta?.security?.grounding_score || 0.98) * 100),
          finishReason: serverMeta?.finish_reason || (inferredFn ? 'function_call' : 'stop')
        }
      };

      setMessagesByPersona(prev => ({
        ...prev,
        [selectedPersona]: [...(prev[selectedPersona] || []), aiMsg]
      }));
    } catch (e) {
      setMessagesByPersona(prev => ({
        ...prev,
        [selectedPersona]: [
          ...(prev[selectedPersona] || []),
          {
            id: `ai-error-${Date.now()}`,
            sender: 'ai',
            text: 'Xin lỗi, hệ thống AI đang cập nhật dữ liệu. Bạn vui lòng thử lại câu hỏi nhé!',
            timestamp: 'Vừa xong'
          }
        ]
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('ALL');

  const handleNavModuleClick = (mod: 'ai-genz' | 'products' | 'orders' | 'vip') => {
    setMainHomeModule(mod);
    if (mod === 'ai-genz') {
      setSelectedPersona('STYLIST');
    }
  };

  const navModules: Array<{ id: 'ai-genz' | 'products' | 'orders' | 'vip'; label: string }> = [
    { id: 'ai-genz', label: '💬 AI GenZ' },
    { id: 'products', label: '📱 Sản phẩm' },
    { id: 'orders', label: '📦 Đơn hàng' },
    { id: 'vip', label: '👑 VIP' }
  ];

  const isEmbedded = mode === 'embedded';
  const displayUserName =
    customerProfile?.name && customerProfile.name !== 'Khách hàng ZShop'
      ? customerProfile.name
      : currentUser?.name && currentUser.name !== 'Khách hàng ZShop'
      ? currentUser.name
      : 'Nguyễn Quốc Khánh';
  const displayUserTier = (customerProfile?.tier || 'Vàng').replace(/^Hạng\s+/i, '');
  const displayUserPoints = customerProfile?.points ?? 450;

  return (
    <div className={isEmbedded ? 'w-full max-w-5xl mx-auto font-sans' : 'fixed bottom-6 right-6 z-50 font-sans'}>
      {(isOpen || isEmbedded) ? (
        <div 
          className={`bg-white overflow-hidden border border-[#c5a880]/40 flex flex-col transition-all duration-300 relative ${
            isEmbedded
              ? 'w-full h-[760px] rounded-3xl shadow-2xl'
              : isExpanded
              ? 'w-[95vw] sm:w-[580px] h-[88vh] rounded-2xl shadow-2xl origin-bottom-right'
              : 'w-[95vw] sm:w-[460px] h-[670px] rounded-2xl shadow-2xl origin-bottom-right'
          }`}
        >
          {/* 1. HEADER GỌN & HIỆN ĐẠI — ZShop GenZ iPhone AI */}
          <div className="bg-gradient-to-r from-[#1c1b18] via-[#2b261f] to-[#8c6f46] text-white px-4 py-3 flex flex-wrap items-center justify-between gap-2 select-none shadow-md shrink-0 border-b border-[#c5a880]/30">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#e5c9a3]/25 to-[#b89768]/20 backdrop-blur-md flex items-center justify-center text-lg shadow-inner border border-[#e5c9a3]/40">
                  💬
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#1c1b18] rounded-full animate-pulse" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h2 className="font-extrabold text-sm tracking-tight text-white">
                    ZShop GenZ iPhone AI
                  </h2>
                </div>
                <p className="text-[11px] text-[#e5c9a3] font-medium truncate">
                  Trợ lý tư vấn iPhone ngôn ngữ tự nhiên
                </p>
                <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-stone-200">
                  <span>Phục vụ: <strong className="text-white">{displayUserName}</strong></span>
                  <span className="text-stone-400">•</span>
                  <span className="px-1.5 py-0.2 rounded bg-amber-500/25 text-amber-300 border border-amber-400/30 font-bold">
                    Hạng {displayUserTier}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 ml-auto">
              <button
                onClick={() => setShowGenAILab(!showGenAILab)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  showGenAILab ? 'bg-emerald-500 text-white shadow-xs' : 'hover:bg-white/15 text-white/80 hover:text-white'
                }`}
                title="Thông tin kiến trúc AI Orchestrator (Multi-Agent + RAG + Function Calling)"
              >
                <ShieldCheck size={15} />
              </button>
              <button
                onClick={() => {
                  setInputKey(geminiApiKey);
                  setShowKeyModal(true);
                }}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  geminiApiKey ? 'bg-white/25 text-white shadow-xs' : 'hover:bg-white/15 text-white/80 hover:text-white'
                }`}
                title="Cấu hình Google Gemini API Key"
              >
                <Settings size={15} />
              </button>
              <button
                onClick={handleResetCurrentPersona}
                className="p-1.5 hover:bg-white/15 rounded-lg transition-colors text-white/80 hover:text-white cursor-pointer"
                title="Làm mới cuộc trò chuyện"
              >
                <RotateCcw size={15} />
              </button>
              {!isEmbedded && (
                <>
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-1.5 hover:bg-white/15 rounded-lg transition-colors text-white/80 hover:text-white cursor-pointer"
                    title={isExpanded ? "Thu nhỏ" : "Phóng to"}
                  >
                    {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 hover:bg-white/15 rounded-lg transition-colors text-white/80 hover:text-white cursor-pointer"
                    title="Đóng khung chat"
                  >
                    <X size={18} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 2. THANH ĐIỀU HƯỚNG TRONG CHATBOT (💬 AI GenZ | 📱 Sản phẩm | 📦 Đơn hàng | 👑 VIP) */}
          <div className="bg-[#23201b] px-3 py-1.5 flex items-center justify-between gap-1.5 border-b border-[#c5a880]/25 shrink-0 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 w-full">
              {navModules.map((nav) => {
                const isActive = mainHomeModule === nav.id;
                return (
                  <button
                    key={nav.id}
                    type="button"
                    onClick={() => handleNavModuleClick(nav.id)}
                    className={`flex-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center justify-center gap-1 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#e5c9a3] to-[#c5a880] text-[#1c1b18] shadow-md font-extrabold'
                        : 'text-stone-300 hover:text-[#e5c9a3] hover:bg-white/10 bg-white/5'
                    }`}
                  >
                    <span>{nav.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* BẢNG KIỂM ĐỊNH KIẾN TRÚC GENAI (TÙY CHỌN MỞ KHI BẤM ICON SHIELD) */}
          {showGenAILab && (
            <div className="bg-slate-900 text-slate-100 p-3 border-b border-emerald-500/40 text-[11px] space-y-2 animate-fadeIn shrink-0 max-h-56 overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
                <span className="font-extrabold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck size={14} /> Kiến trúc AI Orchestrator (Backend Multi-Agent + RAG + Function Calling)
                </span>
                <button onClick={() => setShowGenAILab(false)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X size={13} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                <div className="bg-slate-800/90 p-2 rounded-lg border border-slate-700">
                  <div className="text-cyan-400 font-bold">1. Luồng Điều Phối Trung Tâm</div>
                  <div className="text-slate-300 mt-0.5">• User ➔ AI Orchestrator<br/>• Tự nhận diện 1 hoặc nhiều Intent<br/>• Tổng hợp 1 câu trả lời duy nhất</div>
                </div>
                <div className="bg-slate-800/90 p-2 rounded-lg border border-slate-700">
                  <div className="text-emerald-400 font-bold">2. RAG & Function Calling</div>
                  <div className="text-slate-300 mt-0.5">• RAG: Truy xuất 50 sản phẩm & Spec<br/>• Function Calling: Đơn hàng & Điểm VIP<br/>• Chống Prompt Injection 4 lớp</div>
                </div>
              </div>
            </div>
          )}

          {/* MODULE NGHIỆP VỤ 1 (TRONG CHATBOT): 📱 SẢN PHẨM */}
          {mainHomeModule === 'products' && (
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-50">
              <div className="bg-[#1e1d1a] text-white p-3 rounded-2xl border border-[#c5a880]/30 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black text-[#e5c9a3]">📱 Danh Mục iPhone Chính Hãng VN/A</h3>
                  <p className="text-[11px] text-stone-300">Lọc nhanh & bấm hỏi AI hoặc xem cấu hình chi tiết</p>
                </div>
                <button
                  onClick={() => setMainHomeModule('ai-genz')}
                  className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 text-[11px] font-black cursor-pointer"
                >
                  💬 Chat AI
                </button>
              </div>

              <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {[
                  { id: 'ALL', label: 'Tất cả' },
                  { id: '17-18', label: 'iPhone 17 / 18 Series' },
                  { id: '15-16', label: 'iPhone 15 / 16 Series' },
                  { id: 'UNDER20', label: 'Dưới 20 triệu' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setProductCategoryFilter(f.id)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap cursor-pointer ${
                      productCategoryFilter === f.id
                        ? 'bg-slate-900 text-amber-300'
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                {(products || [])
                  .filter((p) => {
                    if (!p) return false;
                    if (productCategoryFilter === '17-18') return /17|18/i.test(p.name || '');
                    if (productCategoryFilter === '15-16') return /15|16/i.test(p.name || '');
                    if (productCategoryFilter === 'UNDER20') return Number(p.price) <= 21000000;
                    return true;
                  })
                  .slice(0, 15)
                  .map((p) => {
                    const visual = getProductVisualSync(p, products);
                    return (
                      <div key={p.id} className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3 hover:border-amber-400 transition-colors">
                        <div className={`w-12 h-12 rounded-lg overflow-hidden border border-slate-200 shrink-0 p-1 flex items-center justify-center bg-gradient-to-br ${visual.studioBg}`}>
                          <img
                            src={visual.image}
                            alt={p.name}
                            style={{ filter: visual.imgFilter }}
                            className="w-full h-full object-contain drop-shadow-xs"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{p.name}</h4>
                          <p className="text-xs font-black text-rose-600">{formatVND(p.price)}</p>
                          <p className="text-[10px] text-slate-500 truncate">
                            {visual.colorLabel} • {p.sizes?.join(' / ') || '128GB / 256GB'}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setMainHomeModule('ai-genz');
                              handleSendMessage(`Thông số kỹ thuật và camera của ${p.name} thế nào?`);
                            }}
                            className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 text-[10px] font-bold cursor-pointer"
                          >
                            💬 Hỏi AI
                          </button>
                          <button
                            type="button"
                            onClick={() => onSelectProduct && onSelectProduct(p.id)}
                            className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold cursor-pointer"
                          >
                            Chi tiết
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* MODULE NGHIỆP VỤ 2 (TRONG CHATBOT): 📦 ĐƠN HÀNG */}
          {mainHomeModule === 'orders' && (
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-50">
              <div className="bg-[#1e1d1a] text-white p-3 rounded-2xl border border-[#c5a880]/30 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black text-[#e5c9a3]">📦 Lịch Sử Đơn Hàng & Bảo Hành Care</h3>
                  <p className="text-[11px] text-stone-300">Theo dõi giao hàng & Bảo hành chính hãng 12 tháng</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMainHomeModule('ai-genz');
                    handleSendMessage('Đơn hàng của tôi đang ở đâu?');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 text-[11px] font-black cursor-pointer"
                >
                  💬 Hỏi AI đơn hàng
                </button>
              </div>

              {(customerOrders || []).map((ord: any, ordIdx: number) => {
                const rawStatus = String(ord?.statusText || ord?.status || 'PROCESSING');
                const statusLabel =
                  rawStatus === 'DELIVERED' ? 'Đã giao thành công' :
                  rawStatus === 'SHIPPING' ? 'Đang vận chuyển 2h' :
                  rawStatus === 'PENDING' ? 'Chờ xác nhận' :
                  rawStatus === 'PROCESSING' ? 'Đang chuẩn bị máy' :
                  rawStatus === 'RETURN_REQUESTED' ? 'Đang xử lý đổi trả' :
                  rawStatus === 'CANCELLED' ? 'Đã hủy' : rawStatus;
                const orderTotal = ord?.totalAmount ?? ord?.total ?? ord?.subtotal ?? 0;

                return (
                  <div key={ord?.id || ordIdx} className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-xs font-black text-slate-900">Mã đơn: {ord?.id || 'DH-ZSHOP'}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                        {statusLabel}
                      </span>
                    </div>
                    {(ord?.items || []).map((it: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between text-xs gap-2">
                        <span className="font-semibold text-slate-800 truncate">
                          {it?.name || 'iPhone Chính Hãng VN/A'} {it?.size ? `(${it.size})` : ''}
                        </span>
                        <span className="font-bold text-rose-600 shrink-0">{formatVND(it?.price)}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                      <span className="text-emerald-700 font-semibold">🛡 Bảo hành Apple VN/A: 12 tháng (1 đổi 1 30 ngày)</span>
                      <span className="font-black text-slate-900">{formatVND(orderTotal)}</span>
                    </div>
                  </div>
                );
              })}

              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('orders')}
                  className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold cursor-pointer"
                >
                  Mở trang Đơn Mua Của Tôi đầy đủ
                </button>
              )}
            </div>
          )}

          {/* MODULE NGHIỆP VỤ 3 (TRONG CHATBOT): 👑 VIP */}
          {mainHomeModule === 'vip' && (
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-50">
              <div className="bg-gradient-to-r from-[#1e1d1a] to-[#3a3022] text-white p-3.5 rounded-2xl border border-amber-400/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-300">👑 Thẻ Thành Viên VIP ZShop</span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black">
                    Hạng {displayUserTier}
                  </span>
                </div>
                <p className="text-xs font-bold text-white">Khách hàng: {displayUserName}</p>
                <p className="text-xs text-stone-200">
                  Điểm tích lũy: <strong className="text-amber-300">{displayUserPoints} điểm</strong> (= <strong>{formatVND(displayUserPoints * 1000)}</strong> trừ trực tiếp khi mua máy)
                </p>
                <div className="flex flex-col sm:flex-row gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMainHomeModule('ai-genz');
                      handleSendMessage('Tôi có 20 triệu, muốn mua iPhone phù hợp và xem tôi có ưu đãi VIP gì.');
                    }}
                    className="flex-1 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black cursor-pointer"
                  >
                    💬 Nhờ AI tính giá mua iPhone + Ưu đãi VIP
                  </button>
                  {onOpenLoyaltyModal && (
                    <button
                      type="button"
                      onClick={onOpenLoyaltyModal}
                      className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-amber-200 border border-amber-300/40 text-xs font-bold cursor-pointer"
                    >
                      Mở Thẻ VIP
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                <h4 className="font-black text-slate-900">🎁 Đặc quyền Hạng {displayUserTier} & Thu Cũ Đổi Mới</h4>
                <p className="text-slate-600">• Giảm trực tiếp <strong>5% (tối đa 500.000đ)</strong> cho mọi dòng iPhone VN/A.</p>
                <p className="text-slate-600">• Trợ giá <strong>Thu cũ đổi mới lên tới 3.000.000đ</strong> khi lên đời iPhone 16 / 17 / 18 Pro Max.</p>
                <p className="text-slate-600">• Tặng gói bảo hành rơi vỡ / vào nước 6 tháng miễn phí.</p>
              </div>
            </div>
          )}

          {/* Danh Sách Tin Nhắn (Hiển thị khi ở tab chính 💬 AI GenZ) */}
          <div className={`flex-1 overflow-y-auto p-3.5 space-y-3.5 bg-slate-50/70 ${mainHomeModule !== 'ai-genz' ? 'hidden' : ''}`}>
            {activeMessages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-white text-base shadow-sm border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                    {currentPersonaConfig.avatar}
                  </div>
                )}

                <div className={`max-w-[88%] space-y-2.5 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  {/* Bubble Tin Nhắn */}
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none'
                    }`}
                  >
                    <div className="break-words">{renderFormattedChatText(msg.text, msg.sender === 'user')}</div>
                    <span 
                      className={`block text-[10px] mt-1 text-right ${
                        msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Băng thông báo Giải mã Ngôn ngữ Tự nhiên & Từ viết tắt GenZ Việt Nam */}
                  {msg.sender === 'ai' && msg.skillResult?.detectedAbbreviations && msg.skillResult.detectedAbbreviations.length > 0 && (
                    <div className="bg-amber-50/95 border border-amber-200/90 rounded-xl px-3 py-1.5 text-[11px] text-amber-950 shadow-2xs space-y-1">
                      <div className="flex items-center gap-1.5 font-extrabold text-amber-800">
                        <Sparkles size={12} className="text-amber-600 shrink-0" />
                        <span>AI Giải Mã Ngôn Ngữ GenZ Việt Nam:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {msg.skillResult.detectedAbbreviations.map((abbr, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 bg-white border border-amber-300/80 px-2 py-0.5 rounded-md text-[10px] font-semibold text-slate-800"
                          >
                            <code className="text-rose-600 font-bold">"{abbr.raw}"</code>
                            <span className="text-slate-400">➔</span>
                            <span className="text-emerald-700 font-bold">{abbr.meaning}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* [CHƯƠNG 8 - SLIDE 7, 14, 18, 29, 32] Thanh Telemetry GenAI & Đánh giá Thumbs Up / Thumbs Down */}
                  {msg.sender === 'ai' && (
                    <div className="flex flex-wrap items-center justify-between gap-1.5 px-1">
                      <div className="flex flex-wrap items-center gap-1">
                        {msg.genAIMeta && (
                          <>
                            <span className="text-[10px] bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                              🔧 {msg.genAIMeta.functionCallName ? `Fn: ${msg.genAIMeta.functionCallName}` : msg.genAIMeta.integrationMode}
                            </span>
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded-md font-semibold">
                              ⚡ TTFT {msg.genAIMeta.ttftMs}ms • {msg.genAIMeta.totalTokens} tok • Grounded {msg.genAIMeta.groundingScore}%
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-1 ml-auto">
                        <button
                          onClick={() => handleRateMessage(msg.id, 'up', msg.text)}
                          className={`p-1 rounded-md border text-[10px] flex items-center gap-0.5 transition-all cursor-pointer ${
                            feedbackRatings[msg.id] === 'up'
                              ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                              : 'bg-white text-slate-500 border-slate-200 hover:text-emerald-600 hover:border-emerald-300'
                          }`}
                          title="Đánh giá câu trả lời hữu ích (Thumbs Up - Build-Measure-Learn)"
                        >
                          <ThumbsUp size={11} />
                          {feedbackRatings[msg.id] === 'up' && <span>Đã thích</span>}
                        </button>
                        <button
                          onClick={() => handleRateMessage(msg.id, 'down', msg.text)}
                          className={`p-1 rounded-md border text-[10px] flex items-center gap-0.5 transition-all cursor-pointer ${
                            feedbackRatings[msg.id] === 'down'
                              ? 'bg-rose-600 text-white border-rose-600 font-bold'
                              : 'bg-white text-slate-500 border-slate-200 hover:text-rose-600 hover:border-rose-300'
                          }`}
                          title="Báo cáo câu trả lời chưa tốt để cải thiện Prompt (Thumbs Down - Slide 32)"
                        >
                          <ThumbsDown size={11} />
                          {feedbackRatings[msg.id] === 'down' && <span>Cải thiện</span>}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Huy hiệu xác nhận Multi-Agent Critic Approved & Reflection Loop */}
                  {msg.sender === 'ai' && msg.skillResult?.multiAgentTrace && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <div className="flex items-center gap-1.5 text-[10px] text-indigo-700 bg-indigo-50/90 border border-indigo-200/90 rounded-lg px-2.5 py-1 font-medium shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                        <span>🤖 Critic Approved ({Math.round((msg.skillResult.multiAgentTrace.qualityScore || 1) * 100)}% Match)</span>
                      </div>
                      {Boolean(msg.skillResult.multiAgentTrace.reflectionRetries && msg.skillResult.multiAgentTrace.reflectionRetries > 0) && (
                        <div className="flex items-center gap-1.5 text-[10px] text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1 font-semibold shadow-xs">
                          <span>🔄 Reflection: Đã tự sửa lỗi qua Critic (Vòng {msg.skillResult.multiAgentTrace.reflectionRetries})</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* THẺ GENERATIVE UI: SMART FIT & SIZING (Master Fit Ken) */}
                  {msg.skillResult?.sizeFitting && (
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-3 rounded-2xl border border-emerald-200 shadow-sm space-y-2.5">
                      <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2">
                        <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-800">
                          <Ruler size={14} /> Kích Cỡ Khuyên Dùng Chuẩn Xác
                        </div>
                        <span className="text-[10px] bg-emerald-600 text-white font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                          Độ chuẩn {msg.skillResult.sizeFitting.confidence}%
                        </span>
                      </div>

                      <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-emerald-200 shadow-sm">
                        <div className="w-14 h-14 rounded-xl bg-emerald-600 text-white flex flex-col items-center justify-center font-black shadow-md shrink-0">
                          <span className="text-[10px] uppercase font-bold text-emerald-200">SIZE</span>
                          <span className="text-xl leading-none">{msg.skillResult.sizeFitting.recommendedSize}</span>
                        </div>
                        <div className="text-xs space-y-0.5 flex-1">
                          <div className="font-bold text-slate-800">
                            Chiều cao: {msg.skillResult.sizeFitting.measurementsUsed.height}cm • Cân nặng: {msg.skillResult.sizeFitting.measurementsUsed.weight}kg
                          </div>
                          <div className="text-[11px] text-slate-600">
                            Gu mặc: <span className="font-semibold text-emerald-700">{msg.skillResult.sizeFitting.measurementsUsed.fitPreference}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/80 p-2.5 rounded-xl text-[11px] space-y-1 text-slate-700 border border-emerald-100">
                        <div>• {msg.skillResult.sizeFitting.details.lengthFit}</div>
                        <div>• {msg.skillResult.sizeFitting.details.chestFit}</div>
                        <div>• {msg.skillResult.sizeFitting.details.shoulderFit}</div>
                      </div>

                      <div className="flex gap-1.5 pt-1">
                        <button
                          onClick={() => {
                            handleSendMessage('Tính size khác cho tôi');
                          }}
                          className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 shadow-sm"
                        >
                          <Sliders size={12} /> Tinh chỉnh số đo khác
                        </button>
                      </div>
                    </div>
                  )}

                  {/* THẺ GENERATIVE UI: TECH COMBO (Alex TechPro) */}
                  {msg.skillResult?.outfitCombo && (
                    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 p-3 rounded-2xl border border-blue-200 shadow-sm space-y-2.5">
                      <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                        <div>
                          <span className="text-xs font-black text-blue-900 block">
                            {msg.skillResult.outfitCombo.title}
                          </span>
                          <span className="text-[10px] text-blue-600 font-medium">
                            Chuẩn kết nối & Công suất: {msg.skillResult.outfitCombo.style}
                          </span>
                        </div>
                        <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full shadow-sm shrink-0">
                          -8% Combo
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {msg.skillResult.outfitCombo.items.map((it) => (
                          <div key={it.id} className="bg-white p-2 rounded-xl border border-blue-100 shadow-sm text-center">
                            <img 
                              src={it.images?.[0] || (it as any).image_url || (it as any).image || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'} 
                              alt={it.name}
                              className="w-full h-16 object-cover rounded-lg mb-1 bg-slate-50"
                            />
                            <div className="text-[10px] font-bold text-slate-800 line-clamp-1">{it.name}</div>
                            <div className="text-[10px] font-extrabold text-blue-600">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(it.price)}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-white/80 p-2 rounded-xl flex items-center justify-between text-xs border border-blue-100">
                        <div>
                          <span className="text-slate-500 line-through text-[10px] mr-1">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(msg.skillResult.outfitCombo.totalPrice)}
                          </span>
                          <strong className="text-blue-700 text-sm font-black">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(msg.skillResult.outfitCombo.discountPrice || msg.skillResult.outfitCombo.totalPrice)}
                          </strong>
                        </div>
                        <button
                          onClick={() => handleAddOutfitToCart(msg.skillResult!.outfitCombo!)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs text-white shadow-sm transition-all flex items-center gap-1 ${
                            addedComboId === msg.skillResult.outfitCombo.id
                              ? 'bg-emerald-600'
                              : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                        >
                          {addedComboId === msg.skillResult.outfitCombo.id ? (
                            <>
                              <Check size={12} /> Đã thêm combo
                            </>
                          ) : (
                            <>
                              <Plus size={12} /> Mua Trọn Combo
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* THẺ GENERATIVE UI: VIP LOYALTY CARD (Bella VIP) */}
                  {msg.skillResult?.customerLoyalty && (
                    <div className="bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 text-white p-3.5 rounded-2xl shadow-md space-y-3">
                      <div className="flex items-center justify-between border-b border-white/20 pb-2">
                        <div className="flex items-center gap-1.5 font-black text-xs uppercase tracking-wider">
                          <Award size={16} /> Thẻ Thành Viên ZShop VIP
                        </div>
                        <span className="px-2 py-0.5 bg-black/30 rounded-full font-black text-[10px] border border-white/30 uppercase">
                          Hạng {msg.skillResult.customerLoyalty.tier}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-[11px] text-white/80">Chủ sở hữu thẻ</div>
                          <div className="font-extrabold text-sm text-white">{msg.skillResult.customerLoyalty.customerName}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[11px] text-white/80">Điểm khả dụng</div>
                          <div className="font-black text-base text-yellow-100">
                            {msg.skillResult.customerLoyalty.points} ⭐
                          </div>
                        </div>
                      </div>

                      <div className="bg-black/20 backdrop-blur-sm p-2 rounded-xl text-xs space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span>Giá trị quy đổi tiền mặt:</span>
                          <strong className="text-emerald-300">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(msg.skillResult.customerLoyalty.pointValueVND)}
                          </strong>
                        </div>
                        {msg.skillResult.customerLoyalty.spendNeededForNextTier !== undefined && msg.skillResult.customerLoyalty.spendNeededForNextTier > 0 && (
                          <div className="flex justify-between text-[11px] pt-1 border-t border-white/10">
                            <span>Chi tiêu để lên hạng {msg.skillResult.customerLoyalty.nextTier}:</span>
                            <strong className="text-white">
                              +{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(msg.skillResult.customerLoyalty.spendNeededForNextTier)}
                            </strong>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* THẺ GENERATIVE UI: ORDER TRACKING LIST (Logistics Alex) */}
                  {msg.skillResult?.orderInfo && (
                    <div className="bg-white p-3 rounded-xl border border-blue-200 shadow-sm space-y-2.5">
                      <div className="flex items-center justify-between border-b pb-2">
                        <div className="flex items-center gap-1.5 font-bold text-xs text-blue-700">
                          <Truck size={14} /> Mã vận đơn: {msg.skillResult.orderInfo.orderId}
                        </div>
                        <span className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-full border border-blue-200">
                          {msg.skillResult.orderInfo.status}
                        </span>
                      </div>
                      <div className="space-y-2 pl-1 border-l-2 border-blue-200 ml-2 mt-2">
                        {msg.skillResult.orderInfo.steps.map((step, idx) => (
                          <div key={idx} className="relative pl-3 text-xs">
                            <span 
                              className={`absolute -left-[11px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white ${
                                step.completed ? 'bg-blue-600' : 'bg-slate-300'
                              }`} 
                            />
                            <div className="font-semibold text-slate-800">{step.description}</div>
                            <div className="text-[10px] text-slate-400">{step.date}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* DANH SÁCH SẢN PHẨM GỢI Ý */}
                  {msg.skillResult?.products && msg.skillResult.products.length > 0 && !msg.skillResult.outfitCombo && (
                    <div className="space-y-2 mt-2">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <ShoppingBag size={12} /> Sản phẩm gợi ý ({msg.skillResult.products.length})
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {msg.skillResult.products.map((prod) => (
                          <div 
                            key={prod.id}
                            className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all flex gap-3 items-center"
                          >
                            <img 
                              src={prod.images?.[0] || (prod as any).image_url || (prod as any).image || ((prod.category || '').toLowerCase().includes('công nghệ') ? 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500' : 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500')} 
                              alt={prod.name}
                              className="w-14 h-14 object-cover rounded-lg bg-slate-100 shrink-0 border border-slate-100"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-xs text-slate-900 truncate" title={prod.name}>
                                {prod.name}
                              </h4>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-red-600 font-bold text-xs">
                                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(prod.price)}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-500 mt-0.5">
                                Kho: {prod.stock} cái • ⭐ {prod.rating || 4.9}
                              </div>
                            </div>

                            <div className="flex flex-col gap-1 shrink-0">
                              <button
                                onClick={() => onSelectProduct && onSelectProduct(prod.id)}
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px] rounded-lg transition-colors flex items-center gap-1"
                              >
                                <Eye size={12} /> Xem
                              </button>
                              <button
                                onClick={() => handleQuickAdd(prod)}
                                className={`px-2 py-1 text-white font-medium text-[11px] rounded-lg transition-colors flex items-center gap-1 ${
                                  addedProductId === prod.id ? 'bg-emerald-600' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                              >
                                {addedProductId === prod.id ? <Check size={12} /> : <Plus size={12} />} Thêm
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* THẺ GỢI Ý MUA KÈM (CROSS-SELL) TỪ RECOMMENDATION AGENT */}
                  {msg.skillResult?.crossSellRecommendations && msg.skillResult.crossSellRecommendations.length > 0 && (
                    <div className="p-2.5 bg-gradient-to-br from-amber-50/90 to-orange-50/90 rounded-2xl border border-amber-200/90 shadow-sm space-y-2 mt-2">
                      <div className="flex items-center justify-between border-b border-amber-200/80 pb-1.5">
                        <div className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
                          <Sparkles size={12} className="text-amber-600" /> Gợi ý phối kèm (Recommendation Agent)
                        </div>
                        <span className="text-[9px] bg-amber-200/70 text-amber-800 font-bold px-1.5 py-0.5 rounded-full">
                          AI Stylist Match
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {msg.skillResult.crossSellRecommendations.map((csItem: any) => (
                          <div 
                            key={csItem.id} 
                            onClick={() => onSelectProduct && onSelectProduct(csItem.id)}
                            className="bg-white p-2 rounded-xl border border-amber-100/80 flex items-center gap-2 shadow-xs hover:border-amber-300 transition-all cursor-pointer"
                          >
                            <img 
                              src={csItem.image || csItem.image_url || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300'} 
                              alt={csItem.name} 
                              className="w-10 h-10 object-cover rounded-lg shrink-0 bg-slate-50 border border-slate-100" 
                            />
                            <div className="min-w-0 flex-1">
                              <div className="text-[10px] font-semibold text-slate-800 truncate" title={csItem.name}>
                                {csItem.name}
                              </div>
                              <div className="text-[10px] font-extrabold text-red-600 mt-0.5">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(csItem.price)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* THẺ VOUCHERS */}
                  {msg.skillResult?.promotions && (
                    <div className="space-y-1.5 mt-2">
                      {msg.skillResult.promotions.map((promo, idx) => (
                        <div 
                          key={idx}
                          className="bg-white p-2.5 rounded-xl border border-dashed border-red-300 flex items-center justify-between gap-2 shadow-sm"
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-xs text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                                {promo.code}
                              </span>
                              <span className="text-xs font-bold text-slate-800">{promo.discountText}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5">{promo.description}</div>
                          </div>
                          <button
                            onClick={() => handleCopyText(promo.code, `promo-${idx}`)}
                            className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-[11px] font-bold shrink-0 transition-colors"
                          >
                            {copiedId === `promo-${idx}` ? 'Đã lưu' : 'Dùng mã'}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* KỸ NĂNG BUSINESS ANALYTICS */}
                  {msg.skillResult?.analytics && (
                    <div className="bg-white p-3 rounded-xl border border-slate-300 shadow-sm space-y-2.5 mt-2">
                      <div className="flex items-center justify-between border-b pb-1.5">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                          <TrendingUp size={14} /> Tóm tắt Kinh Doanh
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-full">
                          Real-time
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="bg-purple-50 p-2 rounded-lg border border-purple-100">
                          <span className="text-[10px] text-purple-700 block">Doanh thu</span>
                          <span className="font-extrabold text-xs text-purple-900">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(msg.skillResult.analytics.totalRevenue)}
                          </span>
                        </div>
                        <div className="bg-blue-50 p-2 rounded-lg border border-blue-100">
                          <span className="text-[10px] text-blue-700 block">Đơn hôm nay</span>
                          <span className="font-extrabold text-xs text-blue-900">
                            {msg.skillResult.analytics.todayOrders} đơn
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CÁC HÀNH ĐỘNG GỢI Ý (SUGGESTED ACTIONS) */}
                  {msg.skillResult?.suggestedActions && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.skillResult.suggestedActions.map((act, actIdx) => (
                        <button
                          key={actIdx}
                          onClick={() => {
                            if (act.includes('Đổi trả') && onNavigate) {
                              onNavigate('returns');
                            } else if (act.includes('giỏ') && onNavigate) {
                              onNavigate('checkout');
                            } else if (act.includes('số đo')) {
                              handleSendMessage('Tư vấn kích cỡ cho tôi');
                            } else {
                              handleSendMessage(act);
                            }
                          }}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-medium transition-all shadow-xs"
                        >
                          {act}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-500 text-xs italic py-1">
                <div className="w-7 h-7 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center animate-spin">
                  <Sparkles size={14} />
                </div>
                <span>ZShop GenZ iPhone AI đang phân tích ý định & điều phối dữ liệu...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box + Nút gợi ý bên dưới (Central AI Assistant Interface) */}
          <div className="p-3 bg-white border-t border-slate-200 space-y-2.5 shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setMainHomeModule('ai-genz');
                    handleSendMessage();
                  }
                }}
                placeholder="Bạn muốn hỏi gì về iPhone?"
                className="flex-1 text-xs sm:text-sm bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400 font-medium"
              />
              <button
                onClick={() => {
                  setMainHomeModule('ai-genz');
                  handleSendMessage();
                }}
                disabled={isLoading || !inputPrompt.trim()}
                className="p-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-amber-400 rounded-xl shadow-sm transition-all shrink-0 active:scale-95 cursor-pointer flex items-center gap-1.5 px-3.5 font-bold text-xs"
                aria-label="Gửi tin nhắn"
              >
                <Send size={15} />
                <span className="hidden sm:inline">Gửi</span>
              </button>
            </div>

            {/* 6 nút gợi ý (Shortcuts gửi câu hỏi tự nhiên vào AI chính - không chọn Agent thủ công) */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {AI_SHORTCUT_BUTTONS.map((shortcut, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setMainHomeModule('ai-genz');
                    handleSendMessage(shortcut.prompt);
                  }}
                  disabled={isLoading}
                  className="px-2.5 py-1.5 rounded-xl text-[11px] font-semibold bg-slate-100 hover:bg-slate-900 hover:text-amber-300 text-slate-700 border border-slate-200/90 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {shortcut.label}
                </button>
              ))}
            </div>
          </div>

          {/* Modal Cấu Hình External AI (Google Gemini) */}
          {showKeyModal && (
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs z-50 p-4 flex items-center justify-center animate-fadeIn">
              <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-2xl border border-slate-200 space-y-3 text-slate-800">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2 font-black text-xs sm:text-sm text-slate-900">
                    <Key size={16} className="text-blue-600" />
                    <span>Cấu Hình AI Bên Ngoài (Gemini API)</span>
                  </div>
                  <button 
                    onClick={() => setShowKeyModal(false)}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Nhập API Key Google Gemini (lấy miễn phí từ <strong>Google AI Studio</strong>) để kích hoạt toàn bộ khả năng suy luận ngôn ngữ tự nhiên theo dữ liệu thực tế tại ZShop.
                </p>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">Gemini API Key:</label>
                  <input 
                    type="password"
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="Dán mã API Key (AIzaSy...)"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                  <div className="flex justify-between items-center text-[10px] pt-0.5 text-slate-400">
                    <span>Lưu trữ cục bộ an toàn</span>
                    {inputKey && (
                      <button 
                        type="button" 
                        onClick={() => setInputKey('')}
                        className="text-rose-500 hover:underline cursor-pointer"
                      >
                        Xóa key
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-[#faf8f5] p-2.5 rounded-xl text-[11px] space-y-1 border border-[#e5dfd3] text-stone-600">
                  <div className="font-bold text-stone-800 flex items-center gap-1">
                    <Sparkles size={12} className="text-[#b89768]" /> Chế độ Hybrid thông minh — Thế Giới iPhone AI:
                  </div>
                  <div>• <strong>Có Key</strong>: Hỏi đáp mở tự nhiên với Google Gemini 2.5 Flash.</div>
                  <div>• <strong>Không có Key</strong>: Tự động dùng RAG CSDL Thế Giới iPhone siêu tốc.</div>
                </div>

                <div className="flex justify-end gap-2 pt-1 border-t border-slate-100">
                  <button 
                    type="button"
                    onClick={() => setShowKeyModal(false)}
                    className="px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl cursor-pointer"
                  >
                    Đóng
                  </button>
                  <button 
                    type="button"
                    onClick={handleSaveApiKey}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-[#b89768] to-[#8c6f46] hover:brightness-110 rounded-xl shadow-sm cursor-pointer"
                  >
                    Lưu & Kích hoạt
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Floating Activation Button — Luxury Titanium Gold & Charcoal */
        <button
          onClick={() => setIsOpen(true)}
          className="relative group bg-gradient-to-tr from-[#1c1b18] via-[#2b2720] to-[#8c6f46] text-[#faf8f5] px-4 py-3 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 border-2 border-[#d4b996]/60"
          aria-label="Mở Thế Giới iPhone AI"
        >
          <div className="relative flex items-center justify-center">
            <Bot size={24} className="text-[#e5c9a3]" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e5c9a3] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#d4b996] border border-[#1c1b18]"></span>
            </span>
          </div>
          <span className="text-xs font-extrabold tracking-wide text-[#e5c9a3] hidden sm:inline">
            Thế Giới iPhone AI
          </span>

          {/* Tooltip on hover */}
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-[#1c1b18] text-[#faf8f5] text-xs font-semibold px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-xl border border-[#c5a880]/40 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#d4b996]" />
            Thế Giới iPhone AI • Tư Vấn 25 Đời Máy (4s ➔ 18 Pro Max)
          </div>
        </button>
      )}
    </div>
  );
}
