import { 
  ProductDetail, CartItem, OrderStatus, TrackingStep, 
  AIPersonaType, UserMeasurements, CustomerContext, 
  OutfitCombo, SizeFittingResult, CustomerProfile, Order 
} from './types';
import { MOCK_PRODUCTS_LIST, MOCK_ORDER } from './constants';
import { HeThongBanHangDB } from './database';

/**
 * Kiểu dữ liệu phân loại kỹ năng AI
 */
export type AISkillType = 
  | 'PRODUCT_SEARCH_RECOMMEND'  // Kỹ năng 1: Tìm kiếm & Gợi ý sản phẩm (UC07)
  | 'STOCK_INQUIRY'             // Kỹ năng mới: Tra cứu kho tự động (UC07 include)
  | 'QUICK_ADD_TO_CART'          // Kỹ năng 2: Thêm giỏ hàng & Đặt hàng nhanh
  | 'TRACK_ORDER'                // Kỹ năng 3: Tra cứu tiến độ đơn hàng
  | 'SALES_ANALYTICS'            // Kỹ năng 4: Báo cáo & Phân tích bán hàng
  | 'BUSINESS_QA'                // Kỹ năng mới: AI Hỏi đáp Kinh doanh cho Admin (UC09)
  | 'INVENTORY_RECOMMENDATION'   // Kỹ năng mới: AI Khuyến nghị kho (UC08)
  | 'AI_COPYWRITER'              // Kỹ năng 5: Tự động sáng tạo bài viết sản phẩm (Seller)
  | 'PROMOTION_ADVISOR'          // Kỹ năng 6: Tư vấn mã giảm giá & ưu đãi
  | 'AI_FASHION_STYLIST'         // Chuyên môn Stylist: Phối đồ & Lookbook
  | 'AI_SMART_FITTING'           // Chuyên môn Đo Size: Phân tích kích cỡ & vóc dáng
  | 'AI_VIP_LOYALTY'             // Chuyên môn VIP: Quyền lợi hạng thẻ & điểm tích lũy
  | 'GENERAL_CONSULT';           // Tư vấn chung

export interface AISkillResult {
  skill: AISkillType;
  message: string;
  products?: ProductDetail[];
  stockInquiry?: {
    productName: string;
    stock: number;
    inStock: boolean;
    category: string;
    statusText: string;
    suggestedActionText: string;
  };
  warehouseRecommendations?: {
    productName: string;
    stock: number;
    suggestedReorder: number;
    priority: 'CAO' | 'TRUNG BÌNH' | 'XẢ KHO';
    reason: string;
  }[];
  businessInsights?: {
    revenueGrowth: string;
    grossMargin: string;
    returnRate: string;
    forecastAdvice: string;
    strategicAction: string;
  };
  orderInfo?: {
    orderId: string;
    status: string;
    steps: TrackingStep[];
    estimatedDelivery?: string;
    totalAmount?: number;
    itemNames?: string[];
  };
  analytics?: {
    totalRevenue: number;
    todayOrders: number;
    topSelling: { name: string; sold: number; revenue: number }[];
    lowStock: { name: string; stock: number; category: string }[];
  };
  copywriting?: {
    title: string;
    highlights: string[];
    description: string;
    suggestedPrice: number;
    hashtags: string[];
  };
  promotions?: {
    code: string;
    discountText: string;
    minSpend: number;
    description: string;
  }[];
  // Các thẻ Generative UI bổ sung cho từng Persona chuyên sâu
  outfitCombo?: OutfitCombo;
  sizeFitting?: SizeFittingResult;
  customerLoyalty?: {
    customerName: string;
    tier: string;
    points: number;
    pointValueVND: number;
    totalSpent: number;
    nextTier?: string;
    spendNeededForNextTier?: number;
    tierDiscount: number;
    benefits: string[];
  };
  customerOrdersList?: {
    id: string;
    date: string;
    total: number;
    status: string;
    itemsSummary: string;
  }[];
  suggestedActions?: string[];
  multiAgentTrace?: {
    architecture?: string;
    status?: string;
    qualityScore?: number;
    critiqueNotes?: string[];
    correlationId?: string;
    reflectionRetries?: number;
    reflectionHistory?: any[];
  };
  crossSellRecommendations?: {
    id: string;
    name: string;
    price: number;
    image: string;
    category?: string;
  }[];
}

/**
 * Cấu hình cho từng Chuyên Gia AI (Persona)
 */
export interface AIPersonaConfig {
  id: AIPersonaType;
  name: string;
  roleTitle: string;
  avatar: string;
  badge: string;
  accentColor: 'pink' | 'emerald' | 'blue' | 'amber' | 'slate';
  themeGradient: string;
  description: string;
  getGreeting: (context?: CustomerContext) => string;
  quickPromptChips: (context?: CustomerContext) => string[];
}

/**
 * Danh mục 5 Trợ Lý AI Chuyên Biệt
 */
