import json
import os

base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
json_path = os.path.join(base_dir, 'agent_service', 'data', 'all_50_products.json')
constants_path = os.path.join(base_dir, 'constants.ts')

with open(json_path, 'r', encoding='utf-8') as f:
    products = json.load(f)

for p in products:
    p['reviewCount'] = p.get('reviewCount', max(15, int(p.get('soldCount', 100) * 0.22)))
    p['discountRate'] = p.get('discountRate', round((1 - p['price'] / p['originalPrice']) * 100) if p.get('originalPrice') else 0)
    p['shippingFee'] = p.get('shippingFee', 15000 if p['price'] < 500000 else 0)
    p['shippingEstimate'] = p.get('shippingEstimate', "Hỏa tốc 2h - 48h")
    p['videoDuration'] = p.get('videoDuration', "00:45s")

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

first = products[0]

mock_product_detail_code = f"""export const MOCK_PRODUCT_DETAIL: ProductDetail = {{
  id: "{first['id']}",
  name: "{first['name']}",
  category: "{first['category']}",
  rating: {first['rating']},
  reviewCount: {first['reviewCount']},
  soldCount: {first['soldCount']},
  price: {first['price']},
  originalPrice: {first['originalPrice']},
  discountRate: {first['discountRate']},
  shippingFee: {first['shippingFee']},
  shippingEstimate: "{first['shippingEstimate']}",
  colors: {json.dumps(first['colors'], ensure_ascii=False)},
  sizes: {json.dumps(first['sizes'], ensure_ascii=False)},
  stock: {first['stock']},
  videoDuration: "{first['videoDuration']}",
  images: [
    "{first['images'][0]}",
    "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600",
    "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600"
  ],
  description: {json.dumps(first['description'], ensure_ascii=False)}
}};"""

content = f"""import {{ Order, PaymentMethodConfig, PaymentMethodType, ProductDetail, CartItem }} from './types';

export const MOCK_ORDER: Order = {{
  id: "DH-20260919",
  createdAt: new Date().toISOString(),
  shippingFee: 30000,
  discount: 50000,
  items: [
    {{
      id: "{products[0]['id']}",
      name: "{products[0]['name']}",
      price: {products[0]['price']},
      quantity: 1,
      variant: "256GB - Titan Tự Nhiên",
      image: "{products[0]['images'][0]}"
    }},
    {{
      id: "{products[8]['id']}",
      name: "{products[8]['name']}",
      price: {products[8]['price']},
      quantity: 1,
      variant: "67W - Đen Xám",
      image: "{products[8]['images'][0]}"
    }}
  ]
}};

export const MOCK_CART_ITEMS: CartItem[] = [
  {{
    id: "c1",
    name: "{products[0]['name']}",
    size: "256GB",
    price: {products[0]['price']},
    quantity: 1,
    image: "{products[0]['images'][0]}"
  }},
  {{
    id: "c2",
    name: "{products[8]['name']}",
    size: "67W",
    price: {products[8]['price']},
    quantity: 1,
    image: "{products[8]['images'][0]}"
  }}
];

export const PAYMENT_METHODS: PaymentMethodConfig[] = [
  {{
    id: PaymentMethodType.QR_CODE,
    title: "Quét mã VNPAY-QR (Khuyên dùng)",
    description: "Quét mã qua ứng dụng ngân hàng/Ví VNPAY",
    iconName: "qr"
  }},
  {{
    id: PaymentMethodType.DOMESTIC_CARD,
    title: "Thẻ ATM / Internet Banking",
    description: "Hỗ trợ 40+ ngân hàng tại Việt Nam",
    iconName: "credit-card"
  }},
  {{
    id: PaymentMethodType.INTERNATIONAL_CARD,
    title: "Thẻ Quốc tế (Visa/Master/JCB)",
    description: "Phí chuyển đổi ngoại tệ có thể áp dụng",
    iconName: "globe"
  }},
  {{
    id: PaymentMethodType.MOMO,
    title: "Ví điện tử MoMo",
    description: "Thanh toán qua ứng dụng MoMo",
    iconName: "wallet"
  }},
  {{
    id: PaymentMethodType.COD,
    title: "Thanh toán khi nhận hàng (COD)",
    description: "Thanh toán tiền mặt cho Shipper khi nhận hàng",
    iconName: "money"
  }}
];

{mock_product_detail_code}

export const MOCK_PRODUCTS_LIST: ProductDetail[] = {json.dumps(products, ensure_ascii=False, indent=2)};
"""

with open(constants_path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Successfully generated {constants_path} with {len(products)} products and all required fields!")
