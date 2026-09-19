import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, X, Send, Bot, Sparkles, ShoppingBag, Eye, Plus, 
  TrendingUp, AlertTriangle, Truck, Copy, Check, BarChart2, Tag, 
  RotateCcw, Maximize2, Minimize2, UserCheck, ShieldAlert,
  Ruler, Award, Shirt, Sliders, ChevronRight, Settings, Key, Cpu
} from 'lucide-react';
import { 
  ProductDetail, CartItem, UserRole, AIPersonaType, 
  UserMeasurements, CustomerContext, CustomerProfile, Order 
} from '../types';
import { AISkillEngine, AISkillResult, AI_PERSONAS, AIPersonaConfig } from '../aiSkills';
import { MOCK_PRODUCTS_LIST, MOCK_ORDER } from '../constants';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  skillResult?: AISkillResult;
}

interface ChatBotProps {
  products?: ProductDetail[];
  cartItems?: CartItem[];
  onAddToCart?: (item: CartItem) => void;
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
}

export default function ChatBot({
  products = MOCK_PRODUCTS_LIST,
  cartItems = [],
  onAddToCart,
  onSelectProduct,
  userRole = UserRole.CUSTOMER,
  currentView,
  onNavigate,
  currentUser,
  customerProfile,
  customerOrders = [MOCK_ORDER]
}: ChatBotProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [selectedPersona, setSelectedPersona] = useState<AIPersonaType>('STYLIST');
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const [addedComboId, setAddedComboId] = useState<string | null>(null);
  const [isMultiAgentActive, setIsMultiAgentActive] = useState<boolean>(true);

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

  // State form nhập số đo nhanh trong tab Fitting
  const [showMeasureForm, setShowMeasureForm] = useState<boolean>(false);
  const [tempHeight, setTempHeight] = useState<number>(measurements.height || 172);
  const [tempWeight, setTempWeight] = useState<number>(measurements.weight || 65);
  const [tempFit, setTempFit] = useState<'tight' | 'regular' | 'loose'>(measurements.preferredFit || 'regular');

  // Lưu lịch sử tin nhắn riêng biệt cho từng Persona
  const buildContext = (): CustomerContext => ({
    currentUser,
    customerProfile,
    cartItems,
    allProducts: products,
    customerOrders,
    measurements
  });

  const [messagesByPersona, setMessagesByPersona] = useState<Record<AIPersonaType, ChatMessage[]>>(() => {
    const ctx = {
      currentUser,
      customerProfile,
      cartItems,
      allProducts: products,
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

  // Lắng nghe sự kiện mở ChatBot từ các trang khác (như trang Đơn Mua Của Tôi)
  useEffect(() => {
    const handleOpenChatEvent = (e: any) => {
      setIsOpen(true);
      if (e.detail?.persona) {
        setSelectedPersona(e.detail.persona);
      }
      if (e.detail?.prompt) {
        setInputPrompt(e.detail.prompt);
      }
    };
    window.addEventListener('zshop:open-chatbot', handleOpenChatEvent);
    return () => window.removeEventListener('zshop:open-chatbot', handleOpenChatEvent);
  }, []);

  // Cập nhật lời chào khi thông tin khách hàng hoặc giỏ hàng thay đổi
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
  }, [customerProfile?.id, cartItems.length]);

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

  // Thêm nhanh vào giỏ hàng
  const handleQuickAdd = (product: ProductDetail) => {
    if (onAddToCart) {
      const productImage = product.images?.[0] || (product as any).image_url || (product as any).image || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500';
      const cartItem: CartItem = {
        id: `cart-${product.id}-${Date.now()}`,
        name: product.name,
        price: product.price,
        quantity: 1,
        size: product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Freesize',
        image: productImage
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

  // Lưu và áp dụng số đo mới
  const handleApplyMeasurements = (h: number, w: number, f: 'tight' | 'regular' | 'loose') => {
    const updated: UserMeasurements = { height: h, weight: w, preferredFit: f };
    setMeasurements(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (_) {}
    setShowMeasureForm(false);

    // Kích hoạt tính size tự động
    handleSendMessage(`Tính size cho tôi: cao ${h}cm nặng ${w}kg form ${f === 'loose' ? 'rộng' : f === 'tight' ? 'ôm' : 'vừa'}`);
  };

  // Gửi tin nhắn
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputPrompt).trim();
    if (!query || isLoading) return;

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

    try {
      const ctx = buildContext();
      let aiResult: AISkillResult;

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

        if (response && response.ok) {
          const data = await response.json();
          if (data.skillResult) {
            aiResult = data.skillResult;
          } else {
            aiResult = await AISkillEngine.executePersonaSkill(query, selectedPersona, ctx);
            if (data.text) aiResult.message = data.text;
          }
        } else {
          aiResult = await AISkillEngine.executePersonaSkill(query, selectedPersona, ctx);
        }
      } catch (_) {
        aiResult = await AISkillEngine.executePersonaSkill(query, selectedPersona, ctx);
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResult.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        skillResult: aiResult
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

  // Xác định danh sách Persona khả dụng theo quyền
  const availablePersonas: AIPersonaType[] = [
    'STYLIST', 
    'FITTING', 
    'ORDERS', 
    'LOYALTY',
    ...(userRole === UserRole.ADMIN || userRole === UserRole.SELLER || userRole === UserRole.SALES || userRole === UserRole.WAREHOUSE 
        ? (['BUSINESS'] as AIPersonaType[]) 
        : [])
  ];

  const activeChips = currentPersonaConfig.quickPromptChips(buildContext());

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {isOpen ? (
        <div 
          className={`bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200/80 flex flex-col transition-all duration-300 transform origin-bottom-right relative ${
            isExpanded ? 'w-[95vw] sm:w-[580px] h-[88vh]' : 'w-[95vw] sm:w-[440px] h-[640px]'
          }`}
        >
          {/* Header Thông Tin Chuyên Gia AI */}
          <div className={`bg-gradient-to-r ${currentPersonaConfig.themeGradient} text-white p-3.5 px-4 flex items-center justify-between select-none shadow-md shrink-0`}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shadow-inner border border-white/30">
                  {currentPersonaConfig.avatar}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm tracking-tight">{currentPersonaConfig.name}</h3>
                  <span className="text-[10px] font-bold bg-white/25 px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                    {currentPersonaConfig.badge}
                  </span>
                </div>
                <p className="text-[11px] text-white/90 line-clamp-1 font-medium">{currentPersonaConfig.roleTitle}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setInputKey(geminiApiKey);
                  setShowKeyModal(true);
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  geminiApiKey ? 'bg-white/30 text-white shadow-xs' : 'hover:bg-white/20 text-white/80 hover:text-white'
                }`}
                title="Cấu hình Google Gemini AI (AI Bên Ngoài)"
              >
                <Settings size={15} />
              </button>
              <button
                onClick={handleResetCurrentPersona}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-white/80 hover:text-white"
                title="Làm mới cuộc trò chuyện với AI này"
              >
                <RotateCcw size={15} />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-white/80 hover:text-white"
                title={isExpanded ? "Thu nhỏ" : "Phóng to"}
              >
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-white/80 hover:text-white"
                title="Đóng khung chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Thanh Trạng Thái AI Engine (Flask Multi-Agent / Google Gemini / Local RAG) */}
          <div className="bg-slate-950 text-slate-300 px-3.5 py-1 flex items-center justify-between text-[10px] shrink-0 border-b border-slate-800">
            <div className="flex items-center gap-1.5 truncate">
              <span className={`w-2 h-2 rounded-full shrink-0 ${isMultiAgentActive ? 'bg-emerald-400 animate-pulse' : (geminiApiKey ? 'bg-purple-400' : 'bg-blue-400')}`} />
              <span className="font-semibold text-slate-200 truncate">
                {isMultiAgentActive 
                  ? 'Flask Multi-Agent Architecture (Orchestrator + 5 Agents)' 
                  : (geminiApiKey ? 'Google Gemini 1.5 Flash (AI Đám Mây)' : 'Hybrid RAG (CSDL ZShop + Suy Luận)')}
              </span>
            </div>
            <button 
              onClick={() => {
                setInputKey(geminiApiKey);
                setShowKeyModal(true);
              }}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold underline cursor-pointer shrink-0 ml-1"
            >
              {geminiApiKey ? 'Đổi Key' : 'Nối AI Ngoài'}
            </button>
          </div>

          {/* Thanh Nhận Diện Khách Hàng Cá Nhân Hóa (Customer Context Banner) */}
          <div className="bg-slate-900 text-slate-200 px-3.5 py-1.5 flex items-center justify-between text-[11px] shrink-0 border-b border-slate-800">
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <span className="text-slate-400">Phục vụ:</span>
              <strong className="text-white truncate">
                {customerProfile?.name || currentUser?.name || 'Khách vãng lai'}
              </strong>
              {customerProfile && (
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-extrabold ${
                  customerProfile.tier === 'Kim Cương' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                  customerProfile.tier === 'Vàng' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  customerProfile.tier === 'Bạc' ? 'bg-slate-300/20 text-slate-200 border border-slate-400/30' :
                  'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                }`}>
                  ★ Hạng {customerProfile.tier}
                </span>
              )}
            </div>

            {customerProfile && (
              <div className="flex items-center gap-1 font-medium text-amber-400 shrink-0">
                <span>💰 {customerProfile.points} điểm</span>
              </div>
            )}
          </div>

          {/* Thanh Chọn Chuyên Gia AI (Persona Switcher Tabs) */}
          <div className="bg-slate-100 p-1.5 px-2 flex gap-1 overflow-x-auto no-scrollbar border-b border-slate-200 shrink-0">
            {availablePersonas.map((personaKey) => {
              const p = AI_PERSONAS[personaKey];
              const isSelected = selectedPersona === personaKey;
              return (
                <button
                  key={personaKey}
                  onClick={() => handleSwitchPersona(personaKey)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 shadow-sm ${
                    isSelected
                      ? 'bg-white text-slate-900 shadow-md ring-2 ring-blue-500/30 font-extrabold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 bg-white/40'
                  }`}
                >
                  <span className="text-sm">{p.avatar}</span>
                  <span>{p.name.split(' ')[1] || p.name}</span>
                </button>
              );
            })}
          </div>

          {/* Form Nhập Số Đo Nhanh trong Persona Fitting */}
          {selectedPersona === 'FITTING' && showMeasureForm && (
            <div className="bg-emerald-50 border-b border-emerald-200 p-3 text-xs space-y-2.5 animate-fadeIn">
              <div className="flex items-center justify-between font-bold text-emerald-900">
                <span className="flex items-center gap-1">
                  <Sliders size={13} /> Nhập số đo vóc dáng chuẩn ZShop
                </span>
                <button 
                  onClick={() => setShowMeasureForm(false)}
                  className="text-emerald-700 hover:text-emerald-900"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-emerald-800 font-semibold block mb-0.5">
                    Chiều cao: <strong className="text-emerald-950">{tempHeight} cm</strong>
                  </label>
                  <input 
                    type="range" 
                    min={145} 
                    max={200} 
                    value={tempHeight} 
                    onChange={(e) => setTempHeight(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-emerald-800 font-semibold block mb-0.5">
                    Cân nặng: <strong className="text-emerald-950">{tempWeight} kg</strong>
                  </label>
                  <input 
                    type="range" 
                    min={40} 
                    max={120} 
                    value={tempWeight} 
                    onChange={(e) => setTempWeight(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex gap-1 text-[11px]">
                  <button 
                    onClick={() => setTempFit('tight')}
                    className={`px-2 py-1 rounded-lg border font-medium ${tempFit === 'tight' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700'}`}
                  >
                    Ôm sát
                  </button>
                  <button 
                    onClick={() => setTempFit('regular')}
                    className={`px-2 py-1 rounded-lg border font-medium ${tempFit === 'regular' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700'}`}
                  >
                    Vừa vặn
                  </button>
                  <button 
                    onClick={() => setTempFit('loose')}
                    className={`px-2 py-1 rounded-lg border font-medium ${tempFit === 'loose' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700'}`}
                  >
                    Rộng (Oversize)
                  </button>
                </div>
                <button
                  onClick={() => handleApplyMeasurements(tempHeight, tempWeight, tempFit)}
                  className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold shadow-sm"
                >
                  Xác nhận & Tính Size
                </button>
              </div>
            </div>
          )}

          {/* Danh Sách Tin Nhắn */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 bg-slate-50/70">
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
                    <div className="whitespace-pre-line break-words">{msg.text}</div>
                    <span 
                      className={`block text-[10px] mt-1 text-right ${
                        msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>

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
                            setShowMeasureForm(true);
                          }}
                          className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 shadow-sm"
                        >
                          <Sliders size={12} /> Tinh chỉnh số đo khác
                        </button>
                      </div>
                    </div>
                  )}

                  {/* THẺ GENERATIVE UI: OUTFIT LOOKBOOK (Stylist Emma) */}
                  {msg.skillResult?.outfitCombo && (
                    <div className="bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 p-3 rounded-2xl border border-pink-200 shadow-sm space-y-2.5">
                      <div className="flex items-center justify-between border-b border-pink-200 pb-2">
                        <div>
                          <span className="text-xs font-black text-rose-900 block">
                            {msg.skillResult.outfitCombo.title}
                          </span>
                          <span className="text-[10px] text-rose-600 font-medium">
                            Phong cách: {msg.skillResult.outfitCombo.style}
                          </span>
                        </div>
                        <span className="text-[10px] bg-rose-500 text-white font-bold px-2 py-0.5 rounded-full shadow-sm shrink-0">
                          -8% Combo
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {msg.skillResult.outfitCombo.items.map((it) => (
                          <div key={it.id} className="bg-white p-2 rounded-xl border border-pink-100 shadow-sm text-center">
                            <img 
                              src={it.images?.[0] || (it as any).image_url || (it as any).image || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'} 
                              alt={it.name}
                              className="w-full h-16 object-cover rounded-lg mb-1 bg-slate-50"
                            />
                            <div className="text-[10px] font-bold text-slate-800 line-clamp-1">{it.name}</div>
                            <div className="text-[10px] font-extrabold text-rose-600">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(it.price)}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-white/80 p-2 rounded-xl flex items-center justify-between text-xs border border-pink-100">
                        <div>
                          <span className="text-slate-500 line-through text-[10px] mr-1">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(msg.skillResult.outfitCombo.totalPrice)}
                          </span>
                          <strong className="text-rose-700 text-sm font-black">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(msg.skillResult.outfitCombo.discountPrice || msg.skillResult.outfitCombo.totalPrice)}
                          </strong>
                        </div>
                        <button
                          onClick={() => handleAddOutfitToCart(msg.skillResult!.outfitCombo!)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs text-white shadow-sm transition-all flex items-center gap-1 ${
                            addedComboId === msg.skillResult.outfitCombo.id
                              ? 'bg-emerald-600'
                              : 'bg-rose-600 hover:bg-rose-700'
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

                  {/* THẺ GENERATIVE UI: VIP LOYALTY CARD (VIP Concierge Mia) */}
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
                              setShowMeasureForm(true);
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
                <div className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center animate-spin">
                  <Sparkles size={14} />
                </div>
                <span>{currentPersonaConfig.name} đang suy nghĩ và chuẩn bị dữ liệu...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Prompt Chips theo từng Persona */}
          <div className="p-2 px-3 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {activeChips.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 border border-slate-200/80 transition-all shrink-0 font-medium"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
              placeholder={`Hỏi ${currentPersonaConfig.name}: ${
                selectedPersona === 'STYLIST' ? 'Phối đồ, phong cách, sự kiện...' :
                selectedPersona === 'FITTING' ? '1m70 62kg mặc size gì, form áo...' :
                selectedPersona === 'ORDERS' ? 'Kiểm tra đơn, bao giờ giao tới...' :
                selectedPersona === 'LOYALTY' ? 'Điểm thưởng, cách đổi voucher...' :
                'Báo cáo doanh số, cảnh báo kho...'
              }`}
              className="flex-1 text-xs sm:text-sm bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputPrompt.trim()}
              className="p-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl shadow-sm transition-all shrink-0 active:scale-95 cursor-pointer"
              aria-label="Gửi tin nhắn"
            >
              <Send size={16} />
            </button>
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

                <div className="bg-slate-50 p-2.5 rounded-xl text-[11px] space-y-1 border border-slate-200 text-slate-600">
                  <div className="font-bold text-slate-800 flex items-center gap-1">
                    <Sparkles size={12} className="text-amber-500" /> Chế độ Hybrid thông minh:
                  </div>
                  <div>• <strong>Có Key</strong>: Hỏi đáp mở tự nhiên với Google Gemini 1.5 Flash.</div>
                  <div>• <strong>Không có Key</strong>: Tự động dùng RAG CSDL ZShop siêu tốc.</div>
                </div>

                <div className="flex justify-end gap-2 pt-1 border-t border-slate-100">
                  <button 
                    type="button"
                    onClick={() => setShowKeyModal(false)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    Đóng
                  </button>
                  <button 
                    type="button"
                    onClick={handleSaveApiKey}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm cursor-pointer"
                  >
                    Lưu & Kích hoạt
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Floating Activation Button */
        <button
          onClick={() => setIsOpen(true)}
          className="relative group bg-gradient-to-tr from-slate-900 via-indigo-950 to-blue-900 text-white p-3.5 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center border-2 border-white/30"
          aria-label="Mở Trợ lý Đa Chuyên Gia AI ZShop"
        >
          <div className="relative flex items-center justify-center">
            <Bot size={26} className="text-white" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-white"></span>
            </span>
          </div>

          {/* Tooltip on hover */}
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-xl border border-slate-700 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Đa Trợ Lý AI: Stylist • Đo Size • Đơn Hàng • Thẻ VIP
          </div>
        </button>
      )}
    </div>
  );
}
