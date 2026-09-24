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
  decodedGenZQuery?: string;
  detectedAbbreviations?: { raw: string; meaning: string }[];
}

/**
 * Cấu hình cho từng Chuyên Gia AI (Persona)
 */
export interface AIPersonaConfig {
  id: AIPersonaType;
  name: string;
  shortName: string;
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
 * Danh mục 5 Trợ Lý AI Chuyên Biệt (Đã chuẩn hóa shortName chống lỗi cắt chữ "Giới")
 */
export const AI_PERSONAS: Record<AIPersonaType, AIPersonaConfig> = {
  STYLIST: {
    id: 'STYLIST',
    name: 'ZShop GenZ iPhone AI',
    shortName: 'Tư Vấn GenZ',
    roleTitle: 'Trợ Lý Tư Vấn iPhone Ngôn Ngữ Tự Nhiên GenZ (4s ➔ 18 Pro Max)',
    avatar: '📱',
    badge: 'GenZ NLP v3.8',
    accentColor: 'amber',
    themeGradient: 'from-[#1c1b18] via-[#2e2922] to-[#8c6f46]',
    description: 'Hiểu 100% từ viết tắt & teencode GenZ Việt Nam (18prm, giá bn sốp, trả góp, thu cũ bù nhiu, còn hàng k...) & trả lời đúng trọng tâm câu hỏi.',
    getGreeting: (context) => {
      const name = context?.customerProfile?.name || context?.currentUser?.name;
      const cartCount = context?.cartItems?.length || 0;
      const activeProd = context?.activeProduct;
      let greeting = `✨ Hé lô${name ? ` **${name}**` : ' bạn iu'}! Mình là **ZShop GenZ iPhone AI** — Đã liên kết toàn diện với **Kho 45 mẫu iPhone, Giỏ hàng (${cartCount} món), Đơn hàng & Điểm VIP** của bạn.\n\n`;
      if (activeProd) {
        greeting += `👀 Mình thấy bạn đang xem **${activeProd.name}** (*${activeProd.price.toLocaleString('vi-VN')}đ*). Bạn có thể hỏi ngay: **"Mẫu nào bán chạy nhất?"**, **"Con này trả góp đưa trước bao nhiêu?"**, **"So sánh máy này với 18prm"** hoặc **"Kiểm tra giỏ hàng của tôi"** nhé!`;
      } else if (cartCount > 0) {
        greeting += `🛍️ Giỏ hàng của bạn đang có **${cartCount} sản phẩm**. Cứ gõ thoải mái như **"Mẫu nào bán chạy nhất"**, **"18prm giá bn sốp"**, **"Thu cũ 14prm lên 18prm bù nhiu"** hay **"Kiểm tra giỏ hàng"** — mình trả lời chuẩn đét luôn nha!`;
      } else {
        greeting += `🔥 Mình hiểu 100% ngôn ngữ tự nhiên & từ viết tắt GenZ Việt Nam.\n💡 Bạn cứ hỏi tự nhiên như: *"Mẫu nào bán chạy nhất?"*, *"18prm giá bn sốp?"*, *"16prm trả góp đưa trc bnhiu?"* hoặc *"Dưới 15 củ con nào chiến game đỉnh nhất?"* nhé!`;
      }
      return greeting;
    },
    quickPromptChips: (context) => [
      '🏆 Mẫu nào bán chạy nhất?',
      context?.activeProduct ? `📱 Đánh giá ${context.activeProduct.name.split(' ').slice(0, 3).join(' ')} đang xem` : '🔥 18prm giá bn z sốp?',
      '💳 16prm trả góp đưa trc bnhiu?',
      '🔄 Thu cũ 14prm lên 18prm bù mấy củ?',
      '🛒 Kiểm tra giỏ hàng của tôi'
    ]
  },

  FITTING: {
    id: 'FITTING',
    name: 'Apple Spec & So Sánh AI',
    shortName: 'Cấu Hình & Spec',
    roleTitle: 'Chuyên Gia Phân Tích Cấu Hình, Pin, Camera & So Sánh Đời Máy',
    avatar: '🔬',
    badge: 'Apple Spec AI',
    accentColor: 'amber',
    themeGradient: 'from-[#24221e] via-[#38332b] to-[#7d623c]',
    description: 'Phân tích chuyên sâu Chip A-Series (A5 ➔ A20 Pro 2nm), màn ProMotion 120Hz, Camera Tele 10x, FPS chiến game và thời lượng Pin thực tế.',
    getGreeting: (context) => {
      const name = context?.customerProfile?.name || context?.currentUser?.name;
      let greeting = `🔬 Chào${name ? ` **${name}**` : ' bro'}! Mình là **Apple Spec & So Sánh AI** — Chuyên gia mổ xẻ phần cứng & đọ cấu hình tại **Thế Giới iPhone**.\n\n`;
      greeting += `💡 Gõ nhanh kiểu GenZ như **"so sánh 18prm với 17prm"**, **"16prm chiến genshin mấy fps"**, **"17 air mỏng vậy pin trâu ko"** hay **"15prm dùng sạc mấy W"** để mình phân tích thông số kỹ thuật chi tiết nhé!`;
      return greeting;
    },
    quickPromptChips: () => [
      '⚡ So sánh 18prm với 17prm chi tiết',
      '🎮 16prm chiến Genshin Liên Quân mượt ko?',
      '🔋 17 air siêu mỏng 5.5mm pin trâu ko sốp?',
      '📸 18prm với 16prm con nào chụp đêm đỉnh hơn?'
    ]
  },

  ORDERS: {
    id: 'ORDERS',
    name: 'Đơn Hàng & Bảo Hành AI',
    shortName: 'Đơn Hàng & Care',
    roleTitle: 'Chuyên Viên Tra Cứu Đơn Hàng, Ship COD & Bảo Hành IMEI',
    avatar: '📦',
    badge: 'Tracking & Care AI',
    accentColor: 'amber',
    themeGradient: 'from-[#1f1e1b] via-[#332e27] to-[#8c6f46]',
    description: 'Theo dõi giao hỏa tốc 2h, đồng kiểm Ship COD, tra cứu bảo hành AppleCare+ theo IMEI/Serial và chính sách lỗi 1 đổi 1 trong 30 ngày.',
    getGreeting: (context) => {
      const name = context?.customerProfile?.name || context?.currentUser?.name;
      const orders = context?.customerOrders || [];
      let greeting = `📦 Xin chào${name ? ` **${name}**` : ' bạn'}! Mình là **Đơn Hàng & Bảo Hành AI** tại **Thế Giới iPhone**.\n\n`;
      if (orders.length > 0) {
        const latest = orders[0];
        greeting += `🔍 Mình tìm thấy đơn hàng gần nhất của bạn: **[${latest.id}]** đặt ngày **${new Date(latest.createdAt).toLocaleDateString('vi-VN')}**.\nBạn muốn check đơn ship tới đâu rồi, hỏi về Ship COD đồng kiểm hay tra cứu bảo hành 1 đổi 1 theo IMEI nè?`;
      } else {
        greeting += `Mình hỗ trợ kiểm tra lộ trình giao hỏa tốc 2h, chính sách Ship COD bóc seal kiểm hàng, và bảo hành 1 đổi 1 trong 30 ngày chuẩn Apple VN/A!`;
      }
      return greeting;
    },
    quickPromptChips: (context) => {
      const orders = context?.customerOrders || [];
      if (orders.length > 0) {
        return [
          `🔍 Đơn [${orders[0].id}] ship tới đâu rồi sốp?`,
          '📦 Ship COD có đc bóc hộp kiểm hàng trc ko?',
          '🛡️ Chính sách bh 1 đổi 1 trong 30 ngày ntn?'
        ];
      }
      return [
        '🚚 Ship nội thành mất bao lâu & có freeship ko?',
        '📦 Mua COD có đc kiểm tra máy trc khi trả tiền ko?',
        '🛡️ Hàng Likenew 99% và VN/A bảo hành bao lâu?'
      ];
    }
  },

  LOYALTY: {
    id: 'LOYALTY',
    name: 'Đặc Quyền VIP & Thu Cũ AI',
    shortName: 'VIP & Thu Cũ',
    roleTitle: 'Chuyên Viên Thu Cũ Lên Đời (Trade-in), Trả Góp 0% & Mã Voucher',
    avatar: '👑',
    badge: 'VIP & Trade-In AI',
    accentColor: 'amber',
    themeGradient: 'from-[#2a241b] via-[#5c482c] to-[#9a7b4f]',
    description: 'Định giá thu cũ lên đời trợ giá 3 củ, tính bảng trả góp 0% duyệt CCCD 5 phút và săn mã voucher giảm sâu nhất.',
    getGreeting: (context) => {
      const prof = context?.customerProfile;
      const name = prof?.name || context?.currentUser?.name;
      let greeting = `👑 Chào mừng${name ? ` **${name}**` : ' bạn'} đến với **Đặc Quyền VIP & Thu Cũ AI** tại **Thế Giới iPhone**!\n\n`;
      if (prof) {
        const pointVal = prof.points * 100;
        const pointValStr = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(pointVal);
        greeting += `⭐ Bạn đang giữ **Hạng Thẻ ${prof.tier.toUpperCase()}** với **${prof.points} điểm** (= **${pointValStr}** trừ thẳng vào đơn)!\n\nHỏi mình ngay kiểu: *"thu cũ 14prm lên 18prm bù bnhiu"*, *"trả góp 0% cần gì"* hoặc *"xin mã giảm giá sốp ơi"* nhé!`;
      } else {
        greeting += `Mình chuyên tính giá Thu cũ đổi mới trợ giá tới 3 triệu đồng, tư vấn Trả góp 0% duyệt CCCD 5 phút (kể cả HSSV) và tung mã Voucher độc quyền!`;
      }
      return greeting;
    },
    quickPromptChips: (context) => {
      const prof = context?.customerProfile;
      if (prof) {
        return [
          `⭐ Đổi ${prof.points} điểm (-${(prof.points * 100).toLocaleString('vi-VN')}đ) ntn?`,
          '🔄 Thu cũ 14prm lên 18prm bù mấy củ?',
          '🎁 Xin full mã giảm giá & voucher hôm nay sốp ơi'
        ];
      }
      return [
        '🔄 Thu cũ 13prm lên 16prm bù bao nhiêu tiền?',
        '💳 HSSV mua trả góp 0% cần giấy tờ gì ko?',
        '🎁 Có voucher giảm giá nào hot cho đơn hôm nay ko?'
      ];
    }
  },

  BUSINESS: {
    id: 'BUSINESS',
    name: 'Quản Trị & Kho Vận AI',
    shortName: 'Quản Trị Kho',
    roleTitle: 'Trợ Lý Quản Trị Doanh Số & Điều Phối Tồn Kho',
    avatar: '💼',
    badge: 'Internal Business AI',
    accentColor: 'slate',
    themeGradient: 'from-[#1c1b18] via-[#272521] to-[#3a352d]',
    description: 'Dành cho Chủ cửa hàng (Admin), Nhân viên Bán hàng và Nhân viên Kho: Báo cáo doanh số, dự báo tồn kho (UC08) và hỏi đáp kinh doanh (UC09).',
    getGreeting: (context) => {
      const name = context?.currentUser?.name || 'Quản trị viên';
      return `💼 Xin chào **${name}**! Tôi là **Quản Trị & Kho Vận AI** - Trợ lý số dành riêng cho Ban Quản trị & Vận hành **Thế Giới iPhone**.\n\nTôi đã đồng bộ toàn bộ dữ liệu thời gian thực từ Kho 25 dòng iPhone, Điểm bán POS và Báo cáo Doanh thu. Bạn muốn kiểm tra số liệu kinh doanh nào hôm nay?`;
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
 * TỪ ĐIỂN GIẢI MÃ NGÔN NGỮ TỰ NHIÊN & TỪ VIẾT TẮT GENZ VIỆT NAM
 */
export const GENZ_ABBREVIATION_RULES: Array<{
  pattern: RegExp;
  replacement: string;
  label: string;
  meaning: string;
}> = [
  // Model viết tắt
  { pattern: /\b(?:ip\s*)?18\s*(?:prm|pm|promax)\b/gi, replacement: 'iPhone 18 Pro Max', label: '18prm', meaning: 'iPhone 18 Pro Max' },
  { pattern: /\b(?:ip\s*)?18\s*(?:pro|p)\b(?!\s*max)/gi, replacement: 'iPhone 18 Pro', label: '18pro', meaning: 'iPhone 18 Pro' },
  { pattern: /\b(?:ip\s*)?17\s*(?:prm|pm|promax)\b/gi, replacement: 'iPhone 17 Pro Max', label: '17prm', meaning: 'iPhone 17 Pro Max' },
  { pattern: /\b(?:ip\s*)?17\s*(?:pro|p)\b(?!\s*max)/gi, replacement: 'iPhone 17 Pro', label: '17pro', meaning: 'iPhone 17 Pro' },
  { pattern: /\b(?:ip\s*)?17\s*air\b/gi, replacement: 'iPhone 17 Air', label: '17 air', meaning: 'iPhone 17 Air Siêu Mỏng' },
  { pattern: /\b(?:ip\s*)?16\s*(?:prm|pm|promax)\b/gi, replacement: 'iPhone 16 Pro Max', label: '16prm', meaning: 'iPhone 16 Pro Max' },
  { pattern: /\b(?:ip\s*)?16\s*(?:pro|p)\b(?!\s*max)/gi, replacement: 'iPhone 16 Pro', label: '16pro', meaning: 'iPhone 16 Pro' },
  { pattern: /\b(?:ip\s*)?16\s*(?:pl|plus|\+)\b/gi, replacement: 'iPhone 16 Plus', label: '16plus', meaning: 'iPhone 16 Plus' },
  { pattern: /\b(?:ip\s*)?15\s*(?:prm|pm|promax)\b/gi, replacement: 'iPhone 15 Pro Max', label: '15prm', meaning: 'iPhone 15 Pro Max' },
  { pattern: /\b(?:ip\s*)?15\s*(?:pro|p)\b(?!\s*max)/gi, replacement: 'iPhone 15 Pro', label: '15pro', meaning: 'iPhone 15 Pro' },
  { pattern: /\b(?:ip\s*)?15\s*(?:pl|plus|\+)\b/gi, replacement: 'iPhone 15 Plus', label: '15plus', meaning: 'iPhone 15 Plus' },
  { pattern: /\b(?:ip\s*)?14\s*(?:prm|pm|promax)\b/gi, replacement: 'iPhone 14 Pro Max', label: '14prm', meaning: 'iPhone 14 Pro Max' },
  { pattern: /\b(?:ip\s*)?14\s*(?:pro|p)\b(?!\s*max)/gi, replacement: 'iPhone 14 Pro', label: '14pro', meaning: 'iPhone 14 Pro' },
  { pattern: /\b(?:ip\s*)?13\s*(?:prm|pm|promax)\b/gi, replacement: 'iPhone 13 Pro Max', label: '13prm', meaning: 'iPhone 13 Pro Max' },
  { pattern: /\b(?:ip\s*)?12\s*(?:prm|pm|promax)\b/gi, replacement: 'iPhone 12 Pro Max', label: '12prm', meaning: 'iPhone 12 Pro Max' },
  { pattern: /\b(?:ip\s*)?11\s*(?:prm|pm|promax)\b/gi, replacement: 'iPhone 11 Pro Max', label: '11prm', meaning: 'iPhone 11 Pro Max' },
  { pattern: /\b(?:ip\s*)?xsm\b/gi, replacement: 'iPhone XS Max', label: 'xsm', meaning: 'iPhone XS Max' },
  { pattern: /\b(?:ip\s*)?8p\b/gi, replacement: 'iPhone 8 Plus', label: '8p', meaning: 'iPhone 8 Plus' },
  // Từ lóng & viết tắt giao tiếp GenZ
  { pattern: /\b(?:sốp|sop|ad|fen|bro)\b/gi, replacement: 'shop', label: 'sốp/fen', meaning: 'Shop / Tư vấn viên' },
  { pattern: /\b(?:bn|bnh|bnhiu|baonhiu|bnhieu|nhiu)\b/gi, replacement: 'bao nhiêu', label: 'bn/bnhiu', meaning: 'bao nhiêu (hỏi giá/số lượng)' },
  { pattern: /\b(?:rổ giá)\b/gi, replacement: 'giá bán', label: 'rổ giá', meaning: 'giá bán' },
  { pattern: /\b(?:k|ko|kh|hong|hông|hem|hok|k0)\b/gi, replacement: 'không', label: 'ko/k/hong', meaning: 'không' },
  { pattern: /\b(?:đc|dc|đk|dk)\b/gi, replacement: 'được', label: 'đc/dc', meaning: 'được' },
  { pattern: /\b(?:ntn|sao z|sao v)\b/gi, replacement: 'như thế nào', label: 'ntn', meaning: 'như thế nào' },
  { pattern: /\b(?:trc|trk)\b/gi, replacement: 'trước', label: 'trc', meaning: 'trước' },
  { pattern: /\b(?:bh)\b/gi, replacement: 'bảo hành', label: 'bh', meaning: 'bảo hành' },
  { pattern: /\b(?:tg)\b/gi, replacement: 'trả góp', label: 'tg', meaning: 'trả góp' },
  { pattern: /\b(?:hssv|sv)\b/gi, replacement: 'học sinh sinh viên', label: 'hssv', meaning: 'học sinh - sinh viên' },
  { pattern: /\b(?:đt|dt|dth)\b/gi, replacement: 'điện thoại', label: 'đt', meaning: 'điện thoại' },
  { pattern: /\b(?:ip|ifone|táo)\b/gi, replacement: 'iPhone', label: 'ip/táo', meaning: 'iPhone' },
  { pattern: /\b(?:vna|vn\/a)\b/gi, replacement: 'chính hãng VN/A', label: 'vna', meaning: 'Chính hãng Apple Việt Nam' },
  { pattern: /\b(?:fs)\b/gi, replacement: 'freeship', label: 'fs', meaning: 'Miễn phí vận chuyển' },
  { pattern: /\b(?:ck)\b/gi, replacement: 'chuyển khoản', label: 'ck', meaning: 'Chuyển khoản ngân hàng' },
  { pattern: /\b(\d+(?:[.,]\d+)?)\s*(?:củ|cu|chai|lúa)\b/gi, replacement: '$1 triệu đồng', label: 'củ/lúa', meaning: 'triệu VNĐ' }
];

/**
 * Xử lý phân tích từ khóa và bóc tách thực thể (Intent & Entity Extraction)
 */
export class AISkillEngine {
  /**
   * Chuẩn hóa câu hỏi ngôn ngữ tự nhiên GenZ Việt Nam và ghi nhận các từ viết tắt đã giải mã
   */
  static normalizeGenZText(rawText: string): {
    normalized: string;
    detectedAbbreviations: { raw: string; meaning: string }[];
  } {
    let normalized = rawText;
    const detectedAbbreviations: { raw: string; meaning: string }[] = [];

    for (const rule of GENZ_ABBREVIATION_RULES) {
      const matches = rawText.match(rule.pattern);
      if (matches && matches.length > 0) {
        if (!detectedAbbreviations.some(d => d.raw.toLowerCase() === matches[0].trim().toLowerCase())) {
          detectedAbbreviations.push({
            raw: matches[0].trim(),
            meaning: rule.meaning
          });
        }
        normalized = normalized.replace(rule.pattern, rule.replacement);
      }
    }

    return {
      normalized: normalized.replace(/\s+/g, ' ').trim(),
      detectedAbbreviations
    };
  }

  /**
   * Bóc tách khoảng giá từ văn bản (Hỗ trợ slang GenZ: củ, tr, triệu, m, chai, lúa, lít, cành, k, chục củ)
   */
  static extractPriceRange(text: string): { minPrice: number; maxPrice: number } {
    const lower = text.toLowerCase()
      .replace(/hai\s*chục\s*(củ|tr|triệu)/g, '20 củ')
      .replace(/một\s*chục\s*(củ|tr|triệu)|chục\s*(củ|tr|triệu)/g, '10 củ')
      .replace(/ba\s*chục\s*(củ|tr|triệu)/g, '30 củ')
      .replace(/(\d+)\s*(?:củ|tr|triệu)\s*rưỡi/g, '$1.5 củ');

    let minPrice = 0;
    let maxPrice = Infinity;

    const toVND = (num: number, unit: string) => {
      if (['tr', 'triệu', 'm', 'củ', 'cu', 'chai', 'lúa', 'khoai'].includes(unit)) return num * 1000000;
      if (['lít', 'lit'].includes(unit)) return num * 100000;
      if (['k', 'ka', 'nghìn', 'ngàn', 'cành', 'canh'].includes(unit)) return num * 1000;
      return num <= 65 ? num * 1000000 : num * 1000;
    };

    // Pattern 1: Khoảng giá "từ X đến Y củ / tr" hoặc "X - Y củ"
    const rangeMatch = lower.match(/(?:từ\s*)?(\d+(?:[.,]\d+)?)\s*(?:củ|cu|tr|triệu|m)?\s*(?:đến|tới|-|~)\s*(\d+(?:[.,]\d+)?)\s*(củ|cu|triệu|tr|m|chai|lúa)/);
    if (rangeMatch) {
      const n1 = parseFloat(rangeMatch[1].replace(',', '.'));
      const n2 = parseFloat(rangeMatch[2].replace(',', '.'));
      const unit = rangeMatch[3] || 'củ';
      return {
        minPrice: toVND(Math.min(n1, n2), unit),
        maxPrice: toVND(Math.max(n1, n2), unit)
      };
    }

    // Pattern 2: dưới / chưa tới / quay đầu X củ / tr / k
    const underMatch = lower.match(/(?:dưới|duoi|chưa tới|không quá|<|<=)\s*(\d+(?:[.,]\d+)?)\s*(củ|cu|triệu|tr|m|chai|lúa|lít|lit|cành|canh|k|nghìn|ngàn)?/);
    if (underMatch) {
      const num = parseFloat(underMatch[1].replace(',', '.'));
      maxPrice = toVND(num, underMatch[2] || 'củ');
      return { minPrice, maxPrice };
    }

    const quayDauMatch = lower.match(/(\d+(?:[.,]\d+)?)\s*(củ|cu|triệu|tr|m|chai|lúa)\s*quay\s*đầu/);
    if (quayDauMatch) {
      const num = parseFloat(quayDauMatch[1].replace(',', '.'));
      maxPrice = toVND(num, quayDauMatch[2] || 'củ');
      return { minPrice, maxPrice };
    }

    // Pattern 3: trên / hơn / từ X củ / tr / k
    const overMatch = lower.match(/(?:trên|hơn|từ|tu|>|>=)\s*(\d+(?:[.,]\d+)?)\s*(củ|cu|triệu|tr|m|chai|lúa|lít|lit|cành|canh|k|nghìn|ngàn)?/);
    if (overMatch) {
      const num = parseFloat(overMatch[1].replace(',', '.'));
      minPrice = toVND(num, overMatch[2] || 'củ');
    }

    // Pattern 4: tầm / khoảng / có / ngân sách / tài chính X củ / tr
    const aroundMatch = lower.match(/(?:tầm|tam|khoảng|khoang|cỡ|co|có|ngân sách|tài chính|cầm)?\s*(\d+(?:[.,]\d+)?)\s*(củ|cu|triệu|tr|m|chai|lúa)/);
    if (aroundMatch && maxPrice === Infinity) {
      const num = parseFloat(aroundMatch[1].replace(',', '.'));
      const base = toVND(num, aroundMatch[2] || 'củ');
      minPrice = Math.max(0, base * 0.72);
      maxPrice = base * 1.18;
    }

    return { minPrice, maxPrice };
  }

  /**
   * Bộ giải mã ngôn ngữ viết tắt GenZ sang đúng mã sản phẩm iPhone trong Database (25 mẫu từ 4s -> 18 Pro Max)
   * Hỗ trợ cả viết dính liền: "ip18prm", "18prm", "16pm", "15plus", "14pro", "xsm", "8p"...
   */
  static resolveGenZPhoneModels(text: string, catalog: ProductDetail[] = MOCK_PRODUCTS_LIST): ProductDetail[] {
    // Tách chữ ip dính liền số (vd: ip18prm -> ip 18 prm, 16prm -> 16 prm, 18ultra -> 18 ultra)
    const q = text
      .toLowerCase()
      .replace(/(?:iphone|ifone|ip|táo)(\d+)/gi, ' ip $1 ')
      .replace(/(\d+)(ultra|prm|pm|promax|pro|plus|pl|air|e\b)/gi, '$1 $2')
      .replace(/iphone|ifone|\bip\b|táo|điện thoại|máy/g, ' ip ')
      .replace(/\s+/g, ' ')
      .trim();

    const rules: Array<{ id: string; regex: RegExp }> = [
      { id: 'ip-18-ultra',        regex: /\b18\s*ultra\b/i },
      { id: 'ip-18-promax-1tb',   regex: /\b18\s*(prm|pm|pro\s*max|promax)\s*1\s*tb\b/i },
      { id: 'ip-18-promax-512gb', regex: /\b18\s*(prm|pm|pro\s*max|promax)\s*512\s*(gb|g)?\b/i },
      { id: 'ip-18-promax',       regex: /\b18\s*(prm|pm|pro\s*max|promax)\b/i },
      { id: 'ip-18-pro-512gb',    regex: /\b18\s*(pro|p)\s*512\s*(gb|g)?\b/i },
      { id: 'ip-18-pro',          regex: /\b18\s*(pro|p)\b(?!\s*max)/i },
      { id: 'ip-18-plus',         regex: /\b18\s*(plus|pl|\+)\b/i },
      { id: 'ip-18e',             regex: /\b18\s*e\b/i },
      { id: 'ip-18',              regex: /\b(?:ip\s*)?18\b(?!\s*(ultra|prm|pm|pro|p|plus|pl|\+|e|củ|tr|triệu|m|gb|tb|%))/i },

      { id: 'ip-17-promax-1tb',   regex: /\b17\s*(prm|pm|pro\s*max|promax)\s*1\s*tb\b/i },
      { id: 'ip-17-promax-512gb', regex: /\b17\s*(prm|pm|pro\s*max|promax)\s*512\s*(gb|g)?\b/i },
      { id: 'ip-17-promax',       regex: /\b17\s*(prm|pm|pro\s*max|promax)\b/i },
      { id: 'ip-17-pro-512gb',    regex: /\b17\s*(pro|p)\s*512\s*(gb|g)?\b/i },
      { id: 'ip-17-pro',          regex: /\b17\s*(pro|p)\b(?!\s*max)/i },
      { id: 'ip-17-air',          regex: /\b(17\s*air|ip\s*air|air\s*5\.5|siêu\s*mỏng)\b/i },
      { id: 'ip-17-plus',         regex: /\b17\s*(plus|pl|\+)\b/i },
      { id: 'ip-17e',             regex: /\b17\s*e\b/i },
      { id: 'ip-17',              regex: /\b(?:ip\s*)?17\b(?!\s*(prm|pm|pro|p|air|plus|pl|\+|e|củ|tr|triệu|m|gb|tb|%))/i },

      { id: 'ip-16-promax-1tb',   regex: /\b16\s*(prm|pm|pro\s*max|promax)\s*1\s*tb\b/i },
      { id: 'ip-16-promax-512gb', regex: /\b16\s*(prm|pm|pro\s*max|promax)\s*512\s*(gb|g)?\b/i },
      { id: 'ip-16-promax',       regex: /\b16\s*(prm|pm|pro\s*max|promax)\b/i },
      { id: 'ip-16-pro-512gb',    regex: /\b16\s*(pro|p)\s*512\s*(gb|g)?\b/i },
      { id: 'ip-16-pro',          regex: /\b16\s*(pro|p)\b(?!\s*max)/i },
      { id: 'ip-16-plus',         regex: /\b16\s*(plus|pl|\+)\b/i },
      { id: 'ip-16e',             regex: /\b16\s*e\b/i },
      { id: 'ip-16',              regex: /\b(?:ip\s*)?16\b(?!\s*(prm|pm|pro|p|plus|pl|\+|e|củ|tr|triệu|m|gb|tb|%))/i },

      { id: 'ip-15-promax-1tb',   regex: /\b15\s*(prm|pm|pro\s*max|promax)\s*1\s*tb\b/i },
      { id: 'ip-15-promax-512gb', regex: /\b15\s*(prm|pm|pro\s*max|promax)\s*512\s*(gb|g)?\b/i },
      { id: 'ip-15-promax',       regex: /\b15\s*(prm|pm|pro\s*max|promax)\b/i },
      { id: 'ip-15-pro',          regex: /\b15\s*(pro|p)\b(?!\s*max)/i },
      { id: 'ip-15-plus',         regex: /\b15\s*(plus|pl|\+)\b/i },
      { id: 'ip-15',              regex: /\b(?:ip\s*)?15\b(?!\s*(prm|pm|pro|p|plus|pl|\+|củ|tr|triệu|m|gb|tb|%))/i },

      { id: 'ip-14-promax-512gb', regex: /\b14\s*(prm|pm|pro\s*max|promax)\s*512\s*(gb|g)?\b/i },
      { id: 'ip-14-promax',       regex: /\b14\s*(prm|pm|pro\s*max|promax)\b/i },
      { id: 'ip-14-pro',          regex: /\b14\s*(pro|p)\b(?!\s*max)/i },
      { id: 'ip-14-plus',         regex: /\b14\s*(plus|pl|\+)\b/i },
      { id: 'ip-14',              regex: /\b(?:ip\s*)?14\b(?!\s*(prm|pm|pro|p|plus|pl|\+|củ|tr|triệu|m|gb|tb|%))/i },

      { id: 'ip-13-promax',       regex: /\b13\s*(prm|pm|pro\s*max|promax|pro)\b/i },
      { id: 'ip-13',              regex: /\b(?:ip\s*)?13\b(?!\s*(prm|pm|pro|củ|tr|triệu|m|gb|tb|%))/i },

      { id: 'ip-12-promax',       regex: /\b12\s*(prm|pm|pro\s*max|promax|pro)\b/i },
      { id: 'ip-12',              regex: /\b(?:ip\s*)?12\b(?!\s*(prm|pm|pro|củ|tr|triệu|m|gb|tb|%))/i },

      { id: 'ip-11-promax',       regex: /\b11\s*(prm|pm|pro\s*max|promax|pro)?\b(?!\s*(củ|tr|triệu|m|gb|tb|%))/i },

      { id: 'ip-xs-max',          regex: /\b(xsm|xs\s*max|xsmax|xs|ip\s*x)\b/i },
      { id: 'ip-8-plus',          regex: /\b(8p|8\s*plus|8plus|ip\s*8|7p|7\s*plus)\b/i },
      { id: 'ip-4s',              regex: /\b(4s|5s|6s|6sp|ip\s*4|ip\s*5|iphone\s*4|steve\s*jobs|sưu\s*tầm)\b/i }
    ];

    const matched: ProductDetail[] = [];
    // Bảo toàn thứ tự xuất hiện của dòng máy trong câu hỏi của khách hàng (rất quan trọng khi hỏi "thu cũ 14prm lên 18prm")
    const hitsWithPos: Array<{ product: ProductDetail; pos: number }> = [];

    for (const r of rules) {
      const m = r.regex.exec(q);
      if (m) {
        const found = catalog.find(p => p.id === r.id);
        if (found && !hitsWithPos.some(h => h.product.id === found.id)) {
          hitsWithPos.push({ product: found, pos: m.index });
        }
      }
    }

    hitsWithPos.sort((a, b) => a.pos - b.pos);
    for (const h of hitsWithPos) {
      matched.push(h.product);
    }
    return matched;
  }

  /**
   * Trả lời chuyên sâu chuẩn Database ZShop & ngôn ngữ GenZ chính xác theo từng câu hỏi cụ thể của khách hàng
   */
  static handleGenZiPhoneQuery(
    prompt: string,
    catalog: ProductDetail[] = MOCK_PRODUCTS_LIST,
    context?: CustomerContext,
    persona?: AIPersonaType
  ): AISkillResult | null {
    const { normalized, detectedAbbreviations } = this.normalizeGenZText(prompt);
    const query = prompt.toLowerCase();
    const normLower = normalized.toLowerCase();
    let matchedModels = this.resolveGenZPhoneModels(prompt, catalog);

    // Liên kết ngữ cảnh trang hiện tại: nếu khách hỏi "máy này", "con này", "em này", "mẫu đang xem" thì tự động lấy sản phẩm đang mở trên màn hình
    const isRefActiveProduct = /\b(máy này|con này|em này|mẫu này|cây này|chiếc này|đang xem|trên màn hình|trên ảnh)\b/i.test(normLower);
    if (matchedModels.length === 0 && context?.activeProduct && isRefActiveProduct) {
      matchedModels = [context.activeProduct];
    }

    const attachMeta = (res: AISkillResult): AISkillResult => {
      if (detectedAbbreviations.length > 0) {
        res.decodedGenZQuery = normalized;
        res.detectedAbbreviations = detectedAbbreviations;
      }
      return res;
    };

    // Nhận diện các nhóm câu hỏi chuyên biệt của khách hàng (Sub-Intents)
    const isAskBestSeller = /\b(bán chạy|ban chay|hot nhất|hot nhat|mua nhiều|nhiều người mua|phổ biến nhất|top bán chạy|best\s*seller|xu hướng|đáng mua nhất|nên mua máy nào|nên mua mẫu nào|mẫu nào ngon nhất|con nào ngon nhất|tư vấn mua máy)\b/i.test(normLower);
    const isAskSlowSellerOrSale = /\b(bán chậm|ban cham|ít người mua|tồn kho nhiều|xả kho|xa kho|giảm giá sâu|sale mạnh|deal hời|giảm nhiều nhất|khuyến mãi sâu)\b/i.test(normLower);
    const isAskCheapest = /\b(rẻ nhất|re nhat|thấp nhất|ít tiền nhất|giá mềm nhất|rẻ bèo)\b/i.test(normLower);
    const isAskCartStatus = /\b(giỏ hàng|gio hang|trong giỏ|tổng tiền giỏ|thanh toán giỏ|mấy món trong giỏ|kiểm tra giỏ)\b/i.test(normLower);
    const isAskOrderStatus = /\b(đơn hàng|don hang|đơn mua|ship tới đâu|bao giờ giao|kiểm tra đơn|theo dõi đơn|mã vận đơn)\b/i.test(normLower);
    const isAskVoucherPoints = /\b(điểm thưởng|bao nhiêu điểm|hạng thẻ|hạng vàng|voucher|mã giảm giá|code giảm|ưu đãi vip)\b/i.test(normLower);
    const isAskInstallment = /\b(trả góp|tra gop|góp|gop|\btg\b|đưa trước|dua truoc|trả trước|tra truoc|cccd|lãi suất|lai suat|mỗi tháng)\b/i.test(normLower);
    const isAskTradeIn = /\b(thu cũ|thu cu|lên đời|len doi|đổi mới|doi moi|trade\s*in|đổi bù|bù bao nhiêu|bù mấy|bù bn|bù nhiu|đổi từ)\b/i.test(normLower);
    const isAskStock = /\b(còn hàng|con hang|sẵn hàng|san hang|còn không|còn ko|còn máy|mấy máy|mấy cây|hết hàng|tồn kho|sẵn ko)\b/i.test(normLower);
    const isAskColor = /\b(màu|mau|color|mệnh|menh|phong thủy|hợp màu|mấy màu|những màu)\b/i.test(normLower);
    const isAskBatteryCharge = /\b(pin|sạc|sac|mah|trâu|chai pin|nóng máy|bao nhiêu w|mấy w|magsafe|củ sạc)\b/i.test(normLower);
    const isAskGamingSpecs = /\b(game|gaming|liên quân|pubg|genshin|fps|mượt|lag|giật|chip|ram|120hz|màn hình|cấu hình|thông số|spec)\b/i.test(normLower);
    const isAskCamera = /\b(cam|camera|chụp|chup|zoom|quay|tiktok|vlog|sống ảo|chân dung|ban đêm)\b/i.test(normLower);
    const isAskWarrantyOrigin = /\b(bảo hành|bao hanh|\bbh\b|1 đổi 1|zin|zin áp|likenew|99%|vn\/a|vna|quốc tế|qte|lock|chính hãng|check imei|nguồn gốc|uy tín)\b/i.test(normLower);
    const isAskShippingPayment = /\b(ship|giao hàng|vận chuyển|freeship|\bfs\b|cod|kiểm hàng|đồng kiểm|bóc seal|hỏa tốc|thanh toán|chuyển khoản|\bck\b|momo|vietqr)\b/i.test(normLower);
    const isAskPrice = /\b(giá|gia|bao nhiêu|bnhiu|mấy củ|mấy triệu|rổ giá|nhiu tiền|tiền|đắt|rẻ|128gb|256gb|512gb|1tb|2tb)\b/i.test(normLower);
    const isAskBuyCart = /\b(chốt đơn|chốt|múc|quất|lụm|hốt|thêm vào giỏ|bỏ giỏ|cho vào giỏ|mua con này|lấy con)\b/i.test(normLower);

    // Nếu khách hỏi trực tiếp về Giá / Màu / Pin / Trả góp / Tồn kho / Chốt đơn mà không gõ tên máy nhưng đang mở 1 trang sản phẩm -> tự động liên kết với sản phẩm đang xem!
    if (
      matchedModels.length === 0 &&
      context?.activeProduct &&
      !isAskBestSeller &&
      !isAskSlowSellerOrSale &&
      !isAskCheapest &&
      !isAskCartStatus &&
      !isAskOrderStatus &&
      !isAskVoucherPoints &&
      (isAskPrice || isAskColor || isAskBatteryCharge || isAskStock || isAskBuyCart)
    ) {
      matchedModels = [context.activeProduct];
    }

    // =========================================================================
    // A. XỬ LÝ THU CŨ ĐỔI MỚI / LÊN ĐỜI (TRADE-IN) — Kể cả khi nhắc 2 máy hoặc 1 máy
    // =========================================================================
    if (isAskTradeIn) {
      const oldPhone = matchedModels.length >= 2 ? matchedModels[0] : (matchedModels[0]?.price && matchedModels[0].price < 26000000 ? matchedModels[0] : catalog.find(p => p.id === 'ip-14-promax')!);
      const newPhone = matchedModels.length >= 2 ? matchedModels[1] : (matchedModels[0]?.price && matchedModels[0].price >= 26000000 ? matchedModels[0] : catalog[0]);

      const tradeInRate = 0.86; // Định giá thu vào tới 86% giá thị trường máy cũ
      const subsidy = 2500000;  // Trợ giá lên đời ZShop 2.5 triệu
      const oldEstimatedVal = Math.round((oldPhone.price * tradeInRate) / 100000) * 100000;
      const totalCredit = oldEstimatedVal + subsidy;
      const payDiff = Math.max(0, newPhone.price - totalCredit);
      const monthlyInstallment = Math.round(payDiff / 6);

      return attachMeta({
        skill: 'AI_VIP_LOYALTY',
        message: `🔄 **Bảng Định Giá Thu Cũ Lên Đời (Trade-In) Chuẩn GenZ Tại Thế Giới iPhone**:\n\n` +
          `📱 **Máy cũ thu vào**: **${oldPhone.name}**\n` +
          `   • 💰 Giá thu dự kiến (Loại A 99%): **${oldEstimatedVal.toLocaleString('vi-VN')}đ** *(~86% giá trị)*\n` +
          `   • 🎁 **Trợ giá lên đời độc quyền ZShop**: **+${subsidy.toLocaleString('vi-VN')}đ**\n` +
          `   • 👉 **Tổng ngân sách được trừ thẳng**: **${totalCredit.toLocaleString('vi-VN')}đ**\n\n` +
          `🚀 **Máy mới lên đời**: **${newPhone.name}** *(Giá ưu đãi: **${newPhone.price.toLocaleString('vi-VN')}đ**)*\n` +
          `🔥 **SỐ TIỀN BẠN CẦN BÙ THÊM**: Chỉ còn **${payDiff.toLocaleString('vi-VN')}đ**!\n` +
          `💡 *Mẹo GenZ*: Khoản bù **${payDiff.toLocaleString('vi-VN')}đ** này bạn có thể **góp 0% lãi suất** trong 6 tháng (chỉ **~${monthlyInstallment.toLocaleString('vi-VN')}đ/tháng**), mang máy mới về dùng ngay trong 15 phút không cần trả tiền mặt!`,
        products: [newPhone, oldPhone],
        suggestedActions: [
          `Thêm "${newPhone.name}" vào giỏ`,
          `Trả góp khoản bù ${payDiff.toLocaleString('vi-VN')}đ`,
          'Xem quy trình kiểm định máy cũ 15 phút'
        ]
      });
    }

    // =========================================================================
    // B. KHI KHÁCH HỎI ĐÍCH DANH 1 DÒNG IPHONE -> TRẢ LỜI CHÍNH XÁC CÂU HỎI ĐÓ
    // =========================================================================
    if (matchedModels.length === 1) {
      const phone = matchedModels[0];
      const fmtPrice = phone.price.toLocaleString('vi-VN') + 'đ';
      const fmtOrig = phone.originalPrice.toLocaleString('vi-VN') + 'đ';
      const savedVND = (phone.originalPrice - phone.price).toLocaleString('vi-VN') + 'đ';

      // B1. Khách hỏi Chốt đơn / Thêm vào giỏ
      if (isAskBuyCart) {
        return attachMeta({
          skill: 'QUICK_ADD_TO_CART',
          message: `🛒 **Chốt đơn liền tay cho dân chơi!**\nSiêu phẩm **${phone.name}** *(Màu độc bản: ${phone.colors[0]})* hiện còn **${phone.stock} máy** sẵn kho với giá ưu đãi chỉ **${fmtPrice}** (Tiết kiệm ngay **${savedVND}**).\n👉 Bấm ngay nút **"Thêm vào giỏ"** bên dưới thẻ sản phẩm để giữ suất giao hỏa tốc 2h kèm Freeship nhé!`,
          products: [phone],
          suggestedActions: [
            `Thêm "${phone.name}" vào giỏ`,
            'Áp mã giảm giá QUANTUM20',
            'Kiểm tra trả góp 0% cho máy này'
          ]
        });
      }

      // B2. Khách hỏi Trả góp (Installment) cho dòng máy này
      if (isAskInstallment) {
        const down10 = Math.round((phone.price * 0.1) / 10000) * 10000;
        const down20 = Math.round((phone.price * 0.2) / 10000) * 10000;
        const remain90 = phone.price - down10;
        const perMonth6 = Math.round(remain90 / 6);
        const perMonth12 = Math.round(remain90 / 12);

        return attachMeta({
          skill: 'PRODUCT_SEARCH_RECOMMEND',
          message: `💳 **Bảng Tính Trả Góp 0% Lãi Suất Cho ${phone.name}** *(Giá niêm yết: **${fmtPrice}**)*:\n\n` +
            `1️⃣ **Gói Sinh Viên / GenZ Nhẹ Ví (Trả trước 10%)**:\n` +
            `   • 💵 **Đưa trước nhận máy ngay**: **${down10.toLocaleString('vi-VN')}đ**\n` +
            `   • 📅 **Góp 6 tháng (0% lãi)**: **~${perMonth6.toLocaleString('vi-VN')}đ / tháng**\n` +
            `   • 📅 **Góp 12 tháng**: **~${perMonth12.toLocaleString('vi-VN')}đ / tháng**\n\n` +
            `2️⃣ **Gói Duyệt Siêu Tốc 3 Phút (Trả trước 20% = ${down20.toLocaleString('vi-VN')}đ)**:\n` +
            `   • ✅ **Thủ tục**: Chỉ cần duy nhất **CCCD gắn chip** (hoặc định danh VNeID mức 2), **KHÔNG** gọi thẩm định người thân, **bao đậu 99%** cho cả HSSV đủ 18 tuổi!\n` +
            `   • 💳 Hỗ trợ quẹt thẻ tín dụng 25 ngân hàng chuyển đổi trả góp 0% từ xa qua link thanh toán SZ-Gateway.`,
          products: [phone],
          suggestedActions: [
            `Thêm "${phone.name}" vào giỏ`,
            `Thu cũ lên đời ${phone.name.split(' ')[1]} Pro Max`,
            'Tư vấn trả góp qua thẻ tín dụng 0%'
          ]
        });
      }

      // B3. Khách hỏi Tồn kho / Còn hàng không
      if (isAskStock) {
        const inStock = phone.stock > 0;
        return attachMeta({
          skill: 'STOCK_INQUIRY',
          message: `📦 **Kiểm Tra Tồn Kho Thời Gian Thực — ${phone.name}**:\n\n` +
            `• ✅ **Trạng thái kho**: **${inStock ? `ĐANG SẴN HÀNG (${phone.stock} máy tại Showroom)` : 'Tạm cháy hàng'}**\n` +
            `• 🎨 **Các màu sẵn giao ngay**: **${phone.colors.join(' • ')}**\n` +
            `• 💾 **Dung lượng sẵn có**: **${phone.sizes.join(' / ')}**\n` +
            `• 📍 **Vị trí**: Showroom Thế Giới iPhone — 12 Lê Lợi, Q.1, TP.HCM *(Giao hỏa tốc 2h nội thành hoặc Ship COD đồng kiểm toàn quốc)*!`,
          stockInquiry: {
            productName: phone.name,
            stock: phone.stock,
            inStock,
            category: phone.category,
            statusText: `Sẵn ${phone.stock} máy nguyên bản tại kho`,
            suggestedActionText: 'Giữ máy & Giao hỏa tốc 2h'
          },
          products: [phone],
          suggestedActions: [
            `Thêm "${phone.name}" vào giỏ`,
            'Giữ máy tại Showroom 12 Lê Lợi',
            `Xem giá trả góp ${phone.name.split(' ')[1]} Series`
          ]
        });
      }

      // B4. Khách hỏi Màu sắc / Phong thủy
      if (isAskColor) {
        return attachMeta({
          skill: 'PRODUCT_SEARCH_RECOMMEND',
          message: `🎨 **Bảng Màu Độc Bản & Tư Vấn Phong Thủy Cho ${phone.name}**:\n\n` +
            `✨ **Màu Signature Hot Nhất Năm Nay**: **${phone.colors[0]}** *(Màu độc quyền bán chạy số 1 tại ZShop)*\n` +
            `🌈 **Trọn bộ tùy chọn màu sắc**: **${phone.colors.join(' | ')}**\n\n` +
            `🔮 **Gợi ý chọn màu chuẩn Vibe & Hợp Mệnh GenZ**:\n` +
            `• 🔥 **Mệnh Hỏa & Thổ**: Chọn ngay **${phone.colors[0]}** hoặc tông Vàng Sa Mạc / Đỏ Burgundy / Hồng để hút tài lộc.\n` +
            `• 💧 **Mệnh Kim & Thủy**: Chọn tông **Trắng Titan / Bạc Silver / Xanh** thanh lịch, sang chảnh.\n` +
            `• 🌿 **Mệnh Mộc**: Chọn tông **Xanh Lục Bảo / Đen Titan / Xanh Rừng Thông** cực kỳ hợp vía!`,
          products: [phone],
          suggestedActions: [
            `Thêm "${phone.name}" vào giỏ`,
            `Kiểm tra tồn kho màu ${phone.colors[0]}`,
            'Xem ốp lưng MagSafe trong suốt khoe màu máy'
          ]
        });
      }

      // B5. Khách hỏi Pin & Sạc
      if (isAskBatteryCharge) {
        const isTypeC = ['ip-18', 'ip-17', 'ip-16', 'ip-15'].some(prefix => phone.id.startsWith(prefix));
        const chargePort = isTypeC ? 'USB-C chuẩn Power Delivery (27W - 45W) & Sạc từ tính MagSafe 25W' : 'Lightning chuẩn PD 20W & Sạc không dây MagSafe 15W';
        const onscreenHours = phone.id.includes('promax') || phone.id.includes('plus') ? '10 - 12 tiếng onscreen liên tục (dùng thoải mái sang ngày thứ 2)' : '8 - 9.5 tiếng onscreen liên tục cả ngày dài';

        return attachMeta({
          skill: 'AI_SMART_FITTING',
          message: `🔋 **Đánh Giá Chi Tiết Pin & Công Nghệ Sạc Của ${phone.name}**:\n\n` +
            `• ⏱️ **Thời lượng sử dụng thực tế**: Đạt **${onscreenHours}** (Lướt TikTok, chụp ảnh, chiến Liên Quân/PUBG không lo tụt áp).\n` +
            `• ⚡ **Chuẩn sạc nhanh hỗ trợ**: **${chargePort}** — Sạc từ 0% lên 50% chỉ trong **25 phút**.\n` +
            `• 🛡️ **Cam kết chất lượng Pin tại ZShop**: ${phone.name.includes('VN/A') ? 'Máy mới Chính Hãng VN/A **Pin 100% (0 lần sạc)**' : 'Máy tuyển chọn Zin Áp **dung lượng Pin từ 92% - 100%**'}, tặng kèm gói bảo hành Pin 12 tháng!`,
          products: [phone],
          suggestedActions: [
            `Thêm "${phone.name}" vào giỏ`,
            'Mua kèm Củ sạc Apple 20W/35W giảm 20%',
            `So sánh pin ${phone.name.split(' ')[1]} với đời trước`
          ]
        });
      }

      // B6. Khách hỏi Chiến Game / Cấu hình / Camera
      if (isAskGamingSpecs || isAskCamera) {
        return attachMeta({
          skill: 'AI_SMART_FITTING',
          message: `🚀 **Phân Tích Hiệu Năng Chiến Game & Camera Của ${phone.name}**:\n\n` +
            `• 🧠 **Vi xử lý & Đa nhiệm**: ${phone.description}\n` +
            `• 🎮 **Trải nghiệm Gaming thực tế**: Chiến mượt max setting **Liên Quân Mobile, PUBG Mobile, Tốc Chiến, Genshin Impact** ổn định ở mức FPS kịch khung, tản nhiệt tối ưu không bị drop khung hình.\n` +
            `• 📸 **Sức mạnh Nhiếp ảnh & Quay TikTok**: Chống rung quang học OIS thế hệ mới, quay video 4K 60/120fps sắc nét từng sợi tóc, màu da lên tươi tắn đăng thẳng Story không cần chỉnh app!\n` +
            `• 💰 **Giá chốt kèo hôm nay**: **${fmtPrice}** *(Giảm ${phone.discountRate}% so với giá gốc ${fmtOrig})*.`,
          products: [phone],
          suggestedActions: [
            `Thêm "${phone.name}" vào giỏ`,
            `So sánh ${phone.name.split(' ')[1]} với đời khác`,
            'Xem bảng trả góp 0% lãi suất'
          ]
        });
      }

      // B7. Khách hỏi Bảo hành / Chính hãng / Zin áp
      if (isAskWarrantyOrigin) {
        return attachMeta({
          skill: 'TRACK_ORDER',
          message: `🛡️ **Cam Kết Nguồn Gốc & Chính Sách Bảo Hành Cho ${phone.name}**:\n\n` +
            `• ✅ **Tình trạng máy**: **${phone.name.includes('VN/A') ? 'Chính hãng Apple Việt Nam (Mã VN/A) — Nguyên seal hộp chưa Active, đủ 12 tháng bảo hành chính hãng toàn quốc' : 'Tuyển chọn Likenew 99% Nguyên Zin Áp Suất 100% — Cam kết main zin, màn zin chưa từng bung mở'}**.\n` +
            `• 🔄 **Đặc quyền 1 ĐỔI 1 trong 30 ngày**: Đổi ngay máy mới tương đương nếu phát sinh bất kỳ lỗi phần cứng nào từ nhà sản xuất.\n` +
            `• 💎 **Cam kết Vàng ZShop**: Hoàn tiền & đền bù **200% giá trị máy (${(phone.price * 2).toLocaleString('vi-VN')}đ)** nếu phát hiện hàng giả, hàng dựng hoặc màn lô!`,
          products: [phone],
          suggestedActions: [
            `Thêm "${phone.name}" vào giỏ`,
            'Hướng dẫn check IMEI Apple chính hãng',
            'Đặt giao hàng đồng kiểm tận nơi'
          ]
        });
      }

      // B8. Khách hỏi Giá / Dung lượng hoặc hỏi thông tin tổng quan của dòng máy đó
      const pBase = phone.price;
      const storagePricing = phone.sizes.map((sz, i) => {
        const extra = i * 3000000;
        return `**${sz}**: ${(pBase + extra).toLocaleString('vi-VN')}đ`;
      }).join(' | ');

      return attachMeta({
        skill: 'PRODUCT_SEARCH_RECOMMEND',
        message: `🔥 **Báo Giá & Thông Số Chuẩn Xác Từ Database ZShop — ${phone.name}**:\n\n` +
          `• 💰 **Giá ưu đãi hôm nay**: **${fmtPrice}** *(Giá gốc: ~${fmtOrig}~ — **Tiết kiệm ngay ${savedVND} / -${phone.discountRate}%**)*\n` +
          `• 💾 **Bảng giá theo dung lượng**: ${storagePricing}\n` +
          `• 💳 **Hỗ trợ trả góp 0%**: Đưa trước chỉ từ **${(Math.round(pBase * 0.1 / 10000) * 10000).toLocaleString('vi-VN')}đ** nhận máy ngay (Duyệt CCCD 5 phút).\n` +
          `• 🎨 **Màu sắc sẵn kho (${phone.stock} máy)**: **${phone.colors[0]}** *(cùng ${phone.colors.slice(1).join(', ')})*\n` +
          `• ⚙️ **Điểm ăn tiền nhất**: ${phone.description}`,
        products: [phone],
        suggestedActions: [
          `Thêm "${phone.name}" vào giỏ`,
          `Tính trả góp 0% cho ${phone.name.split(' ')[1]}`,
          `Thu cũ lên đời ${phone.name.split(' ')[1]} bù bao nhiêu?`
        ]
      });
    }

    // =========================================================================
    // C. KHI KHÁCH SO SÁNH >= 2 DÒNG IPHONE (VD: "so sánh 18prm với 17prm", "16prm hay 15prm ngon hơn")
    // =========================================================================
    if (matchedModels.length >= 2) {
      const [p1, p2] = matchedModels;
      const diffPrice = Math.abs(p1.price - p2.price).toLocaleString('vi-VN');
      const higher = p1.price >= p2.price ? p1 : p2;
      const lowerP = p1.price < p2.price ? p1 : p2;

      return attachMeta({
        skill: 'PRODUCT_SEARCH_RECOMMEND',
        message: `⚡ **Đặt Lên Bàn Cân So Sánh Trực Tiếp: ${p1.name} vs ${p2.name}**\n\n` +
          `1️⃣ **${p1.name}** — Giá: **${p1.price.toLocaleString('vi-VN')}đ** *(Sẵn ${p1.stock} máy)*\n` +
          `   • 🎨 Màu đặc trưng: **${p1.colors[0]}** | Bộ nhớ: ${p1.sizes.join('/')}\n` +
          `   • 💡 *Sức mạnh*: ${p1.description}\n\n` +
          `2️⃣ **${p2.name}** — Giá: **${p2.price.toLocaleString('vi-VN')}đ** *(Sẵn ${p2.stock} máy)*\n` +
          `   • 🎨 Màu đặc trưng: **${p2.colors[0]}** | Bộ nhớ: ${p2.sizes.join('/')}\n` +
          `   • 💡 *Sức mạnh*: ${p2.description}\n\n` +
          `🎯 **Gợi ý Chốt Kèo Chuẩn GenZ**:\n` +
          `• Mức chênh lệch giữa 2 máy là **${diffPrice}đ**.\n` +
          `• Chọn **${higher.name}** nếu bạn muốn trải nghiệm chip đời cao hơn, camera zoom xa hơn và giữ giá tốt nhất.\n` +
          `• Chọn **${lowerP.name}** nếu bạn muốn tiết kiệm ngay **${diffPrice}đ** (đủ mua thêm tai nghe AirPods + sạc nhanh 20W) mà hiệu năng vẫn mượt 9/10!`,
        products: matchedModels.slice(0, 3),
        suggestedActions: [
          `Thêm "${p1.name}" vào giỏ`,
          `Thêm "${p2.name}" vào giỏ`,
          `Thu cũ từ ${lowerP.name.split(' ')[1]} lên ${higher.name.split(' ')[1]}`
        ]
      });
    }

    // =========================================================================
    // D. CÁC CÂU HỎI NGHIỆP VỤ CHUNG KHÔNG NÊU TÊN MÁY CỤ THỂ (TRẢ GÓP, BẢO HÀNH, SHIP, VOUCHER, NGÂN SÁCH, NHU CẦU)
    // =========================================================================
    // D1. Hỏi về Trả góp chung
    if (isAskInstallment) {
      return attachMeta({
        skill: 'AI_VIP_LOYALTY',
        message: `💳 **Chính Sách Mua iPhone Trả Góp 0% Siêu Tốc Tại Thế Giới iPhone**:\n\n` +
          `• 💵 **Trả trước cực thấp**: Chỉ từ **10% - 20% giá trị máy** (Ví dụ: Mua iPhone 15 chỉ cần đưa trước **~1.590.000đ**, mua iPhone 16 Pro Max đưa trước **~2.890.000đ**).\n` +
          `• 🪪 **Duyệt bằng CCCD gắn chip trong 5 phút**: Hỗ trợ công dân Việt Nam từ đủ **18 tuổi** (Bao đậu 99% cho **Học sinh - Sinh viên**, không gọi điện thẩm định bố mẹ).\n` +
          `• 🏦 **Trả góp 0% lãi suất qua Thẻ Tín Dụng**: Hỗ trợ liên kết 25 ngân hàng (Vietcombank, Techcombank, VPBank, MB, ACB, Sacombank...) kỳ hạn 3 - 6 - 9 - 12 tháng.\n` +
          `👉 *Bạn đang nhắm mẫu iPhone nào? Gõ tên máy (vd: **"16prm trả góp"**) để mình tính số tiền góp mỗi tháng chính xác từng đồng cho bạn nhé!*`,
        products: catalog.slice(0, 3),
        suggestedActions: [
          '18prm trả góp đưa trc bnhiu?',
          '16prm trả góp mỗi tháng mấy củ?',
          '15prm trả góp cho HSSV'
        ]
      });
    }

    // D2. Hỏi về Ship / COD / Thanh toán chung
    if (isAskShippingPayment) {
      return attachMeta({
        skill: 'TRACK_ORDER',
        message: `🚚 **Chính Sách Giao Hàng Hỏa Tốc & Đồng Kiểm Ship COD Tại ZShop**:\n\n` +
          `• ⚡ **Giao Hỏa Tốc 2 Giờ**: Nhận máy tận tay chỉ sau **60 - 120 phút** tại khu vực nội thành TP.HCM & Hà Nội (Có kỹ thuật viên hỗ trợ chép dữ liệu sang máy mới tại chỗ!).\n` +
          `• 🎁 **Miễn Phí Vận Chuyển (FreeShip 100%)**: Áp dụng cho **tất cả đơn hàng iPhone** trên toàn quốc.\n` +
          `• 📦 **Đặc quyền Ship COD Đồng Kiểm**: Bạn hoàn toàn **ĐƯỢC mở hộp kiểm tra ngoại quan, đối chiếu số Serial/IMEI trên trang chủ Apple** rồi mới thanh toán tiền cho Shipper!\n` +
          `• 💳 **Thanh toán đa kênh**: Hỗ trợ quét VietQR Napas 247, Ví MoMo, Thẻ ATM/Visa hoặc tiền mặt COD.`,
        suggestedActions: [
          'Tra cứu đơn hàng gần nhất',
          'Chính sách lỗi 1 đổi 1 trong 30 ngày',
          'Tìm cho tôi ip 16prm'
        ]
      });
    }

    // D3. Hỏi về Bảo hành / Hàng chính hãng VN/A / Zin áp chung
    if (isAskWarrantyOrigin) {
      return attachMeta({
        skill: 'TRACK_ORDER',
        message: `🛡️ **Chính Sách Bảo Hành AppleCare+ & Cam Kết Chất Lượng ZShop**:\n\n` +
          `• 🍏 **Máy Mới Chính Hãng VN/A**: Nguyên seal hộp Apple Việt Nam chưa kích hoạt, bảo hành chính hãng **12 tháng** tại Apple ủy quyền toàn quốc.\n` +
          `• 💎 **Máy Likenew 99% Tuyển Chọn**: Đạt chuẩn **Zin Áp Suất 100%** (Main zin, màn zin nguyên bản, Pin 90% - 100%), đã qua 32 bước kiểm định khắt khe.\n` +
          `• 🔄 **Lỗi 1 Đổi 1 Trong 30 Ngày Đầu**: Nếu máy có lỗi phần cứng từ nhà sản xuất, đổi ngay máy khác tương đương trong 15 phút, không chờ sửa chữa!\n` +
          `• 💰 **Cam kết đền 200%**: Phát hiện hàng dựng, màn linh kiện hay máy lock câu sim — ZShop hoàn tiền gấp đôi ngay lập tức.`,
        suggestedActions: [
          'Tìm iPhone chính hãng VN/A mới 100%',
          'Tìm iPhone Likenew 99% giá mềm',
          'Kiểm tra bảo hành theo IMEI'
        ]
      });
    }

    // D4. Hỏi theo Ngân sách GenZ (vd: "dưới 15 củ", "tầm 20 củ", "10-15tr mua máy nào")
    const { minPrice, maxPrice } = this.extractPriceRange(normLower);
    if (minPrice > 0 || maxPrice < Infinity) {
      const budgetList = catalog.filter(p => p.price >= minPrice && p.price <= maxPrice);
      const finalBudget = budgetList.length > 0
        ? budgetList.sort((a, b) => b.price - a.price).slice(0, 4)
        : [...catalog].sort((a, b) => Math.abs(a.price - (maxPrice < Infinity ? maxPrice : minPrice)) - Math.abs(b.price - (maxPrice < Infinity ? maxPrice : minPrice))).slice(0, 4);

      const rangeDesc = maxPrice < Infinity && minPrice > 0
        ? `từ **${(minPrice / 1000000).toFixed(0)} - ${(maxPrice / 1000000).toFixed(0)} củ**`
        : maxPrice < Infinity
        ? `**dưới ${(maxPrice / 1000000).toFixed(1).replace('.0', '')} củ**`
        : `**trên ${(minPrice / 1000000).toFixed(1).replace('.0', '')} củ**`;

      return attachMeta({
        skill: 'PRODUCT_SEARCH_RECOMMEND',
        message: `💰 **Top ${finalBudget.length} Mẫu iPhone Đáng Mua Nhất Tầm Giá ${rangeDesc} Tại Thế Giới iPhone**:\n\n` +
          finalBudget.map((p, idx) =>
            `${idx + 1}. **${p.name}** *(Màu: ${p.colors[0]})*\n   • 💵 Giá ưu đãi: **${p.price.toLocaleString('vi-VN')}đ** *(Giảm ${p.discountRate}% | Sẵn ${p.stock} máy)*\n   • ⭐ Điểm mạnh: ${p.description.slice(0, 115)}...`
          ).join('\n\n') +
          `\n\n🎯 **Lời khuyên từ AI**: Trong tầm giá này, **${finalBudget[0].name}** là lựa chọn "ngon - bổ - giữ giá" đỉnh nhất hiện tại!`,
        products: finalBudget,
        suggestedActions: [
          `Thêm "${finalBudget[0].name}" vào giỏ`,
          `So sánh ${finalBudget[0]?.name.split(' ')[1] || '16prm'} và ${finalBudget[1]?.name.split(' ')[1] || '15prm'}`,
          'Tính trả góp 0% cho tầm giá này'
        ]
      });
    }

    // D5. Hỏi theo Nhu cầu sử dụng GenZ (Chiến game / Chụp ảnh sống ảo / Pin trâu / HSSV giá hạt dẻ / Máy mới nhất)
    if (isAskGamingSpecs) {
      const gamingPhones = catalog.filter(p => ['ip-18-promax', 'ip-17-promax', 'ip-16-promax', 'ip-15-promax'].includes(p.id));
      return attachMeta({
        skill: 'PRODUCT_SEARCH_RECOMMEND',
        message: `🎮 **Top 4 "Quái Vật Chiến Game" Màn Hình ProMotion 120Hz & Tản Nhiệt Đỉnh Nhất**:\n\n` +
          gamingPhones.map((p, i) => `${i + 1}. **${p.name}** — **${p.price.toLocaleString('vi-VN')}đ** *(Chip siêu mạnh + Màn 120Hz mượt không độ trễ)*`).join('\n') +
          `\n\n💡 Tất cả các mẫu Pro Max trên đều hỗ trợ tần số quét **120Hz ProMotion** và GPU Ray Tracing phần cứng, bao chiến max setting Genshin Impact, PUBG & Liên Quân!`,
        products: gamingPhones,
        suggestedActions: ['So sánh 18prm với 16prm', '16prm giá bn sốp?', '15prm trả góp đưa trc bnhiu?']
      });
    }

    if (isAskCamera) {
      const camPhones = catalog.filter(p => ['ip-18-promax', 'ip-17-promax', 'ip-16-pro', 'ip-14-promax'].includes(p.id));
      return attachMeta({
        skill: 'PRODUCT_SEARCH_RECOMMEND',
        message: `📸 **Top 4 Siêu Phẩm iPhone Chụp Ảnh "Sống Ảo" & Quay TikTok 4K Đỉnh Nóc Kịch Trần**:\n\n` +
          camPhones.map((p, i) => `${i + 1}. **${p.name}** *(Màu: ${p.colors[0]})* — **${p.price.toLocaleString('vi-VN')}đ**`).join('\n') +
          `\n\n✨ Trang bị cảm biến chính **48MP ProRAW**, ống kính Telephoto xóa phông mịt mù và quay **4K Dolby Vision** giúp mọi khung hình đều lung linh như studio!`,
        products: camPhones,
        suggestedActions: ['18prm chụp đêm nét ko?', 'So sánh camera 18prm và 16prm', 'Tìm iPhone màu Hồng / Tím xinh nhất']
      });
    }

    if (/\b(học sinh|sinh viên|hssv|giá rẻ|hạt dẻ|máy phụ|tiết kiệm|ngon bổ rẻ)\b/i.test(normLower)) {
      const studentPhones = catalog.filter(p => ['ip-13', 'ip-12-promax', 'ip-12', 'ip-11-promax', 'ip-xs-max', 'ip-8-plus'].includes(p.id)).slice(0, 4);
      return attachMeta({
        skill: 'PRODUCT_SEARCH_RECOMMEND',
        message: `🎒 **Top 4 Mẫu iPhone "Ngon - Bổ - Hạt Dẻ" Chân Ái Cho Học Sinh - Sinh Viên**:\n\n` +
          studentPhones.map((p, i) => `${i + 1}. **${p.name}** — Chỉ **${p.price.toLocaleString('vi-VN')}đ** *(Trả trước từ ${(Math.round(p.price * 0.1 / 10000) * 10000).toLocaleString('vi-VN')}đ)*`).join('\n') +
          `\n\n🎁 **Ưu đãi HSSV**: Giảm thêm **300.000đ** + Tặng kèm Củ sạc nhanh 20W + Ốp lưng + Dán cường lực miễn phí!`,
        products: studentPhones,
        suggestedActions: ['iPhone 13 giá bn sốp?', '12prm còn hàng ko?', 'HSSV mua trả góp cần gì?']
      });
    }

    // D5.1. Khách hỏi MẪU NÀO BÁN CHẠY NHẤT / HOT NHẤT / ĐÁNG MUA NHẤT (Liên kết trực tiếp doanh số soldCount + Sản phẩm đang xem + Giỏ hàng)
    if (isAskBestSeller) {
      const sortedBySold = [...catalog]
        .filter(p => p.name.toLowerCase().includes('iphone'))
        .sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
      const topBestSellers = sortedBySold.slice(0, 4);
      const activeProd = context?.activeProduct;
      const activeRank = activeProd ? sortedBySold.findIndex(p => p.id === activeProd.id) + 1 : 0;
      const customerName = context?.customerProfile?.name || context?.currentUser?.name;
      const greet = customerName ? `Dạ chào **${customerName}**! ` : 'Dạ ';

      const activeNote = activeProd
        ? `\n\n📌 **Liên kết mẫu bạn đang xem trên màn hình (${activeProd.name})**:\n• Hiện đứng **Top #${activeRank > 0 ? activeRank : 2} Bán Chạy Nhất** toàn hệ thống với **${(activeProd.soldCount || 3400).toLocaleString('vi-VN')} máy đã bán**, đánh giá **${activeProd.rating || 4.9}⭐**, giá ưu đãi chỉ **${activeProd.price.toLocaleString('vi-VN')}đ** *(Giảm ${activeProd.discountRate}%)*!`
        : '';

      const cartNote = context?.cartItems && context.cartItems.length > 0
        ? `\n• 🛒 **Giỏ hàng của bạn**: Đang có **${context.cartItems.length} sản phẩm** chờ thanh toán — bạn có thể áp mã **VIPGOLD10** hoặc **FREESHIPMAX** để giảm thêm ngay!`
        : '';

      return attachMeta({
        skill: 'PRODUCT_SEARCH_RECOMMEND',
        message: `🏆 **${greet}Top 4 Mẫu iPhone Bán Chạy Nhất Tại Thế Giới iPhone (Cập Nhật Theo Doanh Số Thực Tế)**:\n\n` +
          topBestSellers.map((p, idx) => {
            const medal = idx === 0 ? '🥇 **QUÁN QUÂN #1**' : idx === 1 ? '🥈 **Á QUÂN #2**' : idx === 2 ? '🥉 **TOP #3**' : '🔥 **TOP #4**';
            return `${medal}: **${p.name}**\n   • 📈 Đã bán: **${(p.soldCount || 1500).toLocaleString('vi-VN')} máy** (${p.rating || 4.9}⭐) | Kho sẵn: **${p.stock} máy**\n   • 💰 Giá chốt hôm nay: **${p.price.toLocaleString('vi-VN')}đ** *(Màu Hot: ${p.colors[0]})*`;
          }).join('\n\n') +
          activeNote +
          cartNote +
          `\n\n💡 **Nhận định chuyên gia**: **${topBestSellers[0].name}** đang giữ ngôi vương doanh số nhờ mức giá giảm sâu kỷ lục và hiệu năng bền bỉ 5 năm không lỗi thời!`,
        products: topBestSellers,
        suggestedActions: [
          activeProd ? `Thêm "${activeProd.name}" vào giỏ` : `Thêm "${topBestSellers[0].name}" vào giỏ`,
          `So sánh ${topBestSellers[0].name.split(' ')[1]} với ${topBestSellers[1].name.split(' ')[1]}`,
          `Tính trả góp 0% cho ${topBestSellers[0].name.split(' ')[1]}`
        ]
      });
    }

    // D5.2. Khách hỏi MẪU NÀO BÁN CHẬM NHẤT / XẢ KHO / GIẢM GIÁ SÂU NHẤT
    if (isAskSlowSellerOrSale) {
      const isSlowQuery = /\b(bán chậm|ban cham|ít người mua|tồn kho nhiều)\b/i.test(normLower);
      const sortedList = [...catalog]
        .filter(p => p.name.toLowerCase().includes('iphone'))
        .sort((a, b) => isSlowQuery ? (a.soldCount || 0) - (b.soldCount || 0) : (b.discountRate || 0) - (a.discountRate || 0))
        .slice(0, 4);

      return attachMeta({
        skill: 'PRODUCT_SEARCH_RECOMMEND',
        message: isSlowQuery
          ? `📊 **Thống Kê Top 4 Mẫu iPhone Kén Khách / Bán Chậm Đang Được Trợ Giá Xả Kho Mạnh Nhất**:\n\n` +
            sortedList.map((p, idx) =>
              `${idx + 1}. **${p.name}** *(Màu: ${p.colors[0]})*\n   • 📦 Lượng bán: **${p.soldCount || 85} máy** | Tồn kho: **${p.stock} máy**\n   • 🏷️ Giá xả kho: **${p.price.toLocaleString('vi-VN')}đ** *(Giảm tới **-${p.discountRate}%** so với giá gốc ${p.originalPrice.toLocaleString('vi-VN')}đ)*`
            ).join('\n\n') +
            `\n\n💡 **Cơ hội săn Deal**: Các dòng dung lượng cao (512GB/1TB) hoặc bản sưu tầm thường kén người mua hơn bản tiêu chuẩn nên đang được ZShop **trợ giá xả kho cực hời**!`
          : `🏷️ **Top 4 Siêu Phẩm iPhone Đang Giảm Giá Sâu Nhất (Flash Sale Xả Kho Hôm Nay)**:\n\n` +
            sortedList.map((p, idx) =>
              `${idx + 1}. **${p.name}** — Giảm **-${p.discountRate}%** chỉ còn **${p.price.toLocaleString('vi-VN')}đ** *(Tiết kiệm ${(p.originalPrice - p.price).toLocaleString('vi-VN')}đ)*`
            ).join('\n\n'),
        products: sortedList,
        suggestedActions: [
          `Thêm "${sortedList[0].name}" vào giỏ`,
          'Mẫu nào bán chạy nhất hiện nay?',
          'Áp thêm voucher VIPGOLD10 giảm 10%'
        ]
      });
    }

    // D5.3. Khách hỏi MẪU NÀO RẺ NHẤT
    if (isAskCheapest) {
      const cheapestList = [...catalog]
        .filter(p => p.name.toLowerCase().includes('iphone'))
        .sort((a, b) => a.price - b.price)
        .slice(0, 4);

      return attachMeta({
        skill: 'PRODUCT_SEARCH_RECOMMEND',
        message: `💸 **Top 4 Mẫu iPhone Chính Hãng & Sưu Tầm Giá Rẻ Nhất Tại Thế Giới iPhone**:\n\n` +
          cheapestList.map((p, idx) =>
            `${idx + 1}. **${p.name}** — Giá chỉ **${p.price.toLocaleString('vi-VN')}đ** *(Sẵn ${p.stock} máy | Đánh giá ${p.rating}⭐)*`
          ).join('\n') +
          `\n\n✨ Tất cả đều cam kết **Nguyên Zin 100%**, bảo hành **1 đổi 1 trong 30 ngày** và miễn phí giao hàng toàn quốc!`,
        products: cheapestList,
        suggestedActions: [
          `Thêm "${cheapestList[0].name}" vào giỏ`,
          'Tư vấn iPhone dưới 10 củ',
          'Mẫu nào bán chạy nhất?'
        ]
      });
    }

    // D5.4. Khách hỏi về GIỎ HÀNG HIỆN TẠI CỦA TÔI (Liên kết trực tiếp với MiniCart & Chọn mua từng món)
    if (isAskCartStatus) {
      const cart = context?.cartItems || [];
      if (cart.length === 0) {
        const recommended = context?.activeProduct ? [context.activeProduct, ...catalog.slice(0, 2)] : catalog.slice(0, 3);
        return attachMeta({
          skill: 'QUICK_ADD_TO_CART',
          message: `🛒 **Giỏ hàng của bạn hiện đang trống!**\n` +
            (context?.activeProduct
              ? `Bạn đang xem **${context.activeProduct.name}** (*${context.activeProduct.price.toLocaleString('vi-VN')}đ*). Bạn có muốn thêm ngay mẫu này vào giỏ hàng để giữ ưu đãi không?`
              : `Hãy chọn ngay một mẫu iPhone bên dưới để thêm vào giỏ hàng nhé!`),
          products: recommended.slice(0, 3),
          suggestedActions: [
            context?.activeProduct ? `Thêm "${context.activeProduct.name}" vào giỏ` : 'Mẫu nào bán chạy nhất?',
            'Xem mã giảm giá khả dụng'
          ]
        });
      }

      const selectedInCart = cart.filter(c => c.selected !== false);
      const unselectedCount = cart.length - selectedInCart.length;
      const totalSelectedVND = selectedInCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

      return attachMeta({
        skill: 'QUICK_ADD_TO_CART',
        message: `🛒 **Chi Tiết Giỏ Hàng Thời Gian Thực Của ${context?.customerProfile?.name || 'Bạn'} (${cart.length} dòng sản phẩm)**:\n\n` +
          cart.map((c, i) =>
            `${i + 1}. ${c.selected !== false ? '☑️ **[Đang chọn mua]**' : '⬜ *[Giữ lại mua sau]*'} **${c.name}** (${c.size}${c.color ? ` - ${c.color}` : ''}) x${c.quantity} — **${(c.price * c.quantity).toLocaleString('vi-VN')}đ**`
          ).join('\n') +
          `\n\n💰 **Tổng thanh toán (${selectedInCart.length} món đã chọn)**: **${totalSelectedVND.toLocaleString('vi-VN')}đ**` +
          (unselectedCount > 0 ? ` *(Còn ${unselectedCount} món chưa chọn sẽ được giữ nguyên trong giỏ)*` : '') +
          `\n🎁 **Gợi ý tối ưu**: Bạn đang có **${context?.customerProfile?.points || 450} điểm thưởng (${context?.customerProfile?.tier || 'Hạng Vàng'})**, đừng quên tích chọn món muốn mua trong giỏ hàng và áp mã **VIPGOLD10** nhé!`,
        suggestedActions: [
          'Đi đến giỏ hàng & Thanh toán',
          'Xem mã giảm giá VIPGOLD10',
          'Mẫu nào bán chạy nhất?'
        ]
      });
    }

    // D5.5. Khách hỏi về ĐƠN HÀNG / VẬN CHUYỂN ngay trong tab bất kỳ
    if (isAskOrderStatus) {
      const orders = context?.customerOrders || [];
      if (orders.length > 0) {
        const latest = orders[0];
        const orderTotal = latest.items.reduce((s, it) => s + it.price * it.quantity, 0) + (latest.shippingFee || 0);
        return attachMeta({
          skill: 'TRACK_ORDER',
          message: `📦 **Tra Cứu Nhanh Đơn Hàng Của ${context?.customerProfile?.name || 'Bạn'}**:\n\n` +
            `• **Mã vận đơn**: **${latest.id}**\n` +
            `• **Trạng thái**: 🚚 **Đang vận chuyển hỏa tốc (Dự kiến giao hôm nay)**\n` +
            `• **Sản phẩm**: ${latest.items.map(it => `${it.name} (x${it.quantity})`).join(', ')}\n` +
            `• **Tổng thanh toán**: **${orderTotal.toLocaleString('vi-VN')}đ**`,
          suggestedActions: ['Xem chi tiết hóa đơn', 'Chính sách lỗi 1 đổi 1 trong 30 ngày', 'Mẫu nào bán chạy nhất?']
        });
      }
    }

    // D5.6. Khách hỏi về ĐIỂM THƯỞNG VIP / MÃ GIẢM GIÁ / VOUCHER
    if (isAskVoucherPoints) {
      const pts = context?.customerProfile?.points || 450;
      const tier = context?.customerProfile?.tier || 'Vàng';
      return attachMeta({
        skill: 'AI_VIP_LOYALTY',
        message: `👑 **Đặc Quyền Thành Viên & Kho Voucher Của ${context?.customerProfile?.name || 'Quý Khách'}**:\n\n` +
          `• ⭐ **Hạng thẻ hiện tại**: **Hạng ${tier}** — Có sẵn **${pts} điểm** *(Trừ trực tiếp **${(pts * 100).toLocaleString('vi-VN')}đ** vào đơn hàng)*\n` +
          `• 🎟️ **Mã FREESHIPMAX**: Miễn phí vận chuyển hỏa tốc 2h toàn quốc.\n` +
          `• 🎟️ **Mã VIPGOLD10**: Giảm ngay **80.000đ - 10%** đặc quyền thành viên Vàng.\n` +
          `• 🎟️ **Mã ZSHOPNEW**: Giảm thêm **50.000đ** cho đơn hàng iPhone hôm nay!`,
        promotions: [
          { code: 'VIPGOLD10', discountText: 'Giảm 10% Đặc quyền VIP Vàng', minSpend: 500000, description: 'Áp dụng cho mọi dòng iPhone chính hãng' },
          { code: 'FREESHIPMAX', discountText: 'Miễn phí Ship Hỏa Tốc 2H', minSpend: 0, description: 'Giao tận nơi & hỗ trợ chép dữ liệu tại chỗ' }
        ],
        suggestedActions: [
          context?.activeProduct ? `Thêm "${context.activeProduct.name}" vào giỏ` : 'Mẫu nào bán chạy nhất?',
          'Đi đến giỏ hàng & Thanh toán'
        ]
      });
    }

    if (query.includes('mới nhất') || query.includes('xịn nhất') || query.includes('đỉnh nhất') || query.includes('trùm cuối') || query.includes('flagship')) {
      const topNewest = catalog.slice(0, 4);
      return attachMeta({
        skill: 'PRODUCT_SEARCH_RECOMMEND',
        message: `👑 **Top 4 Siêu Phẩm iPhone Mới Nhất & Đỉnh Nhất Nhà Táo Tại ZShop**:\n\n` +
          topNewest.map((p, idx) => `${idx + 1}. **${p.name}** *(Màu: ${p.colors[0]})* — **${p.price.toLocaleString('vi-VN')}đ** *(Đã bán ${(p.soldCount || 1200).toLocaleString('vi-VN')} máy)*`).join('\n'),
        products: topNewest,
        suggestedActions: ['18prm giá bn z sốp?', 'Mẫu nào bán chạy nhất?', 'So sánh 18prm với 17prm']
      });
    }

    // D6. Chào hỏi / Giao tiếp GenZ thân thiện
    if (/^(hi|hello|hé lô|chào|alo|ê|ơi|sốp ơi|shop ơi|ad ơi|tư vấn|cảm ơn|thank|ok|okela|uy tín)\b/i.test(query.trim())) {
      const topFeatured = context?.activeProduct
        ? [context.activeProduct, ...catalog.filter(p => p.id !== context.activeProduct?.id).slice(0, 2)]
        : catalog.slice(0, 3);
      return attachMeta({
        skill: 'GENERAL_CONSULT',
        message: `🫶 **Dạ sốp nghe nè ${context?.customerProfile?.name || 'bạn iu'} ơi!** Mình là **ZShop GenZ iPhone AI** — Đã kết nối trực tiếp với toàn bộ **Database 45 mẫu iPhone, Giỏ hàng (${context?.cartItems?.length || 0} món), Đơn hàng & Điểm VIP (${context?.customerProfile?.points || 450} điểm)** của bạn!` +
          (context?.activeProduct ? `\n\n👀 Mình thấy bạn đang xem **${context.activeProduct.name}** (*${context.activeProduct.price.toLocaleString('vi-VN')}đ*). Bạn muốn hỏi thêm về trả góp, màu sắc hay so sánh mẫu này với các dòng bán chạy nhất cứ nhắn tự nhiên nha:` : `\n\nBạn cần tìm máy theo nhu cầu nào cứ nhắn tự nhiên nha:`) +
          `\n• 🏆 **Top doanh số**: *"Mẫu nào bán chạy nhất?"*, *"Máy nào đang giảm sâu nhất?"*\n` +
          `• 🔥 **Báo giá & Săn deal**: *"18prm giá bn sốp"*, *"Con này pin trâu ko?"*\n` +
          `• 💳 **Trả góp & Thu cũ**: *"16prm trả góp đưa trc bnhiu"*, *"Thu cũ 14prm lên 18prm"*`,
        products: topFeatured,
        suggestedActions: [
          '🏆 Mẫu nào bán chạy nhất?',
          context?.activeProduct ? `Phân tích máy ${context.activeProduct.name.split(' ').slice(0, 3).join(' ')} đang xem` : '🔥 18prm giá bn z sốp?',
          '🛒 Kiểm tra giỏ hàng của tôi'
        ]
      });
    }

    // D7. TRÍ TUỆ LIÊN KẾT NGỮ CẢNH TỰ ĐỘNG (SMART CONTEXTUAL SYNTHESIS)
    // Nếu khách hỏi bất kỳ câu hỏi tự nhiên nào khác (không để rơi vào fallback iPhone 6s cũ!)
    const keywords = normLower
      .split(/\s+/)
      .filter(w => w.length >= 2 && !['cho', 'tôi', 'mình', 'hỏi', 'với', 'nhất', 'nào', 'của', 'tại', 'sao', 'thế', 'nhé', 'nha', 'vậy', 'shop', 'sốp'].includes(w));

    const scoredCatalog = catalog.map(p => {
      let score = 0;
      const searchable = `${p.name} ${p.category} ${p.colors.join(' ')} ${p.description}`.toLowerCase();
      for (const kw of keywords) {
        if (searchable.includes(kw)) score += 3;
      }
      if (context?.activeProduct && p.id === context.activeProduct.id) {
        score += 2; // Ưu tiên liên kết với sản phẩm khách đang mở trên màn hình
      }
      score += Math.min(2, (p.soldCount || 0) / 1500);
      return { product: p, score };
    }).sort((a, b) => b.score - a.score);

    const bestMatches = scoredCatalog.slice(0, 3).map(s => s.product);
    const focusPhone = context?.activeProduct || bestMatches[0];

    return attachMeta({
      skill: 'PRODUCT_SEARCH_RECOMMEND',
      message: `🤖 **Trợ Lý AI Thế Giới iPhone** xin giải đáp câu hỏi *"${prompt}"* của **${context?.customerProfile?.name || 'bạn'}**:\n\n` +
        (context?.activeProduct
          ? `• 📱 **Về mẫu bạn đang xem (${context.activeProduct.name})**: Giá ưu đãi hiện tại là **${context.activeProduct.price.toLocaleString('vi-VN')}đ** *(Giảm ${context.activeProduct.discountRate}% | Đã bán ${(context.activeProduct.soldCount || 3400).toLocaleString('vi-VN')} máy | Đánh giá ${context.activeProduct.rating}⭐)*. ${context.activeProduct.description}\n\n`
          : '') +
        `• 🏆 **Gợi ý các dòng iPhone phù hợp & bán chạy nhất cho nhu cầu của bạn**:\n` +
        bestMatches.map((p, i) =>
          `   ${i + 1}. **${p.name}** *(Màu: ${p.colors[0]})* — **${p.price.toLocaleString('vi-VN')}đ** *(Đã bán ${(p.soldCount || 1800).toLocaleString('vi-VN')} máy • Sẵn ${p.stock} máy)*`
        ).join('\n') +
        `\n\n💡 Bạn có thể bấm trực tiếp vào sản phẩm bên dưới để **Xem chi tiết**, **Thêm vào giỏ hàng**, hoặc hỏi mình tính **Trả góp 0%** / **Thu cũ lên đời** cho mẫu **${focusPhone.name}** nhé!`,
      products: bestMatches,
      suggestedActions: [
        `Thêm "${focusPhone.name}" vào giỏ`,
        '🏆 Mẫu nào bán chạy nhất?',
        `Tính trả góp 0% cho ${focusPhone.name.split(' ').slice(0, 3).join(' ')}`
      ]
    });
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
      const isPhone = matchedMain.name.toLowerCase().includes('iphone');
      
      let accessories = catalog.filter(p => {
        const cat = (p.category || '').toLowerCase();
        const nm = p.name.toLowerCase();
        return nm.includes('sạc') || nm.includes('cáp') || nm.includes('ốp') || nm.includes('cường lực') || cat.includes('phụ kiện');
      }).slice(0, 2);

      if (accessories.length < 2) {
        accessories = catalog.filter(p => p.id !== matchedMain.id).slice(0, 2);
      }

      const comboItems: ProductDetail[] = [matchedMain, ...accessories];
      const totalPrice = comboItems.reduce((acc, item) => acc + item.price, 0);

      return {
        id: `tech-combo-cart-${Date.now()}`,
        title: `Combo Phụ Kiện Apple Chính Hãng Cho "${matchedMain.name.slice(0, 25)}..."`,
        style: 'Apple Ecosystem Genuine Fast Charge & Protection',
        occasion: 'Sạc nhanh an toàn với chuẩn sạc Apple, bảo vệ toàn diện',
        description: `Alex TechPro đã ghép nối củ sạc Apple chính hãng và phụ kiện tương thích 100% công suất cho iPhone của bạn, đảm bảo an toàn pin tối đa.`,
        items: comboItems,
        totalPrice,
        discountPrice: Math.round(totalPrice * 0.92)
      };
    }

    // 2. Combo Gaming & Giải Trí Âm Thanh
    if (query.includes('gaming') || query.includes('chơi game') || query.includes('game thủ') || query.includes('tai nghe') || query.includes('âm thanh')) {
      const items = catalog.filter(p => 
        p.id === 'PHONE-035' || p.id === 'APPLE-ACC-007' || p.id === 'APPLE-ACC-003'
      );
      const comboItems = items.length >= 2 ? items : catalog.slice(0, 3);
      const totalPrice = comboItems.reduce((acc, item) => acc + item.price, 0);

      return {
        id: 'combo-gaming-apple',
        title: 'Combo Apple Pro Gaming & Âm Thanh Không Dây (iPhone 16 Pro Max + AirPods Pro 2)',
        style: 'Apple Spatial Audio & High Refresh Rate Gaming',
        occasion: 'Chơi game đồ họa cao mượt mà với chip A18 Pro và âm thanh không gian sống động',
        description: 'iPhone 16 Pro Max màn hình Super Retina XDR 120Hz kết hợp AirPods Pro 2 chống ồn chủ động và cáp bọc dù bền bỉ.',
        items: comboItems,
        totalPrice,
        discountPrice: Math.round(totalPrice * 0.95)
      };
    }

    // 3. Combo Doanh nhân / Công sở MagSafe
    if (query.includes('công sở') || query.includes('văn phòng') || query.includes('doanh nhân') || query.includes('magsafe') || query.includes('đa thiết bị')) {
      const items = catalog.filter(p => 
        p.id === 'PHONE-035' || p.id === 'APPLE-ACC-002' || p.id === 'APPLE-ACC-009'
      );
      const comboItems = items.length >= 2 ? items : catalog.slice(0, 3);
      const totalPrice = comboItems.reduce((acc, item) => acc + item.price, 0);

      return {
        id: 'combo-office-magsafe',
        title: 'Combo Doanh Nhân Đẳng Cấp (iPhone 16 Pro Max + Sạc Apple 35W Dual + Ốp MagSafe)',
        style: 'Executive Apple MagSafe Ecosystem',
        occasion: 'Làm việc văn phòng, công tác và di chuyển liên tục',
        description: 'Bộ đôi củ sạc 35W 2 cổng USB-C chính hãng và ốp lưng Silicone MagSafe bảo vệ máy sang trọng.',
        items: comboItems,
        totalPrice,
        discountPrice: Math.round(totalPrice * 0.95)
      };
    }

    // 4. Combo Vlogger / Creator Livestream
    if (query.includes('vlog') || query.includes('quay phim') || query.includes('livestream') || query.includes('creator') || query.includes('youtube')) {
      const items = catalog.filter(p => 
        p.id === 'PHONE-035' || p.id === 'APPLE-ACC-008' || p.id === 'APPLE-ACC-006'
      );
      const comboItems = items.length >= 2 ? items : catalog.slice(0, 3);
      const totalPrice = comboItems.reduce((acc, item) => acc + item.price, 0);

      return {
        id: 'combo-vlogger-creator',
        title: 'Combo Sáng Tạo Nội Dung Điện Ảnh (iPhone 16 Pro Max + AirPods Max + MagSafe Battery)',
        style: 'Pro Cinematic Video & Sound Creation Kit',
        occasion: 'Quay video 4K 120fps ProRes, dựng vlog và di chuyển cả ngày',
        description: 'iPhone 16 Pro Max quay phim điện ảnh kèm Pin dự phòng MagSafe cấp nguồn liên tục và AirPods Max kiểm âm chất lượng studio.',
        items: comboItems,
        totalPrice,
        discountPrice: Math.round(totalPrice * 0.95)
      };
    }

    // 5. Combo Mặc định: Bộ trang bị cơ bản bảo vệ toàn diện (Budget Starter Kit)
    const defaultItems = catalog.filter(p => 
      p.id === 'PHONE-003' || p.id === 'APPLE-ACC-001' || p.id === 'APPLE-ACC-010'
    );
    const finalItems = defaultItems.length >= 2 ? defaultItems : catalog.slice(0, 3);
    const totalPrice = finalItems.reduce((acc, item) => acc + item.price, 0);

    return {
      id: 'combo-essential-starter',
      title: 'Combo Apple Tiết Kiệm & Bền Bỉ (iPhone 6s + Sạc Apple 20W + Kính Cường Lực)',
      style: 'All-in-One Apple Daily Protection & Fast Charging',
      occasion: 'Sử dụng hằng ngày, máy phụ nhỏ gọn hoặc sưu tầm hoài niệm',
      description: 'Củ sạc chính hãng Apple 20W Type-C cùng miếng dán cường lực Apple Care+ Shield bảo vệ màn hình tối đa.',
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
    const { normalized, detectedAbbreviations } = this.normalizeGenZText(prompt);

    // Ưu tiên giải mã câu hỏi GenZ về iPhone trên mọi tab Khách hàng (trừ khi đang hỏi tra cứu mã đơn cụ thể trong ORDERS)
    const isDirectOrderTrack = persona === 'ORDERS' && /(đơn hàng|mã đơn|dh-|tgip-|ship tới đâu|bao giờ giao)/i.test(normalized);
    const isDirectLoyaltyPoints = persona === 'LOYALTY' && /(xem chi tiết điểm|thăng hạng|hạng thẻ|voucher|mã giảm)/i.test(normalized);
    if (persona !== 'BUSINESS' && !isDirectOrderTrack && !isDirectLoyaltyPoints) {
      const genZMatch = this.handleGenZiPhoneQuery(prompt, productCatalog, context, persona);
      if (genZMatch) {
        return genZMatch;
      }
    }

    // =========================================================================
    // 1. PERSONA: STYLIST (Alex iPhonePro - Chuyên Gia Tư Vấn iPhone GenZ)
    // =========================================================================
    if (persona === 'STYLIST') {
      const combo = this.generateOutfitCombo(prompt, context.cartItems, productCatalog);
      const personalizedGreeting = customerName ? `Chào **${customerName}**! ` : '';

      return {
        skill: 'AI_FASHION_STYLIST',
        message: `⚡ ${personalizedGreeting}**Alex iPhonePro** đã tuyển chọn riêng cho bạn **${combo.title}** tối ưu công năng:
- **Phân khúc & Cấu hình**: ${combo.style}
- **Mục đích sử dụng**: ${combo.occasion}
- **Đánh giá chuyên gia**: ${combo.description}`,
        outfitCombo: combo,
        products: combo.items,
        suggestedActions: [
          '🔥 Tìm cho tôi ip 18prm',
          '⚡ So sánh 18prm với 17prm',
          '💰 Tư vấn iPhone tầm 15 củ'
        ]
      };
    }

    // =========================================================================
    // 2. PERSONA: FITTING (Ken AppleSpec - Chuyên Viên Thông Số & Tương Thích Kỹ Thuật)
    // =========================================================================
    if (persona === 'FITTING') {
      const q = prompt.toLowerCase();
      let deviceMatched = 'Dòng máy Apple của bạn';
      let protocol = 'Chuẩn sạc nhanh Power Delivery & MagSafe Apple';
      let compatibilityStatus = 'Hoàn toàn tương thích 100%';
      let detailMsg = '';

      if (q.includes('17') || q.includes('18')) {
        deviceMatched = 'iPhone 17 & iPhone 18 Series';
        protocol = 'Power Delivery 3.1 & MagSafe 25W thế hệ mới (Cổng USB-C)';
        compatibilityStatus = 'Tương thích tuyệt đối với củ sạc Apple 20W, 35W Dual và sạc MagSafe 25W';
        detailMsg = 'Thế hệ tương lai iPhone 17 và 18 Pro Max hỗ trợ sạc nhanh công suất cao tối ưu qua cổng USB-C, chip A19/A20 Pro quản lý nhiệt lượng thông minh, hạn chế tối đa chai pin.';
      } else if (q.includes('15') || q.includes('16')) {
        deviceMatched = 'iPhone 15 & iPhone 16 Series';
        protocol = 'Universal USB-C & MagSafe / Qi2 15W - 25W';
        compatibilityStatus = 'Tương thích 100% với Cáp USB-C to USB-C 60W bọc dù và củ sạc Apple 20W/35W';
        detailMsg = 'Apple đã chuyển đổi toàn bộ sang cổng USB-C. Khi sử dụng củ sạc chính hãng Apple 20W hoặc 35W Dual, thiết bị sạc được 50% pin chỉ trong 25-30 phút an toàn tuyệt đối.';
      } else if (q.includes('11') || q.includes('12') || q.includes('13') || q.includes('14')) {
        deviceMatched = 'iPhone 11, 12, 13, 14 Series';
        protocol = 'Apple Lightning PD 20W & MagSafe 15W (Từ dòng iPhone 12)';
        compatibilityStatus = 'Tương thích tối ưu với Cáp USB-C to Lightning MFi và củ sạc 20W';
        detailMsg = 'Các dòng iPhone từ 11 đến 14 Pro Max sử dụng cổng kết nối Lightning độc quyền Apple. Riêng iPhone 12, 13, 14 có vòng nam châm MagSafe hít dính sạc không dây 15W tiện lợi.';
      } else if (q.includes('6') || q.includes('7') || q.includes('8') || q.includes('x') || q.includes('xs') || q.includes('xr')) {
        deviceMatched = 'iPhone Cổ Điển (iPhone 6, 7, 8, X, XS, XR)';
        protocol = 'Apple Lightning 12W - 18W & Touch ID / Face ID';
        compatibilityStatus = 'Tương thích 100% với cáp sạc Lightning MFi và củ sạc an toàn';
        detailMsg = 'Các dòng máy kinh điển hỗ trợ sạc an toàn, máy likenew 99% nguyên bản cam kết dung lượng pin từ 85% đến 100%, bảo hành 1 đổi 1 trong 30 ngày.';
      } else {
        deviceMatched = 'Hệ Sinh Thái Thiết Bị & Phụ Kiện Apple';
        protocol = 'Apple MFi Certified & Power Delivery';
        compatibilityStatus = '100% Phụ Kiện Apple Chính Hãng Tiêu Chuẩn';
        detailMsg = 'Tất cả củ sạc 20W, 35W Dual, cáp bọc dù, tai nghe AirPods và phụ kiện MagSafe tại ZShop đều đạt chứng nhận an toàn, tự động ngắt khi đầy pin.';
      }

      return {
        skill: 'AI_SMART_FITTING',
        message: `🔬 **Ken TechSpec** đã kiểm định thông số kỹ thuật cho **${deviceMatched}**:
- ⚡ **Chuẩn sạc tương thích**: **${protocol}**
- 🛡️ **Độ tương thích**: **${compatibilityStatus}**
- 💡 **Khuyến nghị kỹ thuật**: ${detailMsg}`,
        suggestedActions: [
          'Củ Sạc Nhanh Apple 20W USB-C',
          'Củ Sạc Đôi Apple 35W Dual USB-C',
          'Cáp Sạc Nhanh Apple USB-C to USB-C 60W',
          'Đế Sạc Không Dây Apple MagSafe 15W'
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
      const genZModels = this.resolveGenZPhoneModels(prompt, productCatalog);
      const matched = genZModels[0] || productCatalog.find(p => 
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
      const genZModels = this.resolveGenZPhoneModels(prompt, productCatalog);
      const matched = genZModels[0] || productCatalog.find(p => 
        query.includes(p.name.toLowerCase()) || 
        query.includes(p.id.toLowerCase())
      ) || productCatalog[0];

      return {
        skill: 'QUICK_ADD_TO_CART',
        message: `🛒 Bạn muốn thêm **${matched.name}** vào giỏ hàng đúng không? Bấm ngay nút bên dưới để chốt đơn nhé!`,
        products: [matched],
        suggestedActions: [`Thêm "${matched.name}" vào giỏ`, 'Xem giỏ hàng', 'Tìm cho tôi ip 18prm']
      };
    }

    // ƯU TIÊN GIẢI MÃ TRUY VẤN GENZ VỀ IPHONE (ip 18prm, 17prm, 16prm, xsm, 8p, tầm 15 củ...)
    const genZResult = this.handleGenZiPhoneQuery(prompt, productCatalog);
    if (genZResult) {
      return genZResult;
    }

    // SMART SEARCH & RECOMMENDATION (Ưu tiên các dòng iPhone mới nhất đầu danh sách)
    const { minPrice, maxPrice } = this.extractPriceRange(query);

    let filtered = productCatalog.filter(p => {
      const matchPrice = p.price >= minPrice && p.price <= maxPrice;
      return matchPrice;
    });

    if (filtered.length === 0) {
      filtered = productCatalog.slice(0, 4);
    }

    return {
      skill: 'PRODUCT_SEARCH_RECOMMEND',
      message: `✨ **AI ZShop (Gemini 2.5 Flash)** đã lọc ra **${Math.min(4, filtered.length)} siêu phẩm iPhone mới nhất** trong kho (< 30 mẫu tuyển chọn từ iPhone 4 đến iPhone 18 Pro Max):`,
      products: filtered.slice(0, 4),
      suggestedActions: ['🔥 Tìm cho tôi ip 18prm', '⚡ So sánh 18prm với 17prm', '💰 Tìm iPhone tầm 15 củ']
    };
  }
}
