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
    name: 'Alex TechPro',
    roleTitle: 'Chuyên Gia Tư Vấn Combo Thiết Bị & Phụ Kiện',
    avatar: '📱',
    badge: 'Tech Gear AI',
    accentColor: 'blue',
    themeGradient: 'from-blue-600 via-cyan-500 to-indigo-600',
    description: 'Tư vấn phối combo thiết bị & phụ kiện hoàn hảo (Smartphone, Sạc GaN, Cáp bọc dù, Ốp MagSafe, Cường lực) theo nhu cầu và ngân sách.',
    getGreeting: (context) => {
      const name = context?.customerProfile?.name || context?.currentUser?.name;
      const cartCount = context?.cartItems?.length || 0;
      let greeting = `⚡ Xin chào${name ? ` **${name}**` : ''}! Mình là **Alex TechPro** - Chuyên gia tư vấn giải pháp thiết bị & phụ kiện công nghệ ZShop.\n\n`;
      if (cartCount > 0) {
        greeting += `🛍️ Mình thấy bạn đang có **${cartCount} món đồ** trong giỏ hàng. Bạn có muốn mình tư vấn thêm củ sạc GaN, cáp sạc nhanh hay ốp lưng chống sốc để tạo thành một **Combo công nghệ hoàn chỉnh** không?`;
      } else {
        greeting += `Bạn đang tìm kiếm thiết bị hay phụ kiện nào hôm nay? Smartphone mới, bộ sạc nhanh GaN, tai nghe chống ồn hay combo cho nhu cầu Gaming / Sáng tạo nội dung? Hãy chia sẻ với mình nhé!`;
      }
      return greeting;
    },
    quickPromptChips: (context) => {
      const chips = [
        '⚡ Combo phụ kiện cần thiết cho iPhone 16',
        '🎮 Combo Smartphone Gaming độ trễ thấp',
        '💼 Combo Doanh nhân sạc nhanh đa thiết bị',
        '🎬 Combo Vlogger & Livestream chuyên nghiệp'
      ];
      if (context?.cartItems && context.cartItems.length > 0) {
        chips.unshift(`🛍️ Gợi ý phụ kiện cho "${context.cartItems[0].name.slice(0, 22)}..."`);
      }
      return chips;
    }
  },

  FITTING: {
    id: 'FITTING',
    name: 'Ken TechSpec',
    roleTitle: 'Chuyên Viên Thông Số & Kiểm Tra Tương Thích',
    avatar: '🔬',
    badge: 'Compatibility AI',
    accentColor: 'emerald',
    themeGradient: 'from-emerald-500 via-teal-500 to-cyan-600',
    description: 'Kiểm tra tương thích chuẩn sạc nhanh (PD, PPS, MagSafe, Qi2), cổng kết nối (Type-C vs Lightning) và so sánh cấu hình máy.',
    getGreeting: (context) => {
      const name = context?.customerProfile?.name || context?.currentUser?.name;
      let greeting = `🔬 Chào${name ? ` **${name}**` : ''}! Tôi là **Ken TechSpec** - Chuyên viên kiểm tra tương thích & tư vấn thông số kỹ thuật chuẩn xác tại ZShop.\n\n`;
      greeting += `💡 Tôi có thể giúp bạn giải đáp mọi thắc mắc kỹ thuật: củ sạc có kích hoạt được sạc siêu nhanh 45W cho Samsung không, cáp sạc có dùng được cho iPhone 15/16 không, hoặc so sánh chi tiết chip/RAM/camera giữa các dòng máy. Bạn đang quan tâm sản phẩm nào?`;
      return greeting;
    },
    quickPromptChips: () => {
      return [
        'Củ sạc này có sạc nhanh 45W cho Samsung S24 không?',
        'Cáp sạc Type-C này có dùng được cho iPhone 15/16?',
        'So sánh iPhone 16 Pro Max vs Galaxy S24 Ultra',
        'Nên chọn dung lượng 128GB hay 256GB?'
      ];
    }
  },

  ORDERS: {
    id: 'ORDERS',
    name: 'Logistics Alex',
    roleTitle: 'Chuyên Viên Vận Chuyển & Bảo Hành IMEI',
    avatar: '📦',
    badge: 'Tracking & Warranty AI',
    accentColor: 'blue',
    themeGradient: 'from-blue-600 via-indigo-600 to-cyan-700',
    description: 'Theo dõi lộ trình giao hỏa tốc 2 giờ, tra cứu bảo hành điện tử chính hãng theo IMEI/Serial và chính sách 1 đổi 1.',
    getGreeting: (context) => {
      const name = context?.customerProfile?.name || context?.currentUser?.name;
      const orders = context?.customerOrders || [];
      let greeting = `📦 Kính chào${name ? ` anh/chị **${name}**` : ''}! Tôi là **Logistics Alex** - Chuyên viên hỗ trợ Đơn hàng, Vận chuyển & Bảo hành ZShop.\n\n`;
      if (orders.length > 0) {
        const latest = orders[0];
        greeting += `🔍 Tôi đã tìm thấy đơn hàng gần nhất của bạn: **[${latest.id}]** đặt ngày **${new Date(latest.createdAt).toLocaleDateString('vi-VN')}**.\nBạn có muốn kiểm tra lộ trình giao hàng hoặc thông tin kích hoạt bảo hành điện tử không?`;
      } else {
        greeting += `Tôi có thể giúp bạn tra cứu hành trình giao hàng hỏa tốc 2 giờ, kích hoạt bảo hành điện tử chính hãng theo IMEI hoặc hỗ trợ quy trình 1 đổi 1 trong 30 ngày (UC10).`;
      }
      return greeting;
    },
    quickPromptChips: (context) => {
      const orders = context?.customerOrders || [];
      if (orders.length > 0) {
        return [
          `🔍 Đơn hàng gần nhất [${orders[0].id}]`,
          'Bao giờ đơn của tôi giao tới nơi?',
          'Chính sách lỗi 1 đổi 1 trong 30 ngày'
        ];
      }
      return [
        'Tra cứu đơn hàng gần nhất của tôi',
        'Kiểm tra bảo hành điện tử theo IMEI',
        'Chính sách lỗi 1 đổi 1 trong 30 ngày'
      ];
    }
  },

  LOYALTY: {
    id: 'LOYALTY',
    name: 'Bella VIP',
    roleTitle: 'Chuyên Viên Khách Hàng VIP & Thu Cũ Đổi Mới',
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
   * Tạo Combo Phụ Kiện & Thiết Bị Công Nghệ (Alex TechPro)
   */
  static generateOutfitCombo(
    prompt: string, 
    cartItems: CartItem[] = [], 
    catalog: ProductDetail[] = MOCK_PRODUCTS_LIST
  ): OutfitCombo {
    const query = prompt.toLowerCase();

    // 1. Phối combo phụ kiện theo giỏ hàng hiện tại nếu có
    if (cartItems.length > 0 && (query.includes('giỏ hàng') || query.includes('món trong giỏ') || query.includes('phụ kiện cho') || query.includes('gợi ý phụ kiện'))) {
      const cartItem = cartItems[0];
      const matchedMain = catalog.find(p => p.id === cartItem.id || p.name === cartItem.name) || catalog[0];
      const isPhone = (matchedMain.category && matchedMain.category.toLowerCase().includes('thoại')) || matchedMain.name.toLowerCase().includes('iphone') || matchedMain.name.toLowerCase().includes('galaxy');
      
      let accessories = catalog.filter(p => {
        const cat = (p.category || '').toLowerCase();
        return cat.includes('sạc') || cat.includes('cáp') || cat.includes('ốp') || cat.includes('cường lực');
      }).slice(0, 2);

      if (accessories.length < 2) {
        accessories = catalog.filter(p => p.id !== matchedMain.id).slice(0, 2);
      }

      const comboItems: ProductDetail[] = [matchedMain, ...accessories];
      const totalPrice = comboItems.reduce((acc, item) => acc + item.price, 0);

      return {
        id: `tech-combo-cart-${Date.now()}`,
        title: `Combo Phụ Kiện Chuẩn Tương Thích Cùng "${matchedMain.name.slice(0, 25)}..."`,
        style: isPhone ? 'Flagship Full Protection & Fast Charge' : 'High Performance Gear',
        occasion: 'Sạc nhanh an toàn, chống va đập toàn diện',
        description: `Alex TechPro đã ghép nối thêm củ sạc GaN và phụ kiện tương thích 100% công suất cho thiết bị của bạn, đạt chuẩn PD/PPS an toàn pin.`,
        items: comboItems,
        totalPrice,
        discountPrice: Math.round(totalPrice * 0.92)
      };
    }

    // 2. Combo Gaming độ trễ thấp
    if (query.includes('gaming') || query.includes('chơi game') || query.includes('game thủ') || query.includes('fps')) {
      const items = catalog.filter(p => 
        p.name.includes('Gaming') || p.name.includes('Tai Nghe') || p.name.includes('Sạc Nhanh 100W') || p.name.includes('ROG')
      ).slice(0, 3);
      const comboItems = items.length >= 2 ? items : catalog.slice(0, 3);
      const totalPrice = comboItems.reduce((acc, item) => acc + item.price, 0);

      return {
        id: 'combo-gaming-pro',
        title: 'Combo Chiến Game Đỉnh Cao (Độ Trễ Siêu Thấp & Tản Nhiệt Tốt)',
        style: 'Gaming Ultra-Low Latency & Fast Charging',
        occasion: 'Leo rank, chơi game đồ họa cao kéo dài mà không lo nóng máy hay tụt pin',
        description: 'Tập hợp phụ kiện cáp sạc góc gập 90 độ chống cấn tay, củ sạc công suất cao và tai nghe hỗ trợ Gaming Mode độ trễ cực thấp.',
        items: comboItems,
        totalPrice,
        discountPrice: Math.round(totalPrice * 0.9)
      };
    }

    // 3. Combo Doanh nhân / Công sở MagSafe
    if (query.includes('công sở') || query.includes('văn phòng') || query.includes('doanh nhân') || query.includes('magsafe') || query.includes('đa thiết bị')) {
      const items = catalog.filter(p => 
        p.name.includes('GaN 65W') || p.name.includes('MagSafe') || p.name.includes('UAG') || p.name.includes('Cáp Sạc Nhanh Type-C')
      ).slice(0, 3);
      const comboItems = items.length >= 2 ? items : catalog.slice(0, 3);
      const totalPrice = comboItems.reduce((acc, item) => acc + item.price, 0);

      return {
        id: 'combo-office-magsafe',
        title: 'Combo Doanh Nhân Văn Phòng Sạc Nhanh Đa Thiết Bị',
        style: 'Executive Multi-Device Fast Charge & Wireless',
        occasion: 'Làm việc văn phòng, công tác, họp hành và di chuyển liên tục',
        description: 'Bộ củ sạc GaN 3 cổng đa năng cấp nguồn đồng thời cho Laptop/iPad/Điện thoại cùng sạc dự phòng không dây MagSafe chuẩn Qi2.',
        items: comboItems,
        totalPrice,
        discountPrice: Math.round(totalPrice * 0.9)
      };
    }

    // 4. Combo Vlogger / Creator Livestream
    if (query.includes('vlog') || query.includes('quay phim') || query.includes('livestream') || query.includes('creator') || query.includes('youtube')) {
      const items = catalog.filter(p => 
        p.name.includes('Gimbal') || p.name.includes('Giá Đỡ') || p.name.includes('100W') || p.name.includes('Tai Nghe')
      ).slice(0, 3);
      const comboItems = items.length >= 2 ? items : catalog.slice(0, 3);
      const totalPrice = comboItems.reduce((acc, item) => acc + item.price, 0);

      return {
        id: 'combo-vlogger-creator',
        title: 'Combo Sáng Tạo Nội Dung & Livestream Bắt Mọi Khung Hình',
        style: 'Pro Creator & Streaming Kit',
        occasion: 'Quay Tiktok, Youtube vlog, livestream bán hàng chống rung chuyên nghiệp',
        description: 'Bao gồm gimbal chống rung thông minh kèm chân tripod, nguồn sạc liên tục và micro/tai nghe lọc tạp âm công nghệ AI.',
        items: comboItems,
        totalPrice,
        discountPrice: Math.round(totalPrice * 0.9)
      };
    }

    // 5. Combo Mặc định: Bộ trang bị cơ bản bảo vệ toàn diện (Budget Starter Kit)
    const defaultItems = catalog.filter(p => 
      p.name.includes('GaN') || p.name.includes('Cáp') || p.name.includes('Kính Cường Lực') || p.name.includes('Ốp Lưng')
    ).slice(0, 3);
    const finalItems = defaultItems.length >= 2 ? defaultItems : catalog.slice(0, 3);
    const totalPrice = finalItems.reduce((acc, item) => acc + item.price, 0);

    return {
      id: 'combo-essential-starter',
      title: 'Combo Trang Bị Thiết Yếu (Sạc GaN Chuẩn PD + Kính Cường Lực)',
      style: 'All-in-One Daily Protection & Fast Charging',
      occasion: 'Sử dụng hằng ngày, bảo vệ chống va đập và rút ngắn 60% thời gian sạc',
      description: 'Bộ phụ kiện phải có khi sắm máy mới: củ sạc GaN nhỏ gọn mát máy, cáp sạc bọc dù chống đứt gãy và kính cường lực chống trầy xước.',
      items: finalItems,
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
    // 1. PERSONA: STYLIST (Alex TechPro - Chuyên Gia Tư Vấn Combo Thiết Bị & Phụ Kiện)
    // =========================================================================
    if (persona === 'STYLIST') {
      const combo = this.generateOutfitCombo(prompt, context.cartItems, productCatalog);
      const personalizedGreeting = customerName ? `Chào **${customerName}**! ` : '';

      return {
        skill: 'AI_FASHION_STYLIST',
        message: `⚡ ${personalizedGreeting}**Alex TechPro** đã tuyển chọn riêng cho bạn **${combo.title}** tối ưu công năng và bảo vệ toàn diện:
- **Chuẩn kết nối & Công suất**: ${combo.style}
- **Mục đích sử dụng**: ${combo.occasion}
- **Đánh giá chuyên gia**: ${combo.description}`,
        outfitCombo: combo,
        products: combo.items,
        suggestedActions: [
          `Thêm cả combo vào giỏ (Tiết kiệm ${(combo.totalPrice - (combo.discountPrice || combo.totalPrice)).toLocaleString('vi-VN')}đ)`,
          'Xem combo sạc nhanh cho thiết bị khác',
          'Kiểm tra tương thích công suất sạc'
        ]
      };
    }

    // =========================================================================
    // 2. PERSONA: FITTING (Ken TechSpec - Chuyên Viên Thông Số & Tương Thích Kỹ Thuật)
    // =========================================================================
    if (persona === 'FITTING') {
      const q = prompt.toLowerCase();
      let deviceMatched = 'Thiết bị của bạn';
      let protocol = 'Chuẩn PD 3.0 & PPS';
      let compatibilityStatus = 'Hoàn toàn tương thích 100%';
      let detailMsg = '';

      if (q.includes('iphone 16') || q.includes('iphone 15')) {
        deviceMatched = 'iPhone 15 / 16 Series';
        protocol = 'Power Delivery 3.0 & MagSafe / Qi2 15W (Cổng USB-C)';
        compatibilityStatus = 'Tương thích tuyệt đối với cáp Type-C to Type-C và củ sạc từ 20W - 45W';
        detailMsg = 'Apple iPhone 15/16 đã chuyển sang cổng Type-C tiêu chuẩn. Bạn nên dùng củ sạc GaN 30W trở lên để sạc 50% pin chỉ trong 25 phút.';
      } else if (q.includes('samsung') || q.includes('s24') || q.includes('s23')) {
        deviceMatched = 'Samsung Galaxy S23 / S24 Series';
        protocol = 'Super Fast Charging 2.0 (PPS 45W 4.05A)';
        compatibilityStatus = 'Tương thích sạc siêu nhanh 45W khi dùng củ sạc chuẩn PPS và cáp 5A E-Marker';
        detailMsg = 'Samsung yêu cầu chuẩn PPS (Programmable Power Supply). Củ sạc ZShop GaN 45W/65W đều tích hợp chip GaN III hỗ trợ chuẩn này.';
      } else if (q.includes('macbook') || q.includes('laptop') || q.includes('ipad')) {
        deviceMatched = 'MacBook / iPad / Laptop Type-C';
        protocol = 'Power Delivery 65W - 100W (E-Marker Chip)';
        compatibilityStatus = 'Tương thích hoàn hảo với củ sạc GaN 65W - 100W';
        detailMsg = 'Bạn có thể sạc đồng thời cả laptop và điện thoại trên cùng một củ sạc GaN 3 cổng, dòng điện được phân phối tự động thông minh.';
      } else {
        deviceMatched = 'Smartphone & Phụ kiện công nghệ';
        protocol = 'Universal USB-C / PD / QC 4.0+';
        compatibilityStatus = 'Tương thích 100% với các thiết bị di động phổ biến hiện nay';
        detailMsg = 'Hệ thống tự động nhận diện thiết bị và điều chỉnh dòng sạc an toàn, bảo vệ chống quá dòng, quá nhiệt và chai pin.';
      }

      return {
        skill: 'AI_SMART_FITTING',
        message: `🔬 **Ken TechSpec** đã kiểm định thông số kỹ thuật cho **${deviceMatched}**:
- ⚡ **Chuẩn sạc tương thích**: **${protocol}**
- 🛡️ **Độ tương thích**: **${compatibilityStatus}**
- 💡 **Khuyến nghị kỹ thuật**: ${detailMsg}`,
        suggestedActions: [
          'Kiểm tra củ sạc GaN 65W 3 cổng',
          'Cáp sạc Type-C bọc dù 100W 5A',
          'Xem kính cường lực KingKong chống va đập'
        ]
      };
    }

    // =========================================================================
    // 3. PERSONA: ORDERS (Logistics Alex - Chuyên Viên Đơn Hàng & Vận Chuyển)
    // =========================================================================
    if (persona === 'ORDERS') {
      const orders = context.customerOrders || [];
      const personalizedSalute = customerName ? `anh/chị **${customerName}**` : 'quý khách';

      if (query.includes('đổi') || query.includes('trả') || query.includes('bảo hành') || query.includes('lỗi') || query.includes('hoàn tiền')) {
        return {
          skill: 'TRACK_ORDER',
          message: `🔄 **Chính sách Bảo hành & Đổi trả ZShop (Bảo hành điện tử theo IMEI/Serial)**:
- 📱 **Lỗi 1 đổi 1 trong 30 ngày**: Áp dụng cho mọi lỗi phần cứng từ nhà sản xuất đối với Điện thoại & Phụ kiện.
- 🔌 **Bảo hành 12 - 24 tháng chính hãng**: Kích hoạt tự động qua số điện thoại và IMEI/Serial điện tử, không cần giữ phiếu giấy.
- ⚡ **Đổi phụ kiện không tương thích trong 7 ngày**: Hoàn tiền hoặc đổi sản phẩm khác miễn phí 100% nếu không tương thích với thiết bị của bạn.
- **Quy trình 3 bước**:
  1. Vào mục *"Quản lý Đơn hàng"* hoặc nhập mã đơn hàng [DH-xxxx].
  2. Bấm *"Yêu cầu Bảo hành / Đổi trả"* và mô tả lỗi thiết bị.
  3. Shipper ZShop tiếp nhận và giao sản phẩm mới tận nhà trong 24 giờ.`,
          suggestedActions: ['Tra cứu bảo hành IMEI', 'Gửi yêu cầu đổi trả', 'Kết nối kỹ thuật viên ZShop']
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
- Sản phẩm: **${matched.name}** (${matched.category || 'Điện tử & Phụ kiện'})
- Tình trạng kho: **${statusText}**
- Vị trí lưu kho: Kệ T1-08 (Kho Thiết Bị Công Nghệ TP.HCM)
- Đơn giá niêm yết: **${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(matched.price)}**`,
        stockInquiry: {
          productName: matched.name,
          stock: matched.stock,
          inStock: inStock,
          category: matched.category || 'Điện thoại & Phụ kiện',
          statusText: statusText,
          suggestedActionText: inStock ? 'Đặt mua ngay' : 'Đăng ký nhận thông báo khi có hàng'
        },
        products: [matched],
        suggestedActions: inStock 
          ? [`Thêm "${matched.name}" vào giỏ`, 'Kiểm tra sản phẩm khác', 'Hỏi tư vấn tương thích'] 
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
- **Tăng trưởng Doanh thu**: +18.5% so với cùng kỳ tháng trước nhờ danh mục Củ sạc GaN và Phụ kiện MagSafe.
- **Biên lợi nhuận gộp (Gross Margin)**: Đạt **36.8%**, dẫn đầu phân khúc phụ kiện điện tử.
- **Tỷ lệ đổi trả & hoàn hàng (UC10)**: Duy trì ở mức cực thấp **1.2%** (ngưỡng an toàn < 3%).
- **Dự báo 7 ngày tới**: Dự kiến doanh thu đạt ~320.000.000đ khi mở bán đợt phụ kiện iPhone 16 / S24 Ultra.
- **Khuyến nghị chiến lược**: Tăng lượng nhập kho củ sạc GaN 65W và cáp dù E-Marker 100W, đồng thời chạy combo kèm smartphone để tăng Average Order Value (AOV).`,
        businessInsights: {
          revenueGrowth: '+18.5% MoM',
          grossMargin: '36.8%',
          returnRate: '1.2% (Rất tốt)',
          forecastAdvice: 'Dự kiến tăng 30% khi chạy Mega Sale phụ kiện sạc nhanh',
          strategicAction: 'Bổ sung tồn kho Củ sạc Anker GaN 65W và tặng Voucher 50k cho khách mua điện thoại.'
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
- Đơn hàng ghi nhận hôm nay: **26 đơn**
- Mặt hàng bán chạy nhất: **${topSellingItems[0]?.name || 'Củ Sạc Nhanh Anker 67W GaN'}** (${topSellingItems[0]?.sold || 850} lượt bán)
- ⚠️ Cảnh báo: Có **${lowStockItems.length}** sản phẩm số lượng tồn kho dưới 40 cần bổ sung gấp!`,
        analytics: {
          totalRevenue: totalCalculatedRevenue,
          todayOrders: 26,
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
        .trim() || 'Củ Sạc Nhanh GaN 65W 3 Cổng Type-C & USB-A';

      return {
        skill: 'AI_COPYWRITER',
        message: `✍️ **AI đã khởi tạo nội dung bán hàng tối ưu cho "${cleanedName}":**`,
        copywriting: {
          title: `🔥 [CHÍNH HÃNG] ${cleanedName} - Chip GaN III Tản Nhiệt Mát, Chuẩn PD 3.0 & PPS 45W`,
          highlights: [
            'Công nghệ bán dẫn GaN III tiên tiến giúp thu nhỏ 50% kích thước củ sạc',
            'Hỗ trợ sạc siêu nhanh PD 3.0 / PPS 45W cho Samsung S24 & iPhone 15/16',
            '3 cổng ra thông minh cho phép sạc đồng thời Laptop, Điện thoại và Tai nghe',
            'Hệ thống bảo vệ đa lớp ActiveShield chống quá nhiệt, quá tải dòng điện'
          ],
          description: `Bạn đang tìm kiếm một củ sạc tất-cả-trong-một cho chuyến công tác hay bàn làm việc gọn gàng? ${cleanedName} chính là trợ thủ đắc lực!\nSản phẩm đạt chứng nhận an toàn quốc tế, bảo hành 18 tháng lỗi 1 đổi 1 chính hãng tại ZShop.`,
          suggestedPrice: 489000,
          hashtags: ['#ZShopTech', '#SacNhanhGaN', '#PhuKienChinhHang', '#iPhone16', '#SamsungS24']
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
          description: 'Kho vận ZShop đang đóng gói và dán tem niêm phong IMEI',
          completed: true
        },
        {
          status: OrderStatus.SHIPPING,
          date: '29/12/2024 08:00',
          description: 'Đang vận chuyển hỏa tốc liên tỉnh (Shipper ZShop Express)',
          completed: false
        }
      ];

      return {
        skill: 'TRACK_ORDER',
        message: `📦 **Thông tin hành trình đơn hàng [${targetOrderId}]**:
- **Trạng thái**: Đang vận chuyển hỏa tốc tới bưu cục phát.
- **Bảo hành điện tử**: Đã kích hoạt theo IMEI thiết bị trên hệ thống ZShop.
- **Dự kiến nhận hàng**: Trong vòng 24 giờ tới (Giao hỏa tốc).
- Quý khách vui lòng để ý điện thoại để shipper ZShop liên hệ giao hàng nhé!`,
        orderInfo: {
          orderId: targetOrderId,
          status: 'Đang giao hàng (SHIPPING)',
          steps: steps,
          estimatedDelivery: '30/12/2024 - 01/01/2025'
        },
        suggestedActions: ['Liên hệ hỗ trợ shipper', 'Xem kích hoạt bảo hành IMEI', 'Tiếp tục mua sắm']
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
        message: `🛒 Bạn muốn thêm sản phẩm **${matched.name}** vào giỏ hàng đúng không? Bạn có thể bấm ngay nút bên dưới để thêm vào giỏ!`,
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

    const keywords = ['iphone', 'samsung', 'xiaomi', 'sạc', 'cáp', 'dự phòng', 'tai nghe', 'ốp lưng', 'cường lực', 'giá đỡ', 'gimbal', 'anker', 'baseus', 'gan', 'type-c', 'lightning', 'magsafe', 'apple'];
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