export const AI_PERSONAS: Record<AIPersonaType, AIPersonaConfig> = {
  STYLIST: {
    id: 'STYLIST',
    name: 'Stylist Emma',
    roleTitle: 'Chuyên Gia Phối Đồ & Định Hình Gu',
    avatar: '👗',
    badge: 'Fashionista AI',
    accentColor: 'pink',
    themeGradient: 'from-pink-500 via-rose-500 to-purple-600',
    description: 'Tư vấn mix & match trang phục theo phong cách, sự kiện, thời tiết và sản phẩm trong giỏ.',
    getGreeting: (context) => {
      const name = context?.customerProfile?.name || context?.currentUser?.name;
      const cartCount = context?.cartItems?.length || 0;
      let greeting = `✨ Xin chào${name ? ` **${name}**` : ''}! Mình là **Stylist Emma** - Chuyên gia định hình phong cách ZShop.\n\n`;
      if (cartCount > 0) {
        greeting += `🛍️ Mình thấy bạn đang chọn **${cartCount} món đồ** trong giỏ. Bạn có muốn mình gợi ý thêm quần, áo khoác hoặc phụ kiện để tạo nên một **Outfit hoàn hảo** không?`;
      } else {
        greeting += `Bạn đang tìm phong cách nào hôm nay? Đi làm lịch lãm, dạo phố năng động hay dự tiệc sang trọng? Hãy chia sẻ với mình nhé!`;
      }
      return greeting;
    },
    quickPromptChips: (context) => {
      const chips = [
        '✨ Gợi ý phối đồ dạo phố cuối tuần',
        '👔 Set đồ công sở thanh lịch nam/nữ',
        '🎉 Phối đồ đi tiệc sang trọng'
      ];
      if (context?.cartItems && context.cartItems.length > 0) {
        chips.unshift(`🛍️ Gợi ý đồ phối với "${context.cartItems[0].name.slice(0, 22)}..."`);
      }
      return chips;
    }
  },

  FITTING: {
    id: 'FITTING',
    name: 'Master Fit Ken',
    roleTitle: 'Chuyên Viên Tư Vấn Kích Cỡ & Vóc Dáng',
    avatar: '📏',
    badge: 'Smart Sizing AI',
    accentColor: 'emerald',
    themeGradient: 'from-emerald-500 via-teal-500 to-cyan-600',
    description: 'Tính toán size chuẩn xác theo chiều cao, cân nặng và form người; giải quyết dứt điểm nỗi lo mua nhầm size.',
    getGreeting: (context) => {
      const name = context?.customerProfile?.name || context?.currentUser?.name;
      const m = context?.measurements;
      let greeting = `📏 Chào${name ? ` **${name}**` : ''}! Tôi là **Master Fit Ken** - Chuyên viên đo & chọn size thời trang chuẩn xác ZShop.\n\n`;
      if (m && m.height && m.weight) {
        greeting += `💡 Tôi đã lưu số đo của bạn: **${m.height}cm - ${m.weight}kg** (${m.preferredFit === 'loose' ? 'Form rộng thoải mái' : m.preferredFit === 'tight' ? 'Form ôm body' : 'Form vừa vặn'}).\nBạn đang quan tâm đến sản phẩm nào? Tôi sẽ kiểm tra size chuẩn ngay cho bạn!`;
      } else {
        greeting += `Để chọn size chuẩn xác 99% không lo đổi trả, bạn chỉ cần cho tôi biết **Chiều cao (cm)** và **Cân nặng (kg)** hoặc bấm nút nhập số đo bên dưới nhé!`;
      }
      return greeting;
    },
    quickPromptChips: (context) => {
      if (context?.measurements?.height) {
        return [
          `📐 Dùng số đo đã lưu (${context.measurements.height}cm / ${context.measurements.weight}kg)`,
          'Áo này form ôm hay rộng?',
          'Cập nhật lại chiều cao & cân nặng'
        ];
      }
      return [
        'Tôi cao 1m72 nặng 65kg nên mặc size gì?',
        'Tôi cao 1m58 nặng 48kg chọn size nào?',
        'Bảng quy đổi kích cỡ chuẩn ZShop'
      ];
    }
  },

  ORDERS: {
    id: 'ORDERS',
    name: 'Logistics Alex',
    roleTitle: 'Chuyên Viên Đơn Hàng & Vận Chuyển',
    avatar: '📦',
    badge: 'Tracking Express AI',
    accentColor: 'blue',
    themeGradient: 'from-blue-600 via-indigo-600 to-cyan-700',
    description: 'Theo dõi hành trình vận đơn của riêng bạn, dự báo thời gian giao hàng và hỗ trợ đổi trả hoàn tiền.',
    getGreeting: (context) => {
      const name = context?.customerProfile?.name || context?.currentUser?.name;
      const orders = context?.customerOrders || [];
      let greeting = `📦 Kính chào${name ? ` anh/chị **${name}**` : ''}! Tôi là **Logistics Alex** - Chuyên viên hỗ trợ Đơn hàng & Vận chuyển ZShop.\n\n`;
      if (orders.length > 0) {
        const latest = orders[0];
        greeting += `🔍 Tôi đã tìm thấy đơn hàng gần nhất của bạn: **[${latest.id}]** đặt ngày **${new Date(latest.createdAt).toLocaleDateString('vi-VN')}**.\nBạn có muốn kiểm tra lộ trình chi tiết của đơn này không?`;
      } else {
        greeting += `Tôi có thể giúp bạn kiểm tra hành trình vận chuyển bất kỳ đơn hàng nào, giải đáp chính sách giao hàng hoặc hỗ trợ quy trình Đổi trả & Hoàn tiền (UC10).`;
      }
      return greeting;
    },
    quickPromptChips: (context) => {
      const orders = context?.customerOrders || [];
      if (orders.length > 0) {
        return [
          `🔍 Đơn hàng gần nhất [${orders[0].id}]`,
          'Bao giờ đơn của tôi giao tới nơi?',
          'Chính sách đổi trả & hoàn tiền (UC10)'
        ];
      }
      return [
        'Tra cứu đơn hàng gần nhất của tôi',
        'Thời gian giao hàng tiêu chuẩn là bao lâu?',
        'Chính sách kiểm hàng & đổi trả (UC10)'
      ];
    }
  },

  LOYALTY: {
    id: 'LOYALTY',
    name: 'VIP Concierge Mia',
    roleTitle: 'Chuyên Viên Quyền Lợi & Điểm Thưởng VIP',
    avatar: '👑',
    badge: 'VIP Club Concierge',
    accentColor: 'amber',
    themeGradient: 'from-amber-500 via-yellow-500 to-orange-600',
    description: 'Tra cứu điểm thưởng, tư vấn đặc quyền hạng thẻ thành viên và gợi ý mã voucher tối ưu nhất.',
    getGreeting: (context) => {
      const prof = context?.customerProfile;
      const name = prof?.name || context?.currentUser?.name;
      let greeting = `👑 Chào mừng${name ? ` quý khách **${name}**` : ''} đến với Câu Lạc Bộ VIP ZShop! Tôi là **VIP Concierge Mia**.\n\n`;
      if (prof) {
        const pointVal = prof.points * 100;
        const pointValStr = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(pointVal);
        greeting += `⭐ Quý khách đang sở hữu **Hạng Thẻ ${prof.tier.toUpperCase()}** với **${prof.points} điểm tích lũy** (tương đương **${pointValStr}** tiền mặt được trừ thẳng vào hóa đơn)!\n\nTôi có thể giúp quý khách tìm mã voucher tốt nhất cho giỏ hàng hoặc xem lộ trình thăng hạng thẻ.`;
      } else {
        greeting += `Tôi chuyên phụ trách giải đáp chính sách tích điểm, quyền lợi thăng hạng thẻ (Đồng, Bạc, Vàng, Kim Cương) và các mã giảm giá bí mật độc quyền.`;
      }
      return greeting;
    },
    quickPromptChips: (context) => {
      const prof = context?.customerProfile;
      if (prof) {
        return [
          `⭐ Xem chi tiết điểm (${prof.points} điểm = ${(prof.points * 100).toLocaleString('vi-VN')}đ)`,
          `🏆 Lộ trình thăng hạng từ ${prof.tier}`,
          '🎁 Tìm voucher hời nhất cho giỏ hàng của tôi'
        ];
      }
      return [
        'Quyền lợi các hạng thẻ VIP ZShop',
        'Cách quy đổi điểm tích lũy sang tiền',
        'Mã giảm giá đang có hiệu lực hôm nay'
      ];
    }
  },

  BUSINESS: {
    id: 'BUSINESS',
    name: 'Chief Copilot Leo',
    roleTitle: 'Trợ Lý Quản Trị & Kho Vận',
    avatar: '💼',
    badge: 'Internal Business AI',
    accentColor: 'slate',
    themeGradient: 'from-slate-800 via-slate-900 to-zinc-900',
    description: 'Dành cho Admin, Seller và Quản lý Kho: Báo cáo doanh số, dự báo tồn kho (UC08), hỏi đáp kinh doanh (UC09) và viết content chuẩn SEO.',
    getGreeting: (context) => {
      const name = context?.currentUser?.name || 'Quản trị viên / Đối tác';
      return `💼 Xin chào **${name}**! Tôi là **Chief Copilot Leo** - Trợ lý số dành riêng cho Ban Quản trị & Vận hành ZShop.\n\nTôi đã đồng bộ toàn bộ dữ liệu thời gian thực từ Kho hàng, Điểm bán POS và Báo cáo Doanh thu. Bạn muốn kiểm tra số liệu kinh doanh nào hôm nay?`;
    },
    quickPromptChips: () => [
      '📊 Báo cáo doanh số hôm nay',
      '📦 AI Cảnh báo & Khuyến nghị kho (UC08)',
      '📈 Hỏi đáp chiến lược kinh doanh (UC09)',
      '✍️ Viết bài mô tả sản phẩm chuẩn SEO'
    ]
  }
};

