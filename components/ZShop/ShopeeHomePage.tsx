import React from 'react';
import Header from './Header';
import HeroBanner from './HeroBanner';
import ProductGrid from './ProductGrid';
import Footer from './Footer';

interface ShopeeHomePageProps {
  onProductClick?: (id: string) => void;
  onOpenCart?: () => void;
  cartItemCount?: number;
  userRole?: string;
  currentUser?: { name?: string; email?: string; role?: string } | null;
  onLogin?: () => void;
  onLogout?: () => void;
  onViewOrders?: () => void;
  onGoToAdmin?: () => void;
  onOpenRegister?: () => void;
  onOpenSellerChannel?: () => void;
  onBecomeSeller?: () => void;
  onOpenLanding3D?: () => void;
  onGoToWarehouse?: () => void;
  onGoToCustomers?: () => void;
  onGoToReturns?: () => void;
  onOpenPOS?: () => void;
  onOpenChangePassword?: () => void;
  onOpenLoyaltyModal?: () => void;
  customerPoints?: number;
  customerTier?: string;
  pendingReturnsCount?: number;
  pendingSellersCount?: number;
  onNavigateAdminTab?: (tab: 'DASHBOARD' | 'ORDERS' | 'PRODUCTS' | 'SELLERS' | 'CONFIG' | 'AI_BI') => void;
  onNavigateCSKH?: (tab?: 'RETURNS' | 'CUSTOMERS' | 'POS' | 'TRACKING') => void;
  onNavigateSeller?: (tab?: 'overview' | 'products' | 'orders' | 'profile') => void;
  onSwitchRole?: (role: any) => void;
  onSwitchWorkspace?: (workspace: any) => void;
}

const ShopeeHomePage: React.FC<ShopeeHomePageProps> = (props) => {
  return (
    <div className="bg-gradient-to-b from-[#C4B49E] via-[#BBA992] to-[#B2A088] min-h-screen font-primary text-[#241F1A]">
      <Header 
        onOpenCart={props.onOpenCart} 
        cartItemCount={props.cartItemCount}
        onLogin={props.onLogin}
        userRole={props.userRole}
        currentUser={props.currentUser}
        onLogout={props.onLogout}
        onOpenRegister={props.onOpenRegister}
        onOpenSellerChannel={props.onOpenSellerChannel}
        onBecomeSeller={props.onBecomeSeller}
        onProductClick={props.onProductClick}
        onOpenLanding3D={props.onOpenLanding3D}
        onGoToAdmin={props.onGoToAdmin}
        onViewOrders={props.onViewOrders}
        onGoToWarehouse={props.onGoToWarehouse}
        onGoToCustomers={props.onGoToCustomers}
        onGoToReturns={props.onGoToReturns}
        onOpenPOS={props.onOpenPOS}
        onOpenChangePassword={props.onOpenChangePassword}
        onOpenLoyaltyModal={props.onOpenLoyaltyModal}
        customerPoints={props.customerPoints}
        customerTier={props.customerTier}
        pendingReturnsCount={props.pendingReturnsCount}
        pendingSellersCount={props.pendingSellersCount}
        onNavigateAdminTab={props.onNavigateAdminTab}
        onNavigateCSKH={props.onNavigateCSKH}
        onNavigateSeller={props.onNavigateSeller}
        onSwitchRole={props.onSwitchRole}
        onSwitchWorkspace={props.onSwitchWorkspace}
      />
      
      <main className="pb-10">
        <HeroBanner />
        <ProductGrid onProductClick={props.onProductClick} />
      </main>

      <Footer />
    </div>
  );
};

export default ShopeeHomePage;
