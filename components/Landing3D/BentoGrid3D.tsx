import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Box, Sparkles, Fingerprint, Lock, Unlock, Cpu, Zap, ArrowRight, CheckCircle2, Bot, Layers, Move3d } from 'lucide-react';

interface BentoGrid3DProps {
  onProductClick: (id: string) => void;
  onEnterStore: () => void;
}

const BentoGrid3D: React.FC<BentoGrid3DProps> = ({ onProductClick, onEnterStore }) => {
  // Biometric Vault interactive state
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // Mini 3D Product Canvas Ref
  const miniCanvasRef = useRef<HTMLDivElement>(null);
  const [productWireframe, setProductWireframe] = useState(false);
  const [productColor, setProductColor] = useState<string>('#3b82f6');

  // Trigger biometric scan
  const handleTriggerScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setIsVaultUnlocked(!isVaultUnlocked);
    }, 1200);
  };

  // Mini 3D Product Viewer (Rotating Luxury Gem/Polyhedron Pedestal)
  useEffect(() => {
    const container = miniCanvasRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = 240;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.5, 6.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.replaceChildren(renderer.domElement);

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambient);

    const pLight = new THREE.PointLight(0x06b6d4, 30, 20);
    pLight.position.set(5, 5, 5);
    scene.add(pLight);

    const pLight2 = new THREE.PointLight(0xec4899, 25, 20);
    pLight2.position.set(-5, -3, 3);
    scene.add(pLight2);

    // Pedestal Base
    const pedestalGeo = new THREE.CylinderGeometry(2.4, 2.8, 0.3, 32);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      metalness: 0.9,
      roughness: 0.1,
      wireframe: productWireframe,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -1.6;
    scene.add(pedestal);

    // Main Product: Floating Luxury Dodecahedron Diamond
    const productGeo = new THREE.DodecahedronGeometry(1.6, 0);
    const productMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(productColor),
      metalness: 0.85,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe: productWireframe,
      transparent: true,
      opacity: 0.9,
    });
    const productMesh = new THREE.Mesh(productGeo, productMat);
    scene.add(productMesh);

    // Orbit Ring
    const ringGeo = new THREE.TorusGeometry(2.5, 0.04, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    scene.add(ring);

    // Drag-to-rotate interaction
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      productMesh.rotation.y += deltaX * 0.01;
      productMesh.rotation.x += deltaY * 0.01;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (!isDragging) {
        productMesh.rotation.y += 0.01;
        ring.rotation.z += 0.015;
      }
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
      pedestalGeo.dispose();
      productGeo.dispose();
      ringGeo.dispose();
    };
  }, [productWireframe, productColor]);

  return (
    <section id="bento-section" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <Layers className="w-3.5 h-3.5" />
          Kiến Trúc Tương Tác Bento 3D
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
          Hội Tụ Công Nghệ &amp; Trải Nghiệm Không Gian
        </h2>
        <p className="text-gray-400 text-sm sm:text-base font-light">
          Mỗi chi tiết đều được tối ưu hóa cho trải nghiệm mượt mà, từ trực quan hóa vật thể 3D đến xử lý thanh toán vi mô.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Card 1: 3D Product Interactive Viewer (Col span 2) */}
        <div className="md:col-span-2 lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 hover:border-cyan-500/40 backdrop-blur-xl transition-all duration-300 shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Move3d className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    Trực Quan Hóa Sản Phẩm 3D
                  </h3>
                  <p className="text-xs text-gray-400">Kéo chuột để xoay 360 độ trực tiếp trong không gian</p>
                </div>
              </div>
              <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                Interactive Canvas
              </span>
            </div>

            {/* 3D Mini Viewport */}
            <div className="relative w-full h-60 rounded-2xl bg-black/50 border border-white/10 overflow-hidden my-4 flex items-center justify-center cursor-grab active:cursor-grabbing">
              <div ref={miniCanvasRef} className="w-full h-full" />
              <div className="absolute bottom-3 left-3 text-[10px] font-mono text-gray-400 bg-black/60 px-2 py-1 rounded-md border border-white/10 pointer-events-none">
                360° Free Orbit • Drag to inspect
              </div>
            </div>

            {/* Controls for 3D Product */}
            <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-mono">Màu:</span>
                <button
                  onClick={() => setProductColor('#3b82f6')}
                  className={`w-5 h-5 rounded-full bg-blue-500 border-2 ${productColor === '#3b82f6' ? 'border-white scale-110' : 'border-transparent'}`}
                />
                <button
                  onClick={() => setProductColor('#ec4899')}
                  className={`w-5 h-5 rounded-full bg-pink-500 border-2 ${productColor === '#ec4899' ? 'border-white scale-110' : 'border-transparent'}`}
                />
                <button
                  onClick={() => setProductColor('#10b981')}
                  className={`w-5 h-5 rounded-full bg-emerald-500 border-2 ${productColor === '#10b981' ? 'border-white scale-110' : 'border-transparent'}`}
                />
              </div>

              <button
                onClick={() => setProductWireframe(!productWireframe)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                  productWireframe ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-white/5 text-gray-400 border-white/10'
                }`}
              >
                {productWireframe ? 'Khung Dây' : 'Khối Đầy Đủ'}
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-400 block">Sản phẩm mẫu ZShop</span>
              <span className="text-sm font-bold text-white">Dior Luxury Spatial Edition</span>
            </div>
            <button
              onClick={() => onProductClick('DIOR-TSHIRT-001')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-xs font-bold text-white flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all hover:scale-105"
            >
              <span>Xem Sản Phẩm</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: Quantum Settlement Gateway (0.02s) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 hover:border-blue-500/40 backdrop-blur-xl transition-all duration-300 shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex flex-col justify-between group">
          <div>
            <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 w-fit mb-4">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors mb-2">
              Khớp Lệnh Lượng Tử
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              Hệ thống xử lý thanh toán đa kênh VietQR, MoMo, Visa với độ trễ cực thấp gần như tức thì.
            </p>

            {/* Latency Meter Graphic */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-gray-400">VietQR Quốc Gia</span>
                <span className="text-cyan-400 font-bold">12ms</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full w-[95%] rounded-full animate-pulse" />
              </div>

              <div className="flex items-center justify-between text-xs font-mono pt-1">
                <span className="text-gray-400">Ví MoMo &amp; ZaloPay</span>
                <span className="text-pink-400 font-bold">18ms</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-full w-[88%] rounded-full" />
              </div>

              <div className="flex items-center justify-between text-xs font-mono pt-1">
                <span className="text-gray-400">Visa / Mastercard</span>
                <span className="text-emerald-400 font-bold">24ms</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full w-[82%] rounded-full" />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-gray-400">
            <span>Uptime: 99.999%</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Live Active
            </span>
          </div>
        </div>

        {/* Card 3: Military-Grade Biometric & ZK Vault */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 hover:border-purple-500/40 backdrop-blur-xl transition-all duration-300 shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 w-fit">
                <Fingerprint className="w-6 h-6" />
              </div>
              <button
                onClick={handleTriggerScan}
                className={`p-2 rounded-xl border transition-all ${
                  isScanning
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : isVaultUnlocked
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                }`}
                title="Click để quét vân tay"
              >
                {isScanning ? (
                  <Sparkles className="w-4 h-4 animate-spin" />
                ) : isVaultUnlocked ? (
                  <Unlock className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Lock className="w-4 h-4 text-purple-400" />
                )}
              </button>
            </div>

            <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors mb-2">
              Két Bảo Mật Chuẩn ZK
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              Bảo vệ thông tin thanh toán bằng chứng chỉ không kiến thức (Zero-Knowledge) và sinh trắc học.
            </p>

            {/* Interactive Vault Display */}
            <div
              onClick={handleTriggerScan}
              className={`p-4 rounded-2xl border transition-all cursor-pointer text-center ${
                isScanning
                  ? 'bg-cyan-950/30 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                  : isVaultUnlocked
                  ? 'bg-emerald-950/30 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                  : 'bg-black/40 border-white/5 hover:border-purple-500/40'
              }`}
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-2">
                <Fingerprint
                  className={`w-7 h-7 transition-colors ${
                    isScanning
                      ? 'text-cyan-400 animate-pulse'
                      : isVaultUnlocked
                      ? 'text-emerald-400'
                      : 'text-purple-400'
                  }`}
                />
              </div>
              <span className="text-xs font-mono font-semibold block text-white">
                {isScanning ? 'Đang xác thực sinh trắc học...' : isVaultUnlocked ? 'ĐÃ GIẢI MÃ TOKEN AN TOÀN' : 'Chạm để quét xác thực'}
              </span>
              <span className="text-[10px] text-gray-400 font-mono">
                {isVaultUnlocked ? 'Hash: 0x7f4a...92b3 (Verified)' : 'AES-256 GCM • Hardware Enclave'}
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-gray-400">
            <span>PCI-DSS Tier 1</span>
            <span className="text-purple-400">Tokenized</span>
          </div>
        </div>

        {/* Card 4: AI Shopping Assistant ZShop Copilot */}
        <div className="md:col-span-2 lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 hover:border-fuchsia-500/40 backdrop-blur-xl transition-all duration-300 shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex flex-col justify-between group">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="p-2.5 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-400">
                <Bot className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-fuchsia-300 transition-colors">
                  Trợ Lý Mua Sắm AI Studio Copilot
                </h3>
                <p className="text-xs text-gray-400">Tư vấn phối đồ, kiểm tra kích cỡ thông minh qua Gemini API</p>
              </div>
            </div>

            {/* Simulated Chat Dialogue */}
            <div className="space-y-2.5 my-4">
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-xs text-gray-300 w-fit max-w-[85%]">
                <span className="text-[10px] font-mono text-gray-500 block mb-0.5">Khách hàng</span>
                "Tư vấn cho tôi áo thun Dior phối cùng giày sneaker cho sự kiện công nghệ tuần này?"
              </div>

              <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-950/40 to-fuchsia-950/40 border border-fuchsia-500/20 text-xs text-gray-200 ml-auto max-w-[88%] shadow-md">
                <span className="text-[10px] font-mono text-fuchsia-400 flex items-center gap-1 mb-0.5">
                  <Sparkles className="w-3 h-3" /> ZShop AI Copilot
                </span>
                "Gợi ý hoàn hảo: Áo thun Dior Oblique Oversized kết hợp cùng Sneaker Nam Cao Cấp và voucher giảm 20.000đ khi thanh toán qua VietQR tức thì!"
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> Tích hợp Gemini 2.5 Flash
            </span>
            <button
              onClick={onEnterStore}
              className="text-xs font-semibold text-fuchsia-400 hover:text-fuchsia-300 flex items-center gap-1 transition-colors"
            >
              <span>Thử trò chuyện ngay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 5: Spatial Commerce & Multi-Platform */}
        <div className="md:col-span-1 lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 hover:border-cyan-500/40 backdrop-blur-xl transition-all duration-300 shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex flex-col justify-between group">
          <div>
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 w-fit mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
              Sẵn Sàng Cho Mọi Thiết Bị &amp; VR
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              Tương thích hoàn hảo từ màn hình UltraWide 4K, laptop, điện thoại di động đến kính thực tế ảo Apple Vision &amp; Meta Quest.
            </p>

            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-2">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-cyan-400 font-bold block">120 FPS</span>
                <span className="text-[10px] text-gray-400">Mượt Mà</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-purple-400 font-bold block">&lt; 150KB</span>
                <span className="text-[10px] text-gray-400">Bundle Size</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-emerald-400 font-bold block">100%</span>
                <span className="text-[10px] text-gray-400">Responsive</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
            <span>Hardware Accelerated</span>
            <span className="text-cyan-400">Three.js + Vite</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BentoGrid3D;