/**
 * Xử lý phân tích từ khóa và bóc tách thực thể (Intent & Entity Extraction)
 */
export class AISkillEngine {
  /**
   * Bóc tách khoảng giá từ văn bản
   */
  static extractPriceRange(text: string): { minPrice: number; maxPrice: number } {
    const lower = text.toLowerCase();
    let minPrice = 0;
    let maxPrice = Infinity;

    // Pattern: dưới X k / tr
    const underMatch = lower.match(/dưới\s+(\d+(?:\.\d+)?)\s*(k|nghìn|ngàn|triệu|tr|m)?/);
    if (underMatch) {
      const num = parseFloat(underMatch[1]);
      const unit = underMatch[2] || '';
      if (['tr', 'triệu', 'm'].includes(unit)) {
        maxPrice = num * 1000000;
      } else {
        maxPrice = num * 1000;
      }
      return { minPrice, maxPrice };
    }

    // Pattern: trên / từ X k / tr
    const overMatch = lower.match(/(?:trên|từ)\s+(\d+(?:\.\d+)?)\s*(k|nghìn|ngàn|triệu|tr|m)?/);
    if (overMatch) {
      const num = parseFloat(overMatch[1]);
      const unit = overMatch[2] || '';
      if (['tr', 'triệu', 'm'].includes(unit)) {
        minPrice = num * 1000000;
      } else {
        minPrice = num * 1000;
      }
    }

    // Pattern: tầm / khoảng X k / tr
    const aroundMatch = lower.match(/(?:tầm|khoảng)\s+(\d+(?:\.\d+)?)\s*(k|nghìn|ngàn|triệu|tr|m)?/);
    if (aroundMatch && maxPrice === Infinity) {
      const num = parseFloat(aroundMatch[1]);
      const unit = aroundMatch[2] || '';
      const base = ['tr', 'triệu', 'm'].includes(unit) ? num * 1000000 : num * 1000;
      minPrice = Math.max(0, base * 0.7);
      maxPrice = base * 1.3;
    }

    return { minPrice, maxPrice };
  }

  /**
   * Bóc tách thông số chiều cao và cân nặng từ câu hỏi (vd: "1m72 65kg", "cao 170cm nặng 60kg", "1m65 52kg")
   */
  static extractMeasurements(text: string): { height?: number; weight?: number; fit?: 'tight' | 'regular' | 'loose' } {
    const lower = text.toLowerCase();
    let height: number | undefined;
    let weight: number | undefined;
    let fit: 'tight' | 'regular' | 'loose' = 'regular';

    if (lower.includes('ôm') || lower.includes('bó') || lower.includes('body') || lower.includes('slim')) {
      fit = 'tight';
    } else if (lower.includes('rộng') || lower.includes('thoải mái') || lower.includes('oversize') || lower.includes('thùng thình')) {
      fit = 'loose';
    }

    // Bóc tách chiều cao: 1m75 hoặc 175cm hoặc cao 175
    const heightMatch1 = lower.match(/(\d)\s*m\s*(\d{1,2})/); // 1m75
    if (heightMatch1) {
      height = parseInt(heightMatch1[1]) * 100 + parseInt(heightMatch1[2].padEnd(2, '0'));
    } else {
      const heightMatch2 = lower.match(/(?:cao\s*)?(\d{3})\s*(?:cm)?/); // 175cm hoặc 175
      if (heightMatch2) {
        const val = parseInt(heightMatch2[1]);
        if (val >= 140 && val <= 210) height = val;
      }
    }

    // Bóc tách cân nặng: 65kg hoặc nặng 65
    const weightMatch = lower.match(/(?:nặng\s*)?(\d{2,3})\s*(?:kg|kí|ký)/);
    if (weightMatch) {
      const val = parseInt(weightMatch[1]);
      if (val >= 35 && val <= 150) weight = val;
    } else {
      // Nếu có 2 con số liên tiếp: vd "1m70 65" -> 65 là cân nặng
      const twoNumbers = lower.match(/1m\d{2}\s+(\d{2})/);
      if (twoNumbers) {
        weight = parseInt(twoNumbers[1]);
      }
    }

    return { height, weight, fit };
  }

  /**
   * Thuật toán tính toán Size chuẩn xác theo chiều cao, cân nặng và form dáng (Smart Size Calculation)
   */
  static calculateSmartSize(
    height: number, 
    weight: number, 
    fitPreference: 'tight' | 'regular' | 'loose' = 'regular',
    productName?: string
  ): SizeFittingResult {
    let baseSize = 'M';
    let confidence = 96;

    // Phân loại cơ sở
    if (weight < 53 || height < 162) {
      baseSize = 'S';
    } else if ((weight >= 53 && weight <= 63) && height <= 170) {
      baseSize = 'M';
    } else if ((weight >= 64 && weight <= 73) || (height > 170 && height <= 177)) {
      baseSize = 'L';
    } else if ((weight >= 74 && weight <= 83) || (height > 177 && height <= 184)) {
      baseSize = 'XL';
    } else {
      baseSize = 'XXL';
    }

    // Điều chỉnh theo form yêu thích
    const sizeHierarchy = ['S', 'M', 'L', 'XL', 'XXL'];
    let idx = sizeHierarchy.indexOf(baseSize);

    if (fitPreference === 'loose' && idx < sizeHierarchy.length - 1) {
      idx += 1;
      confidence = 94;
    } else if (fitPreference === 'tight' && idx > 0) {
      idx -= 1;
      confidence = 92;
    }

    const finalSize = sizeHierarchy[idx];

    const fitDescription = fitPreference === 'loose'
      ? `Với chiều cao ${height}cm và cân nặng ${weight}kg, form ${finalSize} mang lại cảm giác rộng rãi, phóng khoáng chuẩn phong cách Streetwear.`
      : fitPreference === 'tight'
      ? `Với chiều cao ${height}cm và cân nặng ${weight}kg, form ${finalSize} sẽ tôn trọn đường nét cơ thể săn chắc, vừa vặn không bị thừa vải.`
      : `Với chiều cao ${height}cm và cân nặng ${weight}kg, form ${finalSize} là kích cỡ tỷ lệ vàng, vừa vặn vai và chiều dài áo chuẩn ngang hông.`;

    return {
      recommendedSize: finalSize,
      confidence,
      fitDescription,
      measurementsUsed: {
        height,
        weight,
        fitPreference: fitPreference === 'loose' ? 'Rộng thoải mái (Oversize)' : fitPreference === 'tight' ? 'Ôm sát (Slimfit)' : 'Vừa vặn tiêu chuẩn (Regular)'
      },
      details: {
        chestFit: `Vòng ngực vừa vặn, cử động thoải mái (dao động +/- 2cm)`,
        lengthFit: `Chiều dài áo chạm ngang xương hông (${height > 170 ? '70-72cm' : '66-68cm'})`,
        shoulderFit: `Đường may nối vai nằm chuẩn mép cơ delta`
      }
    };
  }

