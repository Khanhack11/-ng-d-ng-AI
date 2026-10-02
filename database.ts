import { ProductDetail, Order, TrackingStep, OrderStatus } from './types.ts';
import { MOCK_PRODUCTS_LIST } from './constants.ts';
import { matchSearchKeyword, enrichProduct } from './productUtils.ts';

const DIVERSE_PRIORITY_IDS: string[] = [
    'ip-16-promax',
    'ip-15-promax',
    'ip-18-promax',
    'ip-14-promax',
    'ip-17-promax',
    'ip-13-promax',
    'ip-16-pro',
    'ip-15-plus',
    'ip-17-air',
    'ip-12-promax',
    'ip-16',
    'ip-15',
    'ip-13',
    'ip-11-promax',
    'ip-8-plus',
    'ip-14-pro',
    'ip-16-plus',
    'ip-15-pro',
    'ip-18-pro',
    'ip-xs-max',
    'ip-14-plus',
    'ip-14',
    'ip-12',
    'ip-17-pro',
    'ip-4s',
    'ip-16e',
    'ip-17',
    'ip-18',
    'ip-17-plus',
    'ip-18-plus',
    'ip-17e',
    'ip-18e',
    'ip-18-ultra'
];

export class HeThongBanHangDB {
    static getSanPhamById(id: string): ProductDetail {
        const found = MOCK_PRODUCTS_LIST.find(p => p.id === id) || MOCK_PRODUCTS_LIST[0];
        return enrichProduct(found);
    }

    static getAllSanPham(): ProductDetail[] {
        const orderMap = new Map(DIVERSE_PRIORITY_IDS.map((id, index) => [id, index]));
        return [...MOCK_PRODUCTS_LIST]
            .sort((a, b) => {
                const idxA = orderMap.has(a.id) ? orderMap.get(a.id)! : 999;
                const idxB = orderMap.has(b.id) ? orderMap.get(b.id)! : 999;
                return idxA - idxB;
            })
            .map(p => enrichProduct(p));
    }

    static searchSanPham(tuKhoa: string): ProductDetail[] {
        return MOCK_PRODUCTS_LIST
            .map(p => enrichProduct(p))
            .filter(p => 
                matchSearchKeyword(p.name, tuKhoa) || 
                (p.category && matchSearchKeyword(p.category, tuKhoa))
            );
    }

    static saveDonHang(newOrder: Order): void {
        console.log("DB Mock: Saved Order", newOrder.id);
    }

    static getLichSuDonHang(keyword: string): TrackingStep[] | null {
        if (!keyword || keyword.trim() === '') return null;
        
        return [
            {
                status: OrderStatus.PENDING,
                date: new Date(Date.now() - 86400000).toISOString(),
                description: 'Đơn hàng đã được tạo',
                completed: true
            },
            {
                status: OrderStatus.PAID,
                date: new Date(Date.now() - 43200000).toISOString(),
                description: 'Đã thanh toán thành công',
                completed: true
            },
            {
                status: OrderStatus.PROCESSING,
                date: new Date(Date.now() - 3600000).toISOString(),
                description: 'Đang chuẩn bị hàng',
                completed: true
            },
            {
                status: OrderStatus.SHIPPING,
                date: new Date().toISOString(),
                description: 'Đơn hàng đã được giao cho đơn vị vận chuyển',
                completed: false
            }
        ];
    }

    static updateTrangThaiDonHang(orderId: string, status: OrderStatus): void {
        console.log(`DB Mock: Updated Order ${orderId} status to ${status}`);
    }
}
