import { HeThongBanHangDB } from './database.ts';
import { CartItem, Order, OrderFormData, PaymentMethodType, ProductDetail, TrackingStep, OrderStatus } from './types.ts';
import { enrichProduct } from './productUtils.ts';

export * from './productUtils.ts';

/**
 * SERVICE LAYER - NHÓM LỚP CONTROL
 */

// 1. SanPhamService: Xử lý logic liên quan đến sản phẩm (UC01, UC02)
export class SanPhamService {
    static layChiTietSanPham(id: string): ProductDetail {
        // Có thể thêm logic business: Kiểm tra sản phẩm có đang bị khóa không, tính lại giá khuyến mãi động...
        return HeThongBanHangDB.getSanPhamById(id);
    }

    static layDanhSachSanPham(): ProductDetail[] {
        return HeThongBanHangDB.getAllSanPham();
    }

    static timKiemSanPham(tuKhoa: string): ProductDetail[] {
        // Có thể thêm logic lưu lịch sử tìm kiếm, gợi ý từ khóa, v.v.
        return HeThongBanHangDB.searchSanPham(tuKhoa);
    }
}

// 2. DatHangService: Xử lý logic đặt hàng, giỏ hàng (UC03, UC05, UC06)
export class DatHangService {
    static currentOrderId: string = 'DH-20241228';

    static tinhTongTienGioHang(items: CartItem[]): number {
        return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    }

    static async taoDonHangNhap(items: CartItem[], customerInfo: OrderFormData): Promise<Order> {
        const subtotal = this.tinhTongTienGioHang(items);
        const shippingFee = 30000; 
        const discount = 0; 
        const finalTotal = subtotal + shippingFee - discount;
        
        const newOrder: Order = {
            id: `DH-${Date.now().toString().slice(-6)}`, 
            items: items.map(i => ({
                id: i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.image, variant: i.size
            })),
            shippingFee, discount, createdAt: new Date().toISOString(), customerInfo
        };

        try {
            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items,
                    customerInfo,
                    total_amount: finalTotal
                })
            });
            const data = await response.json();
            if (data.success) {
                newOrder.id = data.orderId;
                this.currentOrderId = data.orderId;
            }
        } catch (e) {
            console.error("Lỗi khi kết nối DB:", e);
            HeThongBanHangDB.saveDonHang(newOrder); // Fallback mock
        }
        return newOrder;
    }

    static traCuuDonHang(keyword: string): TrackingStep[] | null {
        // Logic business: Validate keyword, format keyword...
        if (!keyword) return null;
        return HeThongBanHangDB.getLichSuDonHang(keyword);
    }
}

// 3. ThanhToanService: Xử lý giao dịch thanh toán (UC04)
export class ThanhToanService {
    static async xuLyThanhToan(orderId: string, amount: number, method: PaymentMethodType): Promise<boolean> {
        console.log(`Service: Đang thực hiện thanh toán cho đơn ${orderId} qua ${method}...`);
        try {
            const isSuccess = (method === PaymentMethodType.QR_CODE || method === PaymentMethodType.COD);
            
            const response = await fetch('http://localhost:5000/api/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    order_id: orderId,
                    method: method,
                    amount: amount,
                    status: isSuccess ? 'SUCCESS' : 'FAILED'
                })
            });
            const data = await response.json();
            
            if (!isSuccess) {
                throw new Error("GATEWAY_TIMEOUT");
            }
            return data.success;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

// 4. GioHangService: Xử lý giỏ hàng API liên kết với SQL Database
export class GioHangService {
    static async layGioHang(customerId: number = 1): Promise<CartItem[]> {
        try {
            const response = await fetch('http://localhost:5000/api/carts', {
                headers: { 'x-customer-id': customerId.toString() }
            });
            if (!response.ok) return [];
            return await response.json();
        } catch(e) {
            console.error("Lỗi lấy giỏ hàng từ CSDL", e);
            return [];
        }
    }

    static async themVaoGio(item: CartItem, customerId: number = 1): Promise<CartItem[]> {
        try {
            const response = await fetch('http://localhost:5000/api/carts/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-customer-id': customerId.toString() },
                body: JSON.stringify({
                    product_id: typeof item.id === 'string' && item.id.startsWith('PROD') ? 1 : item.id, // Fallback if dummy string
                    quantity: item.quantity,
                    size: item.size
                })
            });
            return await response.json();
        } catch(e) {
            console.error("Lỗi thêm vào giỏ hàng (DB)", e);
            return [];
        }
    }

    static async xoaKhoiGio(cartItemId: string | number, customerId: number = 1): Promise<CartItem[]> {
        try {
            const response = await fetch('http://localhost:5000/api/carts/remove', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-customer-id': customerId.toString() },
                body: JSON.stringify({
                    cartItemId
                })
            });
            return await response.json();
        } catch(e) {
            console.error("Lỗi xoá khỏi giỏ hàng (DB)", e);
            return [];
        }
    }

    static async xoaToanBoGio(customerId: number = 1): Promise<boolean> {
        try {
            const response = await fetch('http://localhost:5000/api/carts/clear', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-customer-id': customerId.toString() }
            });
            return response.ok;
        } catch(e) {
            console.error("Lỗi làm trống giỏ hàng (DB)", e);
            return false;
        }
    }
}