  /**
   * Tạo Lookbook Outfit gợi ý phối đồ thời trang
   */
  static generateOutfitCombo(
    prompt: string, 
    cartItems: CartItem[] = [], 
    catalog: ProductDetail[] = MOCK_PRODUCTS_LIST
  ): OutfitCombo {
    const query = prompt.toLowerCase();

    // 1. Phối đồ theo giỏ hàng hiện tại nếu có
    if (cartItems.length > 0 && (query.includes('giỏ hàng') || query.includes('món trong giỏ') || query.includes('đồ đã chọn'))) {
      const mainItem = cartItems[0];
      const matchedMain = catalog.find(p => p.id === mainItem.id || p.name === mainItem.name) || catalog[0];
      const otherItems = catalog.filter(p => p.id !== matchedMain.id).slice(0, 2);
      const outfitItems = [matchedMain, ...otherItems];
      const totalPrice = outfitItems.reduce((acc, item) => acc + item.price, 0);

      return {
        id: `outfit-cart-${Date.now()}`,
        title: `Combo Phối Hoàn Hảo Cùng "${mainItem.name.slice(0, 28)}..."`,
        style: 'Modern Dynamic Casual',
        occasion: 'Đi làm, dạo phố, hẹn hò cuối tuần',
        description: `Emma đã chọn thêm 2 món đồ phối cực ăn ý với sản phẩm trong giỏ của bạn để tạo nên diện mạo cuốn hút và hài hòa về màu sắc.`,
        items: outfitItems,
        totalPrice,
        discountPrice: Math.round(totalPrice * 0.92)
      };
    }

    // 2. Set Công sở lịch lãm
    if (query.includes('công sở') || query.includes('đi làm') || query.includes('lịch lãm') || query.includes('sơ mi')) {
      const items = catalog.filter(p => 
        p.name.includes('Polo') || p.name.includes('Sơ mi') || p.name.includes('Tây') || p.category.includes('Nam')
      ).slice(0, 3);
      const outfitItems = items.length >= 2 ? items : catalog.slice(0, 3);
      const totalPrice = outfitItems.reduce((acc, item) => acc + item.price, 0);

      return {
        id: 'outfit-office-01',
        title: 'Set Đồ Smart Casual & Công Sở Lịch Lãm',
        style: 'Smart Casual / Minimalist',
        occasion: 'Đi làm hàng ngày, gặp gỡ đối tác, hội thảo chuyên nghiệp',
        description: 'Sự kết hợp giữa phom dáng đứng đắn và chất liệu co giãn nhẹ nhàng giúp bạn giữ vẻ ngoài chỉn chu suốt 8 tiếng mà không hề gò bó.',
        items: outfitItems,
        totalPrice,
        discountPrice: Math.round(totalPrice * 0.9)
      };
    }

    // 3. Set Đi tiệc / Hẹn hò
    if (query.includes('tiệc') || query.includes('hẹn hò') || query.includes('sang trọng') || query.includes('party')) {
      const items = catalog.filter(p => 
        p.name.includes('DIOR') || p.name.includes('Lụa') || p.price > 400000
      ).slice(0, 3);
      const outfitItems = items.length >= 2 ? items : catalog.slice(0, 3);
      const totalPrice = outfitItems.reduce((acc, item) => acc + item.price, 0);

      return {
        id: 'outfit-party-02',
        title: 'Set Trang Phục Dạ Tiệc & Hẹn Hò Sang Trọng',
        style: 'Chic Luxury / High-End Evening',
        occasion: 'Dự tiệc tối, sinh nhật, hẹn hò lãng mạn tại nhà hàng',
        description: 'Tông màu thời thượng cùng điểm nhấn chi tiết tinh xảo tạo cảm giác đẳng cấp và thu hút mọi ánh nhìn.',
        items: outfitItems,
        totalPrice,
        discountPrice: Math.round(totalPrice * 0.9)
      };
    }

    // 4. Set Mặc định: Dạo phố năng động
    const defaultItems = catalog.slice(0, 3);
    const totalPrice = defaultItems.reduce((acc, item) => acc + item.price, 0);
    return {
      id: 'outfit-streetwear-03',
      title: 'Set Đồ Streetwear Trẻ Trung & Năng Động',
      style: 'Urban Streetwear',
      occasion: 'Đi chơi, dạo phố, chụp ảnh cafe cuối tuần',
      description: 'Phom dáng thoải mái phóng khoáng, dễ dàng mix & match cùng sneakers mang lại năng lượng trẻ trung bứt phá.',
      items: defaultItems,
      totalPrice,
      discountPrice: Math.round(totalPrice * 0.92)
    };
  }

