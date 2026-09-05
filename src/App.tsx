import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Product,
  CartItem,
  UserAccount,
  Assistant,
  DiscountSettings,
  Order,
} from './types';
import { TopBanner } from './components/TopBanner';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { HeroBanner } from './components/HeroBanner';
import { CategoriesGrid } from './components/CategoriesGrid';
import { ProductSection } from './components/ProductSection';
import { AddProductModal } from './components/AddProductModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { BottomNavigation } from './components/BottomNavigation';
import { DiscountBar } from './components/DiscountBar';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { PRESET_IMAGES } from './data/categories';
import { CheckCircle2, ShieldAlert, Heart, X, Sparkles } from 'lucide-react';

const OWNER_EMAIL = 'lolo.indian.store@gmail.com';

export default function App() {
  // Current view: 'store' (public customer storefront) | 'admin' (protected owner dashboard)
  const [currentView, setCurrentView] = useState<'store' | 'admin'>('store');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('lulu_admin_authenticated') === 'true';
    } catch {
      return false;
    }
  });

  // Security redirect toast when unauthorized access to admin route occurs
  const [securityRedirectNotice, setSecurityRedirectNotice] = useState<string | null>(null);

  // 1. Current Authenticated User Account
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('lulu_current_user');
      if (saved) return JSON.parse(saved);
      return {
        email: 'customer@lulu-shop.com',
        role: 'customer',
        name: 'زبونة المتجر',
      };
    } catch {
      return {
        email: 'customer@lulu-shop.com',
        role: 'customer',
        name: 'زبونة المتجر',
      };
    }
  });

  // 2. Appointed Assistants List (Persisted)
  const [assistants, setAssistants] = useState<Assistant[]>(() => {
    try {
      const saved = localStorage.getItem('lulu_store_assistants');
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'ast_1',
          email: 'sara.assistant@gmail.com',
          name: 'سارة - مساعدة المتجر',
          createdAt: Date.now() - 86400000,
          canAddProducts: true,
        },
      ];
    } catch {
      return [];
    }
  });

  // 3. Discount Settings (Controlled exclusively via Admin Dashboard)
  const [discount, setDiscount] = useState<DiscountSettings>(() => {
    try {
      const saved = localStorage.getItem('lulu_store_discount');
      if (saved) return JSON.parse(saved);
      return {
        isEnabled: true,
        percentage: 15,
        title: 'عروض وتخفيضات حصرية بمناسبة وصول شحنة الهند الجديدة ✨',
      };
    } catch {
      return {
        isEnabled: true,
        percentage: 15,
        title: 'عروض وتخفيضات حصرية بمناسبة وصول شحنة الهند الجديدة ✨',
      };
    }
  });

  // 4. Products list (Preloaded with Indian authentic beauty presets if empty)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('lulu_store_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return PRESET_IMAGES.map((preset, index) => ({
      id: `prod_preset_${index + 1}`,
      title: preset.title,
      category: preset.category,
      price: preset.price,
      imageUrl: preset.url,
      description: preset.description,
      createdAt: Date.now() - index * 3600000,
      rating: 4.9,
      reviewsCount: 38 + index * 14,
      inStock: true,
      isBestSeller: index === 0 || index === 1,
    }));
  });

  // 5. Shopping Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('lulu_store_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 6. Customer Wishlist (Favorites)
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lulu_store_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 7. Store Orders (Persisted so owner can see them in Admin Dashboard)
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('lulu_store_orders');
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'ord_sample_1',
          customerName: 'فاطمة الموسوي',
          customerPhone: '07712345678',
          city: 'بغداد - المنصور',
          notes: 'التوصيل بعد الساعة الرابعة عصراً لطفا',
          items: [
            {
              product: {
                id: 'prod_preset_1',
                title: 'زيت الحشيش الهندي الأصلي',
                category: 'زيوت الشعر',
                price: 25000,
                imageUrl: PRESET_IMAGES[0].url,
                description: PRESET_IMAGES[0].description,
                createdAt: Date.now(),
              },
              quantity: 2,
            },
          ],
          total: 55000,
          discountSavings: 5000,
          createdAt: Date.now() - 3600000 * 5,
          status: 'new',
        },
      ];
    } catch {
      return [];
    }
  });

  // UI state for public customer storefront
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showOnlyWishlist, setShowOnlyWishlist] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [activeBottomNavTab, setActiveBottomNavTab] = useState<'home' | 'categories' | 'deals' | 'wishlist' | 'cart'>('home');
  const [sharedCartImportedNotice, setSharedCartImportedNotice] = useState<string | null>(null);

  // Admin-only modals (Add/Edit Product)
  const [isAdminAddModalOpen, setIsAdminAddModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // ================= ROUTE SECURITY & REDIRECTION GUARD =================
  // "تأمين مسارات اللوحة بحيث لو حاول أي زبون فتح رابط الإدارة إعادة توجيه مباشراً تلقائياً للواجهة الرئيسية للمتجر"
  useEffect(() => {
    const checkRouteAndEnforceSecurity = () => {
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      const isTryingToAccessAdmin =
        hash.includes('admin') ||
        hash.includes('dashboard') ||
        search.includes('admin=true') ||
        search.includes('dashboard=true');

      if (isTryingToAccessAdmin) {
        const authenticated = sessionStorage.getItem('lulu_admin_authenticated') === 'true';
        if (!authenticated) {
          // UNAUTHORIZED ATTEMPT: Automatically redirect to main store interface
          window.location.hash = '';
          const cleanUrl = window.location.pathname;
          window.history.replaceState(null, '', cleanUrl);
          setCurrentView('store');
          setSecurityRedirectNotice(
            '⛔ تم إعادة توجيهك تلقائياً للواجهة الرئيسية: لوحة التحكم مؤمنة ومخصصة لإدارة المتجر فقط بعد تسجيل الدخول المصرح به.'
          );
          setTimeout(() => {
            setSecurityRedirectNotice(null);
          }, 5000);
        } else {
          // Authorized owner session
          setCurrentView('admin');
        }
      } else {
        // Public store route
        if (currentView === 'admin' && !hash.includes('admin')) {
          setCurrentView('store');
        }
      }
    };

    // Check on initial load
    checkRouteAndEnforceSecurity();

    // Listen to hash / URL changes
    window.addEventListener('hashchange', checkRouteAndEnforceSecurity);
    window.addEventListener('popstate', checkRouteAndEnforceSecurity);

    return () => {
      window.removeEventListener('hashchange', checkRouteAndEnforceSecurity);
      window.removeEventListener('popstate', checkRouteAndEnforceSecurity);
    };
  }, [currentView]);

  // Persistence effects
  useEffect(() => {
    try {
      localStorage.setItem('lulu_store_products', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('lulu_store_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('lulu_store_wishlist', JSON.stringify(wishlistIds));
    } catch (e) {
      console.error(e);
    }
  }, [wishlistIds]);

  useEffect(() => {
    try {
      localStorage.setItem('lulu_store_discount', JSON.stringify(discount));
    } catch (e) {
      console.error(e);
    }
  }, [discount]);

  useEffect(() => {
    try {
      localStorage.setItem('lulu_store_assistants', JSON.stringify(assistants));
    } catch (e) {
      console.error(e);
    }
  }, [assistants]);

  useEffect(() => {
    try {
      localStorage.setItem('lulu_store_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  // Check URL for shared cart parameter on mount
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const cartParam = url.searchParams.get('cart');
      if (cartParam) {
        const decodedJson = decodeURIComponent(escape(atob(cartParam)));
        const parsedItems = JSON.parse(decodedJson);

        if (Array.isArray(parsedItems) && parsedItems.length > 0) {
          const newCartItems: CartItem[] = [];
          parsedItems.forEach((it: any) => {
            const product: Product = {
              id: it.id || 'prod_shared_' + Math.random().toString(36).substr(2, 6),
              title: it.title || 'منتج هندي',
              category: it.category || 'العناية',
              price: Number(it.price) || 20000,
              imageUrl: it.imageUrl || '',
              description: it.description || '',
              createdAt: Date.now(),
            };
            newCartItems.push({
              product,
              quantity: Math.max(1, Number(it.q) || 1),
            });
          });

          setCart(newCartItems);
          setSharedCartImportedNotice(
            `تم استيراد سلة المشتريات المشتركة بنجاح! تحتوي على (${newCartItems.length}) منتجات.`
          );
          setIsCartOpen(true);

          url.searchParams.delete('cart');
          window.history.replaceState({}, '', url.toString());

          setTimeout(() => {
            setSharedCartImportedNotice(null);
          }, 6000);
        }
      }
    } catch (e) {
      console.error('Failed to parse shared cart param', e);
    }
  }, []);

  // Customer Cart operations
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handlePlaceOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  // Wishlist toggle
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) =>
      prev.includes(product.id)
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id]
    );
  };

  // Customer Navigation handler
  const handleCustomerNavigate = (tab: 'home' | 'categories' | 'deals' | 'wishlist' | 'cart') => {
    setActiveBottomNavTab(tab);
    if (tab === 'home') {
      setShowOnlyWishlist(false);
      setSelectedCategory(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'categories') {
      setShowOnlyWishlist(false);
      const el = document.getElementById('categories-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'deals') {
      setShowOnlyWishlist(false);
      setSelectedCategory(null);
      const el = document.getElementById('products-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'wishlist') {
      setShowOnlyWishlist((prev) => !prev);
      const el = document.getElementById('products-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'cart') {
      setIsCartOpen(true);
    }
  };

  // Admin Actions (EXCLUSIVE TO ADMIN DASHBOARD)
  const handleOpenAddProduct = () => {
    setProductToEdit(null);
    setIsAdminAddModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setProductToEdit(product);
    setIsAdminAddModalOpen(true);
  };

  const handleSaveProductFromAdmin = (
    data: Omit<Product, 'id' | 'createdAt'>,
    editId?: string
  ) => {
    if (editId) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editId ? { ...p, ...data } : p))
      );
    } else {
      const newProduct: Product = {
        id: 'prod_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        ...data,
        createdAt: Date.now(),
        rating: 5.0,
        reviewsCount: 1,
        inStock: true,
      };
      setProducts((prev) => [newProduct, ...prev]);
    }
    setProductToEdit(null);
    setIsAdminAddModalOpen(false);
  };

  const handleDeleteProductFromAdmin = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.product.id !== id));
    setWishlistIds((prev) => prev.filter((item) => item !== id));
  };

  const handleAddSampleProductFromAdmin = (preset: typeof PRESET_IMAGES[0]) => {
    const newProduct: Product = {
      id: 'prod_' + Date.now(),
      title: preset.title,
      category: preset.category,
      price: preset.price,
      imageUrl: preset.url,
      description: preset.description,
      createdAt: Date.now(),
      rating: 4.9,
      reviewsCount: 24,
      inStock: true,
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  // Assistant management handlers
  const handleAddAssistant = (email: string, name: string, canAdd: boolean) => {
    const newAssistant: Assistant = {
      id: 'ast_' + Date.now(),
      email,
      name,
      canAddProducts: canAdd,
      createdAt: Date.now(),
    };
    setAssistants((prev) => [newAssistant, ...prev]);
  };

  const handleRemoveAssistant = (id: string) => {
    setAssistants((prev) => prev.filter((a) => a.id !== id));
  };

  const handleToggleAssistantPermission = (id: string) => {
    setAssistants((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, canAddProducts: !a.canAddProducts } : a
      )
    );
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  // Switch between views
  const handleLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setIsAdminLoginModalOpen(false);
    setCurrentView('admin');
    window.location.hash = 'admin';
  };

  const handleExitAdmin = () => {
    setCurrentView('store');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoutAdmin = () => {
    sessionStorage.removeItem('lulu_admin_authenticated');
    sessionStorage.removeItem('lulu_admin_auth_time');
    setIsAdminAuthenticated(false);
    setCurrentView('store');
    window.location.hash = '';
  };

  // Filtered products for public display (considers search, category, and wishlist filter)
  const displayProducts = useMemo(() => {
    if (showOnlyWishlist) {
      return products.filter((p) => wishlistIds.includes(p.id));
    }
    return products;
  }, [products, showOnlyWishlist, wishlistIds]);

  const totalCartCount = cart.reduce((sum, it) => sum + it.quantity, 0);

  // ================= VIEW 1: PROTECTED OWNER ADMIN DASHBOARD =================
  if (currentView === 'admin' && isAdminAuthenticated) {
    return (
      <>
        <AdminDashboard
          products={products}
          discount={discount}
          assistants={assistants}
          orders={orders}
          currentUser={currentUser}
          onUpdateDiscount={setDiscount}
          onOpenAddProduct={handleOpenAddProduct}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProductFromAdmin}
          onAddSampleProduct={handleAddSampleProductFromAdmin}
          onAddAssistant={handleAddAssistant}
          onRemoveAssistant={handleRemoveAssistant}
          onToggleAssistantPermission={handleToggleAssistantPermission}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onExitAdmin={handleExitAdmin}
          onLogoutAdmin={handleLogoutAdmin}
        />

        {/* Add/Edit Product Modal - EXCLUSIVELY ACCESSIBLE WITHIN ADMIN */}
        <AddProductModal
          isOpen={isAdminAddModalOpen}
          onClose={() => {
            setIsAdminAddModalOpen(false);
            setProductToEdit(null);
          }}
          onSaveProduct={handleSaveProductFromAdmin}
          productToEdit={productToEdit}
        />
      </>
    );
  }

  // ================= VIEW 2: PUBLIC CUSTOMER STOREFRONT =================
  // Customized purely for Browsing, Viewing, Cart, and Purchasing ONLY
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C1E18] flex flex-col selection:bg-[#34533F] selection:text-white pb-20">
      {/* Security Auto-Redirect Notification (shows if an unauthorized customer tried to access #admin) */}
      {securityRedirectNotice && (
        <div className="sticky top-0 z-50 bg-rose-900 text-rose-100 py-3 px-4 text-center text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg border-b border-rose-700 animate-in slide-in-from-top duration-300">
          <ShieldAlert className="w-5 h-5 text-rose-300 shrink-0" />
          <span className="flex-1 max-w-xl text-right">{securityRedirectNotice}</span>
          <button
            type="button"
            onClick={() => setSecurityRedirectNotice(null)}
            className="p-1 hover:bg-rose-800 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Top Iraq Delivery Banner */}
      <TopBanner />

      {/* Shared Cart Imported Banner Notification */}
      {sharedCartImportedNotice && (
        <div className="bg-[#34533F] text-white py-2.5 px-4 text-center text-xs sm:text-sm font-bold flex items-center justify-center gap-2 animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-4 h-4 text-green-300 shrink-0" />
          <span>{sharedCartImportedNotice}</span>
        </div>
      )}

      {/* 2. Public Header (No Add Product button, No Admin Controls) */}
      <Header
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => {
          setShowOnlyWishlist(true);
          const el = document.getElementById('products-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenSearchFocus={() => {
          const el = document.getElementById('store-search-bar');
          el?.focus();
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }}
        onOpenSupport={() => {
          window.open(
            'https://wa.me/?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D9%85%D8%AA%D8%AC%D8%B1%20%D9%84%D9%88%D9%84%D9%88%20%D8%A7%D9%84%D9%87%D9%86%D8%AF%D9%8A%D8%A9%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%A7%D9%84%D9%85%D9%86%D8%AA%D8%AC%D8%A7%D8%AA',
            '_blank'
          );
        }}
      />

      {/* Main Public Shopping Container */}
      <main className="flex-1 w-full max-w-xl mx-auto px-4 sm:px-6 py-4 space-y-5">
        {/* Public Discount Announcement Banner (No controls or inputs for customers) */}
        <DiscountBar discount={discount} />

        {/* Customer Search Bar */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
        />

        {/* Wishlist Active Filter Banner */}
        {showOnlyWishlist && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-xs text-rose-800 animate-in fade-in">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              <span className="font-bold">عرض المنتجات المفضلة لديكِ ({wishlistIds.length})</span>
            </div>
            <button
              type="button"
              onClick={() => setShowOnlyWishlist(false)}
              className="text-xs font-bold text-rose-700 underline hover:text-rose-900"
            >
              عرض جميع المنتجات
            </button>
          </div>
        )}

        {/* SHEIN-style Hero Shopping Banner (Zero Add Buttons) */}
        {!showOnlyWishlist && (
          <HeroBanner
            discount={discount}
            onExplore={() => {
              const el = document.getElementById('products-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            onExploreDeals={() => {
              const el = document.getElementById('products-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        )}

        {/* Categories Grid */}
        {!showOnlyWishlist && (
          <section id="categories-section" className="scroll-mt-20">
            <CategoriesGrid
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </section>
        )}

        {/* Public Product Section (Zero Add or Edit Buttons on public cards) */}
        <ProductSection
          products={displayProducts}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          discount={discount}
          wishlistIds={wishlistIds}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          onViewDetails={setSelectedProductDetail}
        />
      </main>

      {/* SHEIN-style Footer with Discreet Admin Portal Lock Gate */}
      <Footer onOpenAdminLogin={() => setIsAdminLoginModalOpen(true)} />

      {/* Customer Product Detail Modal (Browsing & Ordering only) */}
      <ProductDetailModal
        product={selectedProductDetail}
        discount={discount}
        onClose={() => setSelectedProductDetail(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Customer Shopping Cart Drawer (Purchasing & Iraq Delivery) */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        discount={discount}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onPlaceOrder={handlePlaceOrder}
      />

      {/* Protected Admin Login Gate Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onSuccessLogin={handleLoginSuccess}
        ownerEmail={OWNER_EMAIL}
      />

      {/* Customer Bottom Navigation (Zero Add Button) */}
      <BottomNavigation
        activeTab={activeBottomNavTab}
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        onNavigate={handleCustomerNavigate}
      />
    </div>
  );
}