// 5. SanPhamAdminService: Xử lý quản lý sản phẩm giao tiếp REST API
export class SanPhamAdminService {
    static async layTatCaSanPham(): Promise<any[]> {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);
            const res = await fetch('http://localhost:5000/api/products', { signal: controller.signal });
            clearTimeout(timeoutId);
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    return data.map((p: any) => enrichProduct({
                        id: p.id,
                        name: p.name,
                        price: p.price,
                        stock: p.stock || 50,
                        category: p.category,
                        categoryName: p.category,
                        image_url: p.image_url || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
                        rating: p.rating || 4.9,
                        soldCount: p.soldCount || 120,
                        originalPrice: p.originalPrice || Math.round(p.price * 1.25),
                        discountRate: p.discountRate || 20,
                        sizes: p.sizes,
                        colors: p.colors,
                        description: p.description
                    }));
                }
            }
        } catch (e) {
            // Không ngắt mạch UI khi backend chưa bật
        }

        // Luôn cung cấp đầy đủ danh mục sản phẩm phong phú từ CSDL mẫu đã được làm giàu thông tin
        return HeThongBanHangDB.getAllSanPham().map(p => enrichProduct({
            id: p.id,
            name: p.name,
            price: p.price,
            stock: p.stock || 50,
            category: p.category,
            categoryName: p.category,
            image_url: p.images && p.images.length > 0 ? p.images[0] : 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
            rating: p.rating || 4.9,
            soldCount: p.soldCount || 120,
            originalPrice: p.originalPrice || Math.round(p.price * 1.25),
            discountRate: p.discountRate || 20,
            sizes: p.sizes,
            colors: p.colors,
            description: p.description
        }));
    }

    static async themMoiSanPham(data: { name: string, price: number, stock: number, category: string, image_url: string }): Promise<boolean> {
        try {
            const res = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res.ok;
        } catch(e) {
            console.error("Lỗi thêm SP backend", e);
            return false;
        }
    }

    static async xoaSanPham(id: number | string): Promise<boolean> {
        try {
            const res = await fetch(`http://localhost:5000/api/products/${id}`, {
                method: 'DELETE'
            });
            return res.ok;
        } catch(e) {
            console.error("Lỗi xoá SP backend", e);
            return false;
        }
    }

    static async capNhatSanPham(id: number | string, data: any): Promise<boolean> {
        try {
            const realId = typeof id === 'string' ? id.replace('SP-', '') : id;
            const res = await fetch(`http://localhost:5000/api/products/${realId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res.ok;
        } catch(e) {
            console.error("Lỗi cập nhật SP backend", e);
            return false;
        }
    }
}

const API_BASE_URL = 'http://localhost:5000/api';

export interface AuthUserData {
    id: number | string;
    email: string;
    name?: string;
    role?: string;
    avatar?: string;
    provider?: string;
}

export interface AuthSession {
    token: string;
    role: 'CUSTOMER' | 'ADMIN' | 'SELLER' | 'SALES' | 'WAREHOUSE';
    user: AuthUserData;
    isOffline?: boolean;
}

const STORAGE_SESSION_KEY = 'zshop_auth_session';
const STORAGE_OFFLINE_USERS_KEY = 'zshop_offline_users';
const STORAGE_REMEMBER_EMAIL_KEY = 'zshop_remember_email';

export const AuthService = {
    // Lưu thông tin ghi nhớ email
    saveRememberEmail: (email: string) => {
        try {
            if (email) localStorage.setItem(STORAGE_REMEMBER_EMAIL_KEY, email);
            else localStorage.removeItem(STORAGE_REMEMBER_EMAIL_KEY);
        } catch (_) {}
    },

    getRememberEmail: (): string => {
        try {
            return localStorage.getItem(STORAGE_REMEMBER_EMAIL_KEY) || '';
        } catch (_) {
            return '';
        }
    },

    // Kiểm tra nhanh kết nối Backend Cổng 5000 / SQL Server
    checkBackendHealth: async (): Promise<boolean> => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 1500);
            const res = await fetch(`${API_BASE_URL}/categories`, { signal: controller.signal });
            clearTimeout(timeoutId);
            return res.ok;
        } catch (_) {
            return false;
        }
    },

    // Quản lý phiên đăng nhập (Session Persistence)
    saveSession: (session: AuthSession) => {
        try {
            localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
        } catch (e) {
            console.warn('Lỗi lưu session vào localStorage', e);
        }
    },

    getSession: (): AuthSession | null => {
        try {
            const raw = localStorage.getItem(STORAGE_SESSION_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (_) {
            return null;
        }
    },

    clearSession: () => {
        try {
            localStorage.removeItem(STORAGE_SESSION_KEY);
        } catch (_) {}
    },

    // Đăng nhập Smart Hybrid (Online SQL Server + Offline Demo Fallback)
    login: async (email: string, password: string): Promise<{ success: boolean; role?: string; token?: string; user?: AuthUserData; error?: string; isOffline?: boolean }> => {
        const cleanEmail = email.trim().toLowerCase();
        
        // 1. Thử kết nối Backend Express & SQL Server thực tế
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3500);
            
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: cleanEmail, password }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            const data = await response.json();
            if (response.ok && data.success) {
                const session: AuthSession = {
                    token: data.token || 'jwt-sql-token',
                    role: (data.role || 'CUSTOMER') as 'CUSTOMER' | 'ADMIN' | 'SELLER',
                    user: {
                        id: data.user?.id || 1,
                        email: data.user?.email || cleanEmail,
                        name: cleanEmail.includes('admin') ? 'Quản trị viên Hệ thống' : cleanEmail.includes('seller') ? 'Nhà bán hàng ZShop' : 'Khách hàng Thành viên',
                        role: data.role || 'CUSTOMER'
                    },
                    isOffline: false
                };
                AuthService.saveSession(session);
                return { success: true, ...session };
            } else if (response.status === 400 || response.status === 401) {
                return { success: false, error: data.error || 'Sai tài khoản hoặc mật khẩu' };
            }
        } catch (netErr) {
            console.warn('Backend cổng 5000 chưa bật hoặc không kết nối được, kích hoạt chế độ Demo Offline thông minh:', netErr);
        }

        // 2. Chế độ Ngoại tuyến thông minh (Smart Offline Fallback)
        // Hỗ trợ các tài khoản mẫu chuẩn theo sơ đồ Use Case
        const mockAccounts: Record<string, { role: 'CUSTOMER' | 'SELLER' | 'ADMIN' | 'SALES' | 'WAREHOUSE'; name: string }> = {
            'customer@test.com': { role: 'CUSTOMER', name: 'Khách hàng ZShop' },
            'sales@test.com': { role: 'SALES', name: 'Nguyễn Thu Ngân (NV Bán hàng POS)' },
            'warehouse@test.com': { role: 'WAREHOUSE', name: 'Trần Văn Kho (Thủ kho chính)' },
            'seller@test.com': { role: 'SELLER', name: 'ZShop Official Store' },
            'admin@test.com': { role: 'ADMIN', name: 'Chủ cửa hàng (Quản trị viên)' },
            'testkhach@gmail.com': { role: 'CUSTOMER', name: 'Khách Hàng Mẫu' }
        };

        if (mockAccounts[cleanEmail] && (password === '123' || password === 'password123')) {
            const acc = mockAccounts[cleanEmail];
            const session: AuthSession = {
                token: `offline_token_${cleanEmail}_${Date.now()}`,
                role: acc.role,
                user: {
                    id: cleanEmail.includes('admin') ? 3 : cleanEmail.includes('seller') ? 2 : 1,
                    email: cleanEmail,
                    name: acc.name,
                    role: acc.role
                },
                isOffline: true
            };
            AuthService.saveSession(session);
            return { success: true, ...session };
        }

        // Kiểm tra trong danh sách tài khoản đã đăng ký offline
        try {
            const rawUsers = localStorage.getItem(STORAGE_OFFLINE_USERS_KEY);
            const offlineUsers: any[] = rawUsers ? JSON.parse(rawUsers) : [];
            const found = offlineUsers.find(u => u.email.toLowerCase() === cleanEmail && u.password === password);
            if (found) {
                const session: AuthSession = {
                    token: `offline_token_${cleanEmail}_${Date.now()}`,
                    role: found.role || 'CUSTOMER',
                    user: {
                        id: found.id || Date.now(),
                        email: cleanEmail,
                        name: found.name || cleanEmail.split('@')[0],
                        role: found.role || 'CUSTOMER'
                    },
                    isOffline: true
                };
                AuthService.saveSession(session);
                return { success: true, ...session };
            }
        } catch (_) {}

        return { 
            success: false, 
            error: 'Sai tài khoản hoặc mật khẩu (Gợi ý tài khoản mẫu: customer@test.com / seller@test.com / admin@test.com - Mật khẩu: 123)' 
        };
    },

    // Đăng ký tài khoản
    register: async (email: string, password: string, name?: string, role: 'CUSTOMER' | 'SELLER' = 'CUSTOMER'): Promise<any> => {
        const cleanEmail = email.trim().toLowerCase();
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3500);

            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: cleanEmail, password }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            const data = await response.json();
            if (response.ok && data.success) {
                return data;
            } else if (data.error) {
                return { success: false, error: data.error };
            }
        } catch (e) {
            console.warn('Đăng ký qua backend không khả dụng, lưu vào bộ nhớ offline:', e);
        }

        // Offline Register Fallback
        try {
            const rawUsers = localStorage.getItem(STORAGE_OFFLINE_USERS_KEY);
            const offlineUsers: any[] = rawUsers ? JSON.parse(rawUsers) : [];
            if (offlineUsers.some(u => u.email.toLowerCase() === cleanEmail)) {
                return { success: false, error: 'Email này đã được đăng ký trên thiết bị' };
            }

            const newUser = {
                id: Date.now(),
                email: cleanEmail,
                password,
                name: name || cleanEmail.split('@')[0],
                role
            };
            offlineUsers.push(newUser);
            localStorage.setItem(STORAGE_OFFLINE_USERS_KEY, JSON.stringify(offlineUsers));
            return { success: true, id: newUser.id, role, isOffline: true };
        } catch (_) {
            return { success: true, role, isOffline: true };
        }
    },

    forgotPassword: async (email: string): Promise<any> => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim() })
            });
            return await response.json();
        } catch (e) {
            return { success: true, message: `Liên kết khôi phục đã được gửi tới ${email} (Chế độ mô phỏng).` };
        }
    },

    socialLogin: async (provider: 'google' | 'facebook' | 'apple', token: string, profile?: any): Promise<any> => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/social-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ provider, token, profile })
            });
            const data = await response.json();
            if (response.ok && data.success) {
                const session: AuthSession = {
                    token: data.token || 'jwt-social-token',
                    role: data.role || 'CUSTOMER',
                    user: {
                        id: data.user?.id || Date.now(),
                        email: data.user?.email || profile?.email || `${provider}@user.local`,
                        name: profile?.name || data.user?.name || `${provider.toUpperCase()} User`,
                        role: data.role || 'CUSTOMER',
                        provider
                    },
                    isOffline: false
                };
                AuthService.saveSession(session);
                return { success: true, ...session };
            }
        } catch (e) {
            console.warn('Social login online thất bại, fallback sang chế độ demo:', e);
        }

        // Offline Social Login fallback
        const safeEmail = profile?.email || `${provider}.user@zshop.vn`;
        const session: AuthSession = {
            token: `offline_social_${provider}_${Date.now()}`,
            role: 'CUSTOMER',
            user: {
                id: Date.now(),
                email: safeEmail,
                name: profile?.name || `${provider === 'google' ? 'Google User' : provider === 'facebook' ? 'Facebook User' : 'Apple ID User'}`,
                role: 'CUSTOMER',
                provider
            },
            isOffline: true
        };
        AuthService.saveSession(session);
        return { success: true, ...session };
    },

    // UC01: Đổi mật khẩu
    changePassword: async (email: string, oldPass: string, newPass: string): Promise<{ success: boolean; error?: string }> => {
        const cleanEmail = email.trim().toLowerCase();
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);
            const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: cleanEmail, oldPassword: oldPass, newPassword: newPass }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (res.ok) {
                const data = await res.json();
                return data;
            }
        } catch (_) {}

        // Offline logic: Kiểm tra tài khoản mẫu hoặc tài khoản offline
        const mockAccounts: Record<string, string> = {
            'customer@test.com': '123',
            'sales@test.com': '123',
            'warehouse@test.com': '123',
            'seller@test.com': '123',
            'admin@test.com': '123',
            'testkhach@gmail.com': '123'
        };

        if (mockAccounts[cleanEmail]) {
            if (oldPass !== mockAccounts[cleanEmail] && oldPass !== 'password123') {
                return { success: false, error: 'Mật khẩu hiện tại không chính xác' };
            }
            return { success: true };
        }

        try {
            const rawUsers = localStorage.getItem(STORAGE_OFFLINE_USERS_KEY);
            const offlineUsers: any[] = rawUsers ? JSON.parse(rawUsers) : [];
            const userIndex = offlineUsers.findIndex(u => u.email.toLowerCase() === cleanEmail);
            if (userIndex !== -1) {
                if (offlineUsers[userIndex].password !== oldPass) {
                    return { success: false, error: 'Mật khẩu hiện tại không chính xác' };
                }
                offlineUsers[userIndex].password = newPass;
                localStorage.setItem(STORAGE_OFFLINE_USERS_KEY, JSON.stringify(offlineUsers));
                return { success: true };
            }
        } catch (_) {}

        return { success: true };
    }
};