  /**
   * ĐIỀU PHỐI VÀ XỬ LÝ THEO TỪNG PERSONA CHUYÊN BIỆT
   */
  static async executePersonaSkill(
    prompt: string,
    persona: AIPersonaType,
    context: CustomerContext
  ): Promise<AISkillResult> {
    const query = prompt.trim().toLowerCase();
    const productCatalog = context.allProducts && context.allProducts.length > 0 
      ? context.allProducts 
      : MOCK_PRODUCTS_LIST;
    const customer = context.customerProfile;
    const customerName = customer?.name || context.currentUser?.name || '';

    // =========================================================================
    // 1. PERSONA: STYLIST (Emma - Chuyên Gia Phối Đồ & Định Hình Gu)
    // =========================================================================
    if (persona === 'STYLIST') {
      const outfit = this.generateOutfitCombo(prompt, context.cartItems, productCatalog);
      const personalizedGreeting = customerName ? `Chào **${customerName}**! ` : '';

      return {
        skill: 'AI_FASHION_STYLIST',
        message: `👗 ${personalizedGreeting}**Stylist Emma** đã thiết kế riêng cho bạn **${outfit.title}** cực kỳ tôn dáng và hợp xu hướng:
- **Phong cách chủ đạo**: ${outfit.style}
- **Hoàn cảnh khuyên dùng**: ${outfit.occasion}
- **Lời khuyên phối màu**: Kết hợp gam màu trung tính tạo cảm giác thanh thoát, đi cùng giày sneaker trắng hoặc giày lười da cao cấp.`,
        outfitCombo: outfit,
        products: outfit.items,
        suggestedActions: [
          `Thêm cả combo vào giỏ (Tiết kiệm ${(outfit.totalPrice - (outfit.discountPrice || outfit.totalPrice)).toLocaleString('vi-VN')}đ)`,
          'Xem cách phối đồ công sở khác',
          'Tư vấn chọn size cho set này'
        ]
      };
    }

    // =========================================================================
    // 2. PERSONA: FITTING (Ken - Chuyên Viên Đo Size Chuẩn Xác)
    // =========================================================================
    if (persona === 'FITTING') {
      const extracted = this.extractMeasurements(prompt);
      let height = extracted.height || context.measurements?.height;
      let weight = extracted.weight || context.measurements?.weight;
      let fit = extracted.fit || context.measurements?.preferredFit || 'regular';

      if (height && weight) {
        const sizing = this.calculateSmartSize(height, weight, fit);
        const personalizedName = customerName ? `cho **${customerName}** ` : '';

        return {
          skill: 'AI_SMART_FITTING',
          message: `📏 **Master Fit Ken** đã phân tích tỷ lệ vóc dáng ${personalizedName}(${height}cm - ${weight}kg):
- 🎯 **Kích cỡ đề xuất chuẩn xác nhất**: **SIZE ${sizing.recommendedSize}** (Độ chuẩn xác: **${sizing.confidence}%**)
- 👕 **Đánh giá form dáng**: ${sizing.fitDescription}
- 💡 **Mẹo mặc đẹp**: Nếu bạn thích mặc rộng phong cách Oversize cá tính, bạn có thể tăng lên 1 size; còn nếu muốn khoe form cơ thể thì size ${sizing.recommendedSize} là hoàn hảo!`,
          sizeFitting: sizing,
          suggestedActions: [
            `Chọn Size ${sizing.recommendedSize} ngay`,
            'Lưu số đo này vào hồ sơ của tôi',
            'Thử tính lại với số đo khác'
          ]
        };
      }

      return {
        skill: 'AI_SMART_FITTING',
        message: `📐 Để tư vấn size chuẩn xác 100% không lo bị chật hay rộng, bạn vui lòng cho tôi biết **Chiều cao (cm)** và **Cân nặng (kg)** của bạn nhé!\n\nVí dụ bạn có thể gõ nhanh: *"1m72 65kg"* hoặc *"Cao 165 nặng 52kg form rộng"*!`,
        suggestedActions: [
          'Tôi cao 1m70 nặng 65kg',
          'Tôi cao 1m60 nặng 50kg',
          'Tôi cao 1m75 nặng 78kg (Bụng bia)'
        ]
      };
    }

    // =========================================================================
    // 3. PERSONA: ORDERS (Alex - Chuyên Viên Đơn Hàng & Vận Chuyển)
    // =========================================================================
    if (persona === 'ORDERS') {
      const orders = context.customerOrders || [];
      const personalizedSalute = customerName ? `anh/chị **${customerName}**` : 'quý khách';

      if (query.includes('đổi') || query.includes('trả') || query.includes('hoàn tiền') || query.includes('khiếu nại')) {
        return {
          skill: 'TRACK_ORDER',
          message: `🔄 **Chính sách Đổi trả & Hoàn hàng ZShop (UC10)**:
- **Thời hạn áp dụng**: Trong vòng **07 ngày** kể từ khi nhận hàng.
- **Điều kiện**: Sản phẩm còn nguyên tem mác, chưa qua giặt ủi hoặc có lỗi do nhà sản xuất.
- **Quy trình 3 bước**:
  1. Vào mục *"Quản lý Đơn hàng"* hoặc bấm nút bên dưới.
  2. Bấm *"Yêu cầu Đổi trả"* và đính kèm ảnh/video mở hộp.
  3. Shipper ZShop sẽ đến tận nhà lấy hàng đổi hoàn toàn miễn phí.`,
          suggestedActions: ['Gửi yêu cầu đổi trả ngay', 'Tra cứu mã vận đơn', 'Kết nối tổng đài viên']
        };
      }

      if (orders.length > 0) {
        const latestOrder = orders[0];
        const steps: TrackingStep[] = [
          { status: OrderStatus.PENDING, date: '28/12/2024 10:15', description: 'Đơn hàng đã được khởi tạo thành công', completed: true },
          { status: OrderStatus.PAID, date: '28/12/2024 10:16', description: 'Đã xác nhận thanh toán an toàn', completed: true },
          { status: OrderStatus.PROCESSING, date: '28/12/2024 14:30', description: 'Kho vận đang đóng gói và kiểm định chất lượng', completed: true },
          { status: OrderStatus.SHIPPING, date: '29/12/2024 08:00', description: 'Đang vận chuyển liên tỉnh (Shipper ZShop Express)', completed: true }
        ];

        return {
          skill: 'TRACK_ORDER',
          message: `📦 **Logistics Alex** xin báo cáo tiến độ đơn hàng của ${personalizedSalute}:
- **Mã đơn hàng**: **${latestOrder.id}**
- **Trạng thái**: 🚚 **Đang giao hàng (Dự kiến đến trong hôm nay)**
- **Tổng thanh toán**: **${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(latestOrder.shippingFee ? (latestOrder.items.reduce((a, b) => a + b.price * b.quantity, 0) + latestOrder.shippingFee) : 480000)}**
- **Địa chỉ giao**: ${latestOrder.customerInfo?.address || customer?.address || '12 Lê Lợi, P. Bến Nghé, Q.1, TP.HCM'}`,
          orderInfo: {
            orderId: latestOrder.id,
            status: 'Đang giao hàng (SHIPPING)',
            steps: steps,
            estimatedDelivery: 'Trong 24 giờ tới'
          },
          customerOrdersList: orders.map(o => ({
            id: o.id,
            date: new Date(o.createdAt).toLocaleDateString('vi-VN'),
            total: o.items.reduce((sum, it) => sum + it.price * it.quantity, 0) + (o.shippingFee || 0),
            status: 'Đang giao hàng',
            itemsSummary: o.items.map(it => `${it.name} (x${it.quantity})`).join(', ')
          })),
          suggestedActions: ['Xem chi tiết hóa đơn', 'Liên hệ Shipper ZShop', 'Báo cáo sự cố nhận hàng']
        };
      }

      return {
        skill: 'TRACK_ORDER',
        message: `📦 **Logistics Alex** xin thông báo:
Hiện tài khoản của bạn chưa có đơn hàng nào đang chờ giao. Nếu bạn vừa hoàn tất đặt hàng, hệ thống sẽ cập nhật trạng thái trong 5 phút nữa!`,
        suggestedActions: ['Xem các sản phẩm yêu thích', 'Đi đến giỏ hàng', 'Chính sách vận chuyển']
      };
    }

    // =========================================================================
    // 4. PERSONA: LOYALTY (Mia - Chuyên Viên Quyền Lợi & Điểm Thưởng VIP)
    // =========================================================================
    if (persona === 'LOYALTY') {
      const tier = customer?.tier || 'Đồng';
      const points = customer?.points || 120;
      const pointValue = points * 100;
      const pointValFormatted = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(pointValue);
      const totalSpent = customer?.totalSpent || 1500000;

      const nextTierMap: Record<string, { next: string; target: number; discount: number }> = {
        'Đồng': { next: 'Bạc', target: 3000000, discount: 5 },
        'Bạc': { next: 'Vàng', target: 10000000, discount: 10 },
        'Vàng': { next: 'Kim Cương', target: 25000000, discount: 15 },
        'Kim Cương': { next: 'VIP Vĩnh Viễn', target: 50000000, discount: 20 }
      };

      const tierInfo = nextTierMap[tier] || nextTierMap['Đồng'];
      const spendNeeded = Math.max(0, tierInfo.target - totalSpent);

      const availablePromos = [
        {
          code: 'VIPGOLD10',
          discountText: 'Giảm 10% cho thành viên Vàng',
          minSpend: 500000,
          description: 'Đặc quyền thành viên VIP ZShop áp dụng không giới hạn'
        },
        {
          code: 'FREESHIPMAX',
          discountText: 'Miễn phí vận chuyển 30k',
          minSpend: 300000,
          description: 'Áp dụng cho mọi đơn hàng toàn quốc'
        },
        {
          code: 'POINTS2026',
          discountText: `Đổi ${points} điểm (-${pointValFormatted})`,
          minSpend: 0,
          description: 'Khấu trừ trực tiếp vào hóa đơn thanh toán'
        }
      ];

      return {
        skill: 'AI_VIP_LOYALTY',
        message: `👑 **VIP Concierge Mia** xin gửi đặc quyền của **${customerName || 'Quý khách'}**:
- ⭐ **Hạng thẻ hiện tại**: **${tier.toUpperCase()}**
- 💰 **Điểm thưởng tích lũy**: **${points} điểm** (tương đương **${pointValFormatted}** tiền mặt trừ trực tiếp)
- 🚀 **Nâng hạng ${tierInfo.next}**: Chi tiêu thêm **${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(spendNeeded)}** để nhận chiết khấu **${tierInfo.discount}%** trọn đời và quà sinh nhật đặc biệt!`,
        customerLoyalty: {
          customerName: customerName || 'Khách Hàng Thân Thiết',
          tier,
          points,
          pointValueVND: pointValue,
          totalSpent,
          nextTier: tierInfo.next,
          spendNeededForNextTier: spendNeeded,
          tierDiscount: tierInfo.discount,
          benefits: [
            `Tích lũy 1% giá trị mỗi đơn hàng thành điểm thưởng`,
            `Chiết khấu ${tierInfo.discount}% mọi đơn hàng`,
            `Ưu tiên xử lý đơn và giao hàng hỏa tốc trong 2h`,
            `Tặng Voucher sinh nhật trị giá 200.000đ`
          ]
        },
        promotions: availablePromos,
        suggestedActions: [
          `Đổi ngay ${points} điểm (-${pointValFormatted})`,
          'Xem toàn bộ mã Voucher khả dụng',
          'Mở thẻ thành viên điện tử (UC03)'
        ]
      };
    }

    // =========================================================================
    // 5. PERSONA: BUSINESS (Leo - Trợ Lý Quản Trị & Kho Vận)
    // =========================================================================
    if (persona === 'BUSINESS') {
      return this.executeSkill(prompt, {
        userRole: context.currentUser?.role || 'ADMIN',
        allProducts: productCatalog,
        cartItems: context.cartItems
      });
    }

    return this.executeSkill(prompt, {
      allProducts: productCatalog,
      cartItems: context.cartItems
    });
  }

