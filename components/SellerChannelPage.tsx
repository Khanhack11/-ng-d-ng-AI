import React, { useState } from 'react';
import { ArrowLeft, Package, DollarSign, Store, TrendingUp, Plus, Edit, Trash2, CheckCircle, Clock } from 'lucide-react';
import { SanPhamAdminService } from '../services';

interface SellerChannelPageProps {
  onBack: () => void;
  onRequestApproval?: (shopInfo: any) => void;
  shopStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  userRole?: string;
  initialTab?: TabType;
}

type TabType = 'overview' | 'products' | 'orders' | 'profile';

const SellerChannelPage: React.FC<SellerChannelPageProps> = ({ onBack, onRequestApproval, shopStatus, userRole, initialTab }) => {
  const isActuallySeller = userRole === 'SELLER' || shopStatus === 'APPROVED';
  const [activeTab, setActiveTab] = useState<TabType>(initialTab || (isActuallySeller ? 'overview' : 'profile'));

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // DB data for Products
  const [products, setProducts] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<any>(null);
  const [newProduct, setNewProduct] = useState({
      name: '', price: 0, stock: 0, category: 'Thời trang', image_url: ''
  });

  // Approval Request State for the UI
  const [approvalStatus, setApprovalStatus] = useState<'Chưa gửi' | 'Đã gửi'>(shopStatus === 'PENDING' ? 'Đã gửi' : 'Chưa gửi');

  // Shop Profile State
  const [shopInfo, setShopInfo] = useState({
      name: 'Cửa hàng ZS-Economy Demo',
      description: 'Chuyên cung cấp các mặt hàng thời trang và phụ kiện chất lượng cao.',
      phone: '0123456789',
      avatar: '' // URL hoặc Base64
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Kiểm tra dung lượng file (2MB = 2,097,152 bytes)
      if (file.size > 2 * 1024 * 1024) {
          alert('Dung lượng ảnh quá lớn! Vui lòng chọn ảnh dưới 2MB.');
          if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
          return;
      }

      const imageUrl = URL.createObjectURL(file);
      setShopInfo(prev => ({ ...prev, avatar: imageUrl }));
  };
  
  const handleSendApproval = () => {
      if (!shopInfo.name || !shopInfo.phone) {
          alert('Vui lòng nhập đầy đủ tên Shop và số điện thoại liên hệ!');
          return;
      }
      setApprovalStatus('Đã gửi');
      if (onRequestApproval) {
          onRequestApproval({ shopName: shopInfo.name });
      }
      alert('Đã gửi yêu cầu xét duyệt cửa hàng thành công đến Admin. Thông tin cửa hàng của bạn sẽ được xem xét trong vòng 24h!');
  };

  React.useEffect(() => {
    if (activeTab === 'products' || activeTab === 'overview') {
        loadProducts();
    }
  }, [activeTab]);

  const loadProducts = async () => {
      const data = await SanPhamAdminService.layTatCaSanPham();
      setProducts(data);
  };

  const handleDeleteProduct = async (id: any) => {
      if (confirm('Bạn có chắc xoá vĩnh viễn sản phẩm này khỏi cửa hàng?')) {
          await SanPhamAdminService.xoaSanPham(id);
          loadProducts();
      }
  };

  const handleSaveProduct = async () => {
      if (!newProduct.name || newProduct.price <= 0) return alert('Vui lòng điền tên và giá hợp lệ!');
      
      if (editingProductId) {
          const success = await SanPhamAdminService.capNhatSanPham(editingProductId, newProduct);
          if (success) {
              alert("Sản phẩm đã được cập nhật thành công vào CSDL!");
              loadProducts();
          } else {
              alert("Lỗi khi cập nhật sản phẩm vào CSDL!");
          }
      } else {
          const success = await SanPhamAdminService.themMoiSanPham(newProduct);
          if (success) {
              alert("Đã thêm sản phẩm mới vào CSDL!");
              loadProducts();
          } else {
              alert("Lỗi khi thêm sản phẩm mới!");
          }
      }
      
      setShowAddModal(false);
      setNewProduct({ name: '', price: 0, stock: 0, category: 'Thời trang', image_url: '' });
      setEditingProductId(null);
  };

  const handleOpenEdit = (p: any) => {
      setEditingProductId(p.id);
      setNewProduct({ 
          name: p.name, 
          price: p.price, 
          stock: p.stock, 
          category: p.category || 'Thời trang', 
          image_url: p.image_url || p.image || '' 
      });
      setShowAddModal(true);
  };

  // Mock data for Orders  
  const [orders, setOrders] = useState([
    { id: 'ORD-001', customer: 'Nguyễn Văn A', total: 300000, status: 'pending', date: '2026-03-26' },
    { id: 'ORD-002', customer: 'Trần Thị B', total: 550000, status: 'shipping', date: '2026-03-25' },
    { id: 'ORD-003', customer: 'Lê Văn C', total: 150000, status: 'completed', date: '2026-03-24' },
  ]);

  const handleConfirmOrder = (id: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: 'shipping' } : o));
    alert('Đã xác nhận đơn hàng thành công!');
  };

  const renderOverview = () => (
    <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Tổng quan Shop</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3">
                    <DollarSign size={24} />
                </div>
                <div className="text-sm text-gray-500 font-medium mb-1">Doanh thu hôm nay</div>
                <div className="text-2xl font-bold text-gray-900">2.450.000₫</div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-3">
                    <Clock size={24} />
                </div>
                <div className="text-sm text-gray-500 font-medium mb-1">Đơn chờ xác nhận</div>
                <div className="text-2xl font-bold text-gray-900">12</div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-3">
                    <Package size={24} />
                </div>
                <div className="text-sm text-gray-500 font-medium mb-1">Sản phẩm sắp hết</div>
                <div className="text-2xl font-bold text-gray-900">3</div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-3">
                    <TrendingUp size={24} />
                </div>
                <div className="text-sm text-gray-500 font-medium mb-1">Lượt truy cập</div>
                <div className="text-2xl font-bold text-gray-900">1,245</div>
            </div>
        </div>

        <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-sm mt-8">
            <h3 className="font-bold text-gray-800 mb-4">Việc cần làm</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="cursor-pointer hover:bg-gray-50 p-4 rounded-lg">
                    <div className="text-xl font-bold text-brand-600">12</div>
                    <div className="text-sm text-gray-500 mt-1">Chờ xác nhận</div>
                </div>
                <div className="cursor-pointer hover:bg-gray-50 p-4 rounded-lg">
                    <div className="text-xl font-bold text-brand-600">5</div>
                    <div className="text-sm text-gray-500 mt-1">Chờ lấy hàng</div>
                </div>
                <div className="cursor-pointer hover:bg-gray-50 p-4 rounded-lg">
                    <div className="text-xl font-bold text-red-500">2</div>
                    <div className="text-sm text-gray-500 mt-1">Đơn hủy/hoàn</div>
                </div>
                <div className="cursor-pointer hover:bg-gray-50 p-4 rounded-lg">
                    <div className="text-xl font-bold text-orange-500">3</div>
                    <div className="text-sm text-gray-500 mt-1">Sản phẩm hết hàng</div>
                </div>
            </div>
        </div>
    </div>
  );

  const renderProducts = () => (
    <div className="animate-fade-in relative min-h-[400px]">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Quản lý Sản Phẩm</h2>
            <button 
                onClick={() => {
                    setEditingProductId(null);
                    setNewProduct({ name: '', price: 0, stock: 0, category: 'Thời trang', image_url: '' });
                    setShowAddModal(true);
                }}
                className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors"
            >
                <Plus size={16} /> Thêm sản phẩm mới
            </button>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-600 font-medium">
                        <tr>
                            <th className="px-6 py-4">Sản phẩm</th>
                            <th className="px-6 py-4">Giá bán</th>
                            <th className="px-6 py-4">Tồn kho</th>
                            <th className="px-6 py-4 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map(p => (
                            <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                                    {p.image_url ? (
                                        <img src={p.image_url} alt="" className="w-10 h-10 object-cover rounded border border-gray-200" />
                                    ) : (
                                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                                            <Package size={16} />
                                        </div>
                                    )}
                                    <span className="line-clamp-2 max-w-[200px]">{p.name}</span>
                                </td>
                                <td className="px-6 py-4 text-brand-600 font-bold">{p.price.toLocaleString()}₫</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {p.stock > 0 ? p.stock : 'Hết hàng'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-3">
                                    <button onClick={() => handleOpenEdit(p)} className="text-blue-500 hover:text-blue-700" title="Sửa"><Edit size={18} /></button>
                                    <button onClick={() => handleDeleteProduct(p.id)} className="text-red-500 hover:text-red-700" title="Xóa"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                                    Chưa có sản phẩm nào. Hãy bấm Thêm sản phẩm mới.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Modal Thêm Mới Sản Phẩm */}
        {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 transform transition-all">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800">{editingProductId ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Mới Sản Phẩm'}</h3>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-1 block">Tên sản phẩm *</label>
                            <input 
                                type="text" 
                                value={newProduct.name} 
                                onChange={e => setNewProduct({...newProduct, name: e.target.value})} 
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-shadow" 
                                placeholder="Nhập tên sản phẩm..."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-700 mb-1 block">Giá bán (VNĐ) *</label>
                                <input 
                                    type="number" 
                                    value={newProduct.price || ''} 
                                    onChange={e => setNewProduct({...newProduct, price: +e.target.value})} 
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500" 
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-700 mb-1 block">Tồn kho *</label>
                                <input 
                                    type="number" 
                                    value={newProduct.stock || ''} 
                                    onChange={e => setNewProduct({...newProduct, stock: +e.target.value})} 
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500" 
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-1 block">Link Hình Ảnh (URL)</label>
                            <div className="flex gap-2 items-start">
                                <input 
                                    type="text" 
                                    value={newProduct.image_url} 
                                    onChange={e => setNewProduct({...newProduct, image_url: e.target.value})} 
                                    placeholder="https://... (.jpg, .png)" 
                                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm" 
                                />
                                {newProduct.image_url && (
                                   <img src={newProduct.image_url} className="w-10 h-10 rounded border border-gray-200 object-cover shrink-0 bg-gray-50" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                        <button 
                            onClick={() => setShowAddModal(false)} 
                            className="px-5 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 text-sm font-semibold transition-colors"
                        >
                            Đóng
                        </button>
                        <button 
                            onClick={handleSaveProduct} 
                            className="px-5 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
                        >
                            {editingProductId ? 'Lưu cập nhật' : 'Đăng bán ngay'}
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );

  const renderOrders = () => (
    <div className="animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Quản lý Đơn Hàng</h2>

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-600 font-medium">
                        <tr>
                            <th className="px-6 py-4">Mã đơn</th>
                            <th className="px-6 py-4">Khách hàng</th>
                            <th className="px-6 py-4">Ngày đặt</th>
                            <th className="px-6 py-4">Tổng tiền</th>
                            <th className="px-6 py-4">Trạng thái</th>
                            <th className="px-6 py-4 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.map(o => (
                            <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{o.id}</td>
                                <td className="px-6 py-4 text-gray-600">{o.customer}</td>
                                <td className="px-6 py-4 text-gray-500">{o.date}</td>
                                <td className="px-6 py-4 text-brand-600 font-bold">{o.total.toLocaleString()}₫</td>
                                <td className="px-6 py-4">
                                    {o.status === 'pending' && <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold">Chờ xác nhận</span>}
                                    {o.status === 'shipping' && <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">Đang giao</span>}
                                    {o.status === 'completed' && <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Hoàn thành</span>}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {o.status === 'pending' ? (
                                        <button 
                                            onClick={() => handleConfirmOrder(o.id)}
                                            className="bg-brand-600 text-white px-3 py-1.5 rounded hover:bg-brand-700 text-xs font-bold flex items-center gap-1 ml-auto"
                                        >
                                            <CheckCircle size={14} /> Xác nhận
                                        </button>
                                    ) : (
                                        <button className="text-gray-500 hover:text-brand-600 text-xs underline">Xem chi tiết</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );

  const renderProfile = () => (
    <div className="animate-fade-in max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Hồ sơ Shop</h2>

        {/* --- KHU VỰC THÔNG BÁO XÉT DUYỆT --- */}
        {shopStatus !== 'APPROVED' && (
            <div className={`p-4 rounded-xl border mb-6 flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4 ${approvalStatus === 'Chưa gửi' ? 'bg-orange-50 border-orange-200' : 'bg-blue-50 border-blue-200'}`}>
                <div>
                    <h3 className={`font-bold ${approvalStatus === 'Chưa gửi' ? 'text-orange-800' : 'text-blue-800'}`}>
                        Trạng thái kiểm duyệt: {approvalStatus === 'Chưa gửi' ? 'Chưa được phê duyệt' : 'Đang chờ Admin xử lý'}
                    </h3>
                    <p className={`text-sm mt-1 ${approvalStatus === 'Chưa gửi' ? 'text-orange-600' : 'text-blue-600'}`}>
                        {approvalStatus === 'Chưa gửi' ? 
                         'Cửa hàng của bạn đang bị giới hạn hiển thị. Hãy cập nhật đầy đủ thông tin và gửi yêu cầu để Ban Quản Trị phê duyệt.' : 
                         'Yêu cầu của bạn đang nằm trong danh sách chờ duyệt của Admin. Vui lòng kiên nhẫn.'}
                    </p>
                </div>
                {approvalStatus === 'Chưa gửi' && (
                    <button 
                        onClick={handleSendApproval}
                        className="shrink-0 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 text-sm font-bold shadow-sm rounded-lg transition-colors"
                    >
                        Gửi yêu cầu duyệt
                    </button>
                )}
            </div>
        )}

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-6 border-b border-gray-100 pb-6">
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleAvatarChange} 
                    accept="image/*" 
                    className="hidden" 
                />
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-24 h-24 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center text-3xl font-black shrink-0 relative overflow-hidden group cursor-pointer"
                >
                    {shopInfo.avatar ? (
                        <img src={shopInfo.avatar} alt="Shop Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <Store size={40} />
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold">
                        Thay đổi
                    </div>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{shopInfo.name}</h3>
                    <p className="text-sm text-gray-500">Tham gia: 12 tháng trước | Tỉ lệ phản hồi chat: 98%</p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên cửa hàng</label>
                    <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-brand-500 focus:border-brand-500 outline-none" 
                        value={shopInfo.name} 
                        onChange={e => setShopInfo({ ...shopInfo, name: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả cửa hàng</label>
                    <textarea 
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-brand-500 focus:border-brand-500 outline-none h-24" 
                        value={shopInfo.description} 
                        onChange={e => setShopInfo({ ...shopInfo, description: e.target.value })}
                    ></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại hỗ trợ</label>
                    <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-brand-500 focus:border-brand-500 outline-none" 
                        value={shopInfo.phone} 
                        onChange={e => setShopInfo({ ...shopInfo, phone: e.target.value })}
                    />
                </div>
                <div className="pt-4 flex justify-end">
                    <button 
                        className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-md font-medium transition-colors" 
                        onClick={() => alert('Đã lưu thông tin cửa hàng thành công!')}
                    >
                        Lưu thay đổi
                    </button>
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-gray-600 hover:text-brand-600 transition-colors p-1 -ml-1">
                <ArrowLeft size={24} />
            </button>
            <h1 className="text-lg md:text-xl font-bold text-gray-800 hidden sm:block">Kênh Người Bán <span className="text-brand-600 font-bold ml-1">ZS-Economy</span></h1>
            <h1 className="text-lg font-bold text-brand-600 sm:hidden">KNB ZS-Economy</h1>
        </div>
        <div className="flex items-center gap-4">
            <div className="text-sm font-semibold text-gray-600 hidden md:block">
            Chế độ xem: Nhà Bán Hàng
            </div>
            <div className="w-8 h-8 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center">
                <Store size={16} />
            </div>
        </div>
      </header>
      
      <div className="flex-1 flex w-full max-w-[1400px] mx-auto py-6 px-4 gap-6">
        {/* Sidebar Navigation */}
        <aside className="w-64 shrink-0 hidden md:block">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                <div className="p-4 bg-gray-50 border-b border-gray-100">
                    <h3 className="font-bold text-gray-800">Quản lý Shop</h3>
                </div>
                <div className="p-2 space-y-1">
                    {isActuallySeller && (
                        <>
                            <button 
                                onClick={() => setActiveTab('overview')}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg font-medium transition-colors
                                    ${activeTab === 'overview' ? 'text-brand-700 bg-brand-50' : 'text-gray-600 hover:bg-gray-50'}
                                `}
                            >
                                <TrendingUp size={18} className={activeTab === 'overview' ? 'text-brand-600' : 'text-gray-400'} /> Tổng quan
                            </button>
                            <button 
                                onClick={() => setActiveTab('products')}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg font-medium transition-colors
                                    ${activeTab === 'products' ? 'text-brand-700 bg-brand-50' : 'text-gray-600 hover:bg-gray-50'}
                                `}
                            >
                                <Package size={18} className={activeTab === 'products' ? 'text-brand-600' : 'text-gray-400'} /> Sản phẩm
                            </button>
                            <button 
                                onClick={() => setActiveTab('orders')}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg font-medium transition-colors
                                    ${activeTab === 'orders' ? 'text-brand-700 bg-brand-50' : 'text-gray-600 hover:bg-gray-50'}
                                `}
                            >
                                <DollarSign size={18} className={activeTab === 'orders' ? 'text-brand-600' : 'text-gray-400'} /> Đơn hàng
                            </button>
                        </>
                    )}
                    <button 
                        onClick={() => setActiveTab('profile')}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg font-medium transition-colors
                            ${activeTab === 'profile' ? 'text-brand-700 bg-brand-50' : 'text-gray-600 hover:bg-gray-50'}
                        `}
                    >
                        <Store size={18} className={activeTab === 'profile' ? 'text-brand-600' : 'text-gray-400'} /> {isActuallySeller ? 'Hồ sơ Shop' : 'Đăng ký Người bán'}
                    </button>
                </div>
            </div>
        </aside>
        
        {/* Mobile Navigation (Horizontal Scroll) */}
        <div className="md:hidden flex overflow-x-auto gap-2 pb-4 mb-2 fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-40 p-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            {isActuallySeller && (
                <>
                    <button 
                        onClick={() => setActiveTab('overview')}
                        className={`flex-1 flex flex-col items-center justify-center p-2 rounded-lg text-xs font-medium min-w-[70px]
                            ${activeTab === 'overview' ? 'text-brand-600 bg-brand-50' : 'text-gray-500 hover:bg-gray-50'}
                        `}
                    >
                        <TrendingUp size={20} className="mb-1" /> Tổng quan
                    </button>
                    <button 
                        onClick={() => setActiveTab('products')}
                        className={`flex-1 flex flex-col items-center justify-center p-2 rounded-lg text-xs font-medium min-w-[70px]
                            ${activeTab === 'products' ? 'text-brand-600 bg-brand-50' : 'text-gray-500 hover:bg-gray-50'}
                        `}
                    >
                        <Package size={20} className="mb-1" /> Sản phẩm
                    </button>
                    <button 
                        onClick={() => setActiveTab('orders')}
                        className={`flex-1 flex flex-col items-center justify-center p-2 rounded-lg text-xs font-medium min-w-[70px]
                            ${activeTab === 'orders' ? 'text-brand-600 bg-brand-50' : 'text-gray-500 hover:bg-gray-50'}
                        `}
                    >
                        <DollarSign size={20} className="mb-1" /> Đơn hàng
                    </button>
                </>
            )}
            <button 
                onClick={() => setActiveTab('profile')}
                className={`flex-1 flex flex-col items-center justify-center p-2 rounded-lg text-xs font-medium min-w-[70px]
                    ${activeTab === 'profile' ? 'text-brand-600 bg-brand-50' : 'text-gray-500 hover:bg-gray-50'}
                `}
            >
                <Store size={20} className="mb-1" /> {isActuallySeller ? 'Cửa hàng' : 'Đăng ký'}
            </button>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 w-full pb-20 md:pb-0">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'products' && renderProducts()}
            {activeTab === 'orders' && renderOrders()}
            {activeTab === 'profile' && renderProfile()}
        </main>
      </div>
    </div>
  );
};

export default SellerChannelPage;