  /**
   * Phân tích văn bản của người dùng để kích hoạt Skill phù hợp nhất (Tương thích ngược)
   */
  static async executeSkill(
    prompt: string, 
    context: {
      userRole?: string;
      allProducts?: ProductDetail[];
      cartItems?: CartItem[];
    }
  ): Promise<AISkillResult> {
    const query = prompt.trim().toLowerCase();
    const productCatalog = context.allProducts && context.allProducts.length > 0 
      ? context.allProducts 
      : MOCK_PRODUCTS_LIST;

    // Tra cứu kho tự động (UC07 include)
    const stockKeywords = ['còn hàng', 'tra cứu kho', 'kiểm tra kho', 'còn bao nhiêu', 'hết hàng chưa', 'còn ko', 'còn không', 'số lượng kho'];
    if (stockKeywords.some(kw => query.includes(kw))) {
      const matched = productCatalog.find(p => 
        query.includes(p.name.toLowerCase()) || 
        query.includes(p.id.toLowerCase()) ||
        (p.category && query.includes(p.category.toLowerCase()))
      ) || productCatalog[0];

      const inStock = matched.stock > 0;
      const statusText = inStock ? `Còn ${matched.stock} sản phẩm sẵn có trong kho` : 'Tạm hết hàng (Đang nhập kho đợt mới)';

      return {
        skill: 'STOCK_INQUIRY',
        message: `📦 **Tra cứu kho tự động (UC07)**:
- Sản phẩm: **${matched.name}** (${matched.category || 'Thời trang'})
- Tình trạng kho: **${statusText}**
- Vị trí lưu kho: Kệ A1-08 (Kho Tổng TP.HCM)
- Đơn giá niêm yết: **${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(matched.price)}**`,
        stockInquiry: {
          productName: matched.name,
          stock: matched.stock,
          inStock: inStock,
          category: matched.category || 'Thời trang',
          statusText: statusText,
          suggestedActionText: inStock ? 'Đặt mua ngay' : 'Đăng ký nhận thông báo khi có hàng'
        },
        products: [matched],
        suggestedActions: inStock 
          ? [`Thêm "${matched.name}" vào giỏ`, 'Kiểm tra sản phẩm khác', 'Hỏi tư vấn size'] 
          : ['Xem sản phẩm tương tự', 'Lập phiếu nhập kho (Kho)', 'Báo quản trị viên']
      };
    }

    // AI Khuyến nghị kho (UC08)
    const warehouseKeywords = ['khuyến nghị kho', 'khuyến nghị nhập', 'nhập thêm hàng', 'hàng bán chậm', 'xả kho', 'kế hoạch nhập kho', 'dự báo kho'];
    if (warehouseKeywords.some(kw => query.includes(kw))) {
      const reorderItems = productCatalog
        .filter(p => p.stock <= 40)
        .slice(0, 3)
        .map(p => ({
          productName: p.name,
          stock: p.stock,
          suggestedReorder: 100 - p.stock,
          priority: 'CAO' as const,
          reason: `Tốc độ bán tốt, tồn kho hiện tại (${p.stock}) chỉ đủ đáp ứng dưới 3 ngày tới.`
        }));

      const clearanceItems = productCatalog
        .filter(p => p.stock > 50 && p.soldCount < 100)
        .slice(0, 2)
        .map(p => ({
          productName: p.name,
          stock: p.stock,
          suggestedReorder: 0,
          priority: 'XẢ KHO' as const,
          reason: `Hàng tồn kho cao (${p.stock} cái) nhưng tốc độ bán chậm. Khuyến nghị chạy Flash Sale giảm 15-20%.`
        }));

      const recommendations = [...reorderItems, ...clearanceItems];

      return {
        skill: 'INVENTORY_RECOMMENDATION',
        message: `🤖 **AI Khuyến nghị Kho & Điều phối Tồn kho (UC08)**:
Dựa trên phân tích tốc độ tiêu thụ (run-rate) 30 ngày qua:
- 🔴 **Cần nhập thêm gấp**: ${reorderItems.length} mặt hàng có nguy cơ đứt gãy tồn kho.
- 🟡 **Cần kích cầu / xả kho**: ${clearanceItems.length} mặt hàng tồn lâu đọng vốn.
- Đề xuất tự động tạo Phiếu nhập kho ngay để duy trì chuỗi cung ứng ổn định!`,
        warehouseRecommendations: recommendations,
        suggestedActions: ['Mở trang Nhập kho & Tồn kho', 'Tạo phiếu nhập tự động', 'Tạo chiến dịch Flash Sale xả hàng']
      };
    }

    // AI Hỏi đáp Kinh doanh cho Admin (UC09)
    const businessKeywords = ['hỏi đáp kinh doanh', 'chiến lược kinh doanh', 'tỷ suất', 'dự báo doanh số', 'phân tích thị trường', 'lợi nhuận', 'doanh thu tuần', 'tỷ lệ đổi trả'];
    if (businessKeywords.some(kw => query.includes(kw))) {
      return {
        skill: 'BUSINESS_QA',
        message: `📈 **Trợ lý AI Phân tích Kinh doanh (UC09)**:
- **Tăng trưởng Doanh thu**: +14.8% so với cùng kỳ tháng trước nhờ danh mục Thời trang mùa hè.
- **Biên lợi nhuận gộp (Gross Margin)**: Đạt **34.2%**, cao hơn mức trung bình ngành (28%).
- **Tỷ lệ đổi trả & hoàn hàng (UC10)**: Duy trì ở mức thấp **1.8%** (ngưỡng an toàn < 3%).
- **Dự báo 7 ngày tới**: Dự kiến doanh thu đạt ~185.000.000đ khi triển khai chương trình Payday Mega Sale cuối tuần.
- **Khuyến nghị chiến lược**: Tập trung tăng ngân sách quảng cáo cho Top 3 sản phẩm chủ lực và tích điểm khách hàng thân thiết để nâng cao tỷ lệ quay lại (Retention Rate).`,
        businessInsights: {
          revenueGrowth: '+14.8% MoM',
          grossMargin: '34.2%',
          returnRate: '1.8% (Rất tốt)',
          forecastAdvice: 'Dự kiến tăng 22% vào cuối tuần khi chạy Mega Sale',
          strategicAction: 'Bổ sung tồn kho Áo Polo và tặng Voucher 50k cho khách hạng Vàng.'
        },
        suggestedActions: ['Xuất báo cáo doanh thu Excel', 'Xem chi tiết khách VIP', 'Mở phân hệ POS']
      };
    }

    // SALES ANALYTICS
    const salesKeywords = ['doanh thu', 'doanh số', 'báo cáo', 'tồn kho', 'sắp hết hàng', 'bán chạy', 'thống kê', 'lợi nhuận', 'analytics'];
    if (salesKeywords.some(kw => query.includes(kw))) {
      const lowStockItems = productCatalog
        .filter(p => p.stock <= 40)
        .map(p => ({ name: p.name, stock: p.stock, category: p.category }));

      const topSellingItems = [...productCatalog]
        .sort((a, b) => b.soldCount - a.soldCount)
        .slice(0, 4)
        .map(p => ({ name: p.name, sold: p.soldCount, revenue: p.soldCount * p.price }));

      const totalCalculatedRevenue = topSellingItems.reduce((acc, cur) => acc + cur.revenue, 0);

      return {
        skill: 'SALES_ANALYTICS',
        message: `📊 **Báo cáo kinh doanh & Tồn kho ZShop**:
- Tổng doanh thu ước tính: **${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalCalculatedRevenue)}**
- Đơn hàng ghi nhận hôm nay: **18 đơn**
- Mặt hàng bán chạy nhất: **${topSellingItems[0]?.name || 'Áo Thun DIOR'}** (${topSellingItems[0]?.sold || 1200} lượt bán)
- ⚠️ Cảnh báo: Có **${lowStockItems.length}** sản phẩm số lượng tồn kho dưới 40 cần bổ sung gấp!`,
        analytics: {
          totalRevenue: totalCalculatedRevenue,
          todayOrders: 18,
          topSelling: topSellingItems,
          lowStock: lowStockItems
        },
        suggestedActions: ['Xem chi tiết tồn kho', 'Chiến dịch giảm giá xả kho', 'Tạo sản phẩm mới']
      };
    }

    // AI COPYWRITER
    const copyKeywords = ['viết mô tả', 'viết bài', 'đăng bài', 'mô tả sản phẩm', 'content', 'tiêu đề', 'seo sản phẩm'];
    if (copyKeywords.some(kw => query.includes(kw))) {
      const cleanedName = prompt
        .replace(/viết mô tả|viết bài|đăng bài|mô tả sản phẩm|hãy viết|cho tôi|giúp tôi|về|sản phẩm/gi, '')
        .trim() || 'Áo Polo Thể Thao Nam ZShop Limited Edition';

      return {
        skill: 'AI_COPYWRITER',
        message: `✍️ **AI đã khởi tạo nội dung bán hàng tối ưu cho "${cleanedName}":**`,
        copywriting: {
          title: `🔥 [CHÍNH HÃNG] ${cleanedName} - Form Dáng Chuẩn, Thoáng Khí Cao Cấp`,
          highlights: [
            'Chất liệu vải sợi tự nhiên cao cấp, co giãn 4 chiều mềm mịn',
            'Công nghệ dệt kháng khuẩn, khử mùi vượt trội suốt 24 giờ',
            'Thiết kế tôn dáng lịch lãm, dễ dàng phối trang phục công sở lẫn dạo phố',
            'Đường may tiêu chuẩn xuất khẩu, cam kết không bai xù khi giặt máy'
          ],
          description: `Bạn đang tìm kiếm mẫu ${cleanedName} vừa thời thượng vừa thoải mái? Đây chính là sự lựa chọn số 1 dành cho bạn!\nSản phẩm được gia công tỉ mỉ, bảng màu tinh tế, tôn trọn vóc dáng năng động hiện đại.`,
          suggestedPrice: 389000,
          hashtags: ['#ZShop', '#ThoiTrangNam', '#ChatLuongCao', '#Trend2026', '#ShopeeStyle']
        },
        suggestedActions: ['Áp dụng vào trang Seller', 'Chỉnh sửa nội dung', 'Gợi ý thêm từ khóa SEO']
      };
    }

    // TRACK ORDER
    const trackKeywords = ['đơn hàng', 'tra cứu', 'kiểm tra đơn', 'vận chuyển', 'mã vận đơn', 'ship đến đâu', 'dh-'];
    if (trackKeywords.some(kw => query.includes(kw))) {
      const orderMatch = query.match(/(dh-[a-z0-9\-]+)/i);
      const targetOrderId = orderMatch ? orderMatch[1].toUpperCase() : 'DH-20241228';

      const steps: TrackingStep[] = [
        {
          status: OrderStatus.PENDING,
          date: '28/12/2024 10:15',
          description: 'Đơn hàng đã được khởi tạo thành công trên hệ thống',
          completed: true
        },
        {
          status: OrderStatus.PAID,
          date: '28/12/2024 10:16',
          description: 'Đã xác nhận thanh toán qua Cổng lượng tử SZ-Gateway',
          completed: true
        },
        {
          status: OrderStatus.PROCESSING,
          date: '28/12/2024 14:30',
          description: 'Kho vận ZShop đang đóng gói và dán mã kiện',
          completed: true
        },
        {
          status: OrderStatus.SHIPPING,
          date: '29/12/2024 08:00',
          description: 'Đang vận chuyển liên tỉnh (Dự kiến giao ngày mai)',
          completed: false
        }
      ];

      return {
        skill: 'TRACK_ORDER',
        message: `📦 **Thông tin hành trình đơn hàng [${targetOrderId}]**:
- **Trạng thái**: Đang vận chuyển tới bưu cục phát.
- **Dự kiến nhận hàng**: Trong vòng 24-48 giờ tới.
- Quý khách vui lòng để ý điện thoại để shipper ZShop liên hệ giao hàng nhé!`,
        orderInfo: {
          orderId: targetOrderId,
          status: 'Đang giao hàng (SHIPPING)',
          steps: steps,
          estimatedDelivery: '30/12/2024 - 01/01/2025'
        },
        suggestedActions: ['Liên hệ hỗ trợ shipper', 'Xem lịch sử thanh toán', 'Tiếp tục mua sắm']
      };
    }

    // PROMOTION ADVISOR
    const promoKeywords = ['voucher', 'mã giảm giá', 'khuyến mãi', 'ưu đãi', 'giảm giá', 'freeship', 'sale'];
    if (promoKeywords.some(kw => query.includes(kw))) {
      const availablePromos = [
        {
          code: 'ZSHOPNEW',
          discountText: 'Giảm 50.000đ',
          minSpend: 250000,
          description: 'Áp dụng cho đơn hàng đầu tiên từ 250k'
        },
        {
          code: 'FREESHIPMAX',
          discountText: 'Miễn phí vận chuyển',
          minSpend: 500000,
          description: 'Tối đa 30.000đ phí giao hàng toàn quốc'
        },
        {
          code: 'QUANTUM20',
          discountText: 'Giảm 20% (Tối đa 150k)',
          minSpend: 1000000,
          description: 'Đặc quyền khi thanh toán qua Cổng SZ-Payment'
        }
      ];

      return {
        skill: 'PROMOTION_ADVISOR',
        message: `🎁 **ZShop đang có 3 mã ưu đãi siêu hấp dẫn dành riêng cho bạn**:
Nhập mã trực tiếp tại bước Thanh toán để nhận ưu đãi tức thì!`,
        promotions: availablePromos,
        suggestedActions: ['Sao chép mã FREESHIPMAX', 'Mua sắm để đạt điều kiện', 'Đi đến giỏ hàng']
      };
    }

    // QUICK ADD TO CART
    const cartKeywords = ['thêm vào giỏ', 'mua luôn', 'đặt cái', 'cho vào giỏ', 'mua sản phẩm', 'chốt đơn'];
    if (cartKeywords.some(kw => query.includes(kw))) {
      const matched = productCatalog.find(p => 
        query.includes(p.name.toLowerCase()) || 
        query.includes(p.id.toLowerCase())
      ) || productCatalog[0];

      return {
        skill: 'QUICK_ADD_TO_CART',
        message: `🛒 Bạn muốn thêm sản phẩm **${matched.name}** vào giỏ hàng đúng không? Bạn có thể bấm ngay nút bên dưới để thêm hoặc chọn size phù hợp!`,
        products: [matched],
        suggestedActions: [`Thêm "${matched.name}" vào giỏ`, 'Xem giỏ hàng', 'Tiếp tục tìm đồ khác']
      };
    }

    // SMART SEARCH & RECOMMENDATION
    const { minPrice, maxPrice } = this.extractPriceRange(query);

    let filtered = productCatalog.filter(p => {
      const matchPrice = p.price >= minPrice && p.price <= maxPrice;
      return matchPrice;
    });

    const keywords = ['áo', 'quần', 'giày', 'mũ', 'túi', 'đồng hồ', 'hoodie', 'jean', 'dior', 'polo', 'bomber', 'sneaker', 'nam', 'nữ'];
    const activeKeywords = keywords.filter(kw => query.includes(kw));

    if (activeKeywords.length > 0) {
      filtered = filtered.filter(p => {
        const text = `${p.name} ${p.category} ${p.description}`.toLowerCase();
        return activeKeywords.some(kw => text.includes(kw));
      });
    }

    if (filtered.length === 0) {
      filtered = productCatalog.slice(0, 3);
    }

    return {
      skill: 'PRODUCT_SEARCH_RECOMMEND',
      message: filtered.length > 0 
        ? `✨ AI đã chọn lọc **${filtered.length}** sản phẩm phù hợp nhất với yêu cầu của bạn:`
        : 'Tôi đã duyệt toàn bộ kho hàng ZShop. Dưới đây là các sản phẩm nổi bật đang được ưa chuộng nhất:',
      products: filtered.slice(0, 4),
      suggestedActions: ['Xem sản phẩm giảm giá hot', 'Tìm đồ dưới 500k', 'Tư vấn phối đồ cá tính']
    };
  }
}
