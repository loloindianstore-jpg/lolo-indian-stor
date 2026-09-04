import React, { useState, useEffect } from 'react';
import { Product, CartItem, UserAccount, Assistant, DiscountSettings } from './types';
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
import { AuthModal } from './components/AuthModal';
import { AssistantsModal } from './components/AssistantsModal';
import { DiscountBar } from './components/DiscountBar';
import { PRESET_IMAGES } from './data/categories';
import { CheckCircle2, ShoppingBag } from 'lucide-react';

const OWNER_EMAIL = 'lolo.indian.store@gmail.com';

export default function App() {
  // 1. Current Authenticated User & Roles
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('lulu_current_user');
      if (saved) return JSON.parse(saved);
      // Default to personal owner account for the store owner
      return {
        email: OWNER_EMAIL,
        role: 'owner',
        name: 'مالكة المتجر (لولو)',
      };
    } catch {
      return {
        email: OWNER_EMAIL,
        role: 'owner',
        name: 'مالكة المتجر (لولو)',
      };
    }
  });

  // 2. Appointed Assistants List
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

  // 3. Discount Settings (زر يمكن تفعيله والغاؤه)
  const [discount, setDiscount] = useState<DiscountSettings>(() => {
    try {
      const saved = localStorage.getItem('lulu_store_discount');
      if (saved) return JSON.parse(saved);
      return {
        isEnabled: false,
        percentage: 15,
        title: 'عروض وخصومات حصرية لفترة محدودة ✨',
      };
    } catch {
      return {
        isEnabled: false,
        percentage: 15,
        title: 'عروض وخصومات حصرية لفترة محدودة ✨',
      };
    }
  });

  // 4. Products list (starts without products as requested)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('lulu_store_products');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
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

  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAssistantsModalOpen, setIsAssistantsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'categories' | 'add' | 'cart' | 'account'>('home');
  const [sharedCartImportedNotice, setSharedCartImportedNotice] = useState<string | null>(null);

  // Determine if current user can add products:
  // "وايقونة اضافة منتج لاتظهر لدى العملاء فقط حسابي الشخصي واضافة ميزة تعيين مساعد يمكنه اضافة منتجات"
  const isOwner = currentUser?.role === 'owner';
  const isAuthorizedAssistant =
    currentUser?.role === 'assistant' &&
    assistants.some(
      (a) =>
        a.email.toLowerCase() === currentUser.email.toLowerCase() &&
        a.canAddProducts
    );
  const canAddProducts = Boolean(isOwner || isAuthorizedAssistant);

  // Persistence effects
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('lulu_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('lulu_current_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('lulu_store_assistants', JSON.stringify(assistants));
    } catch (e) {
      console.error(e);
    }
  }, [assistants]);

  useEffect(() => {
    try {
      localStorage.setItem('lulu_store_discount', JSON.stringify(discount));
    } catch (e) {
      console.error(e);
    }
  }, [discount]);

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

  // Check URL for shared cart parameter on mount
  // "مع وجود رابط لكل سلة يمكن مشاركتها"
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const cartParam = url.searchParams.get('cart');
      if (cartParam) {
        // Decode base64
        const decodedJson = decodeURIComponent(escape(atob(cartParam)));
        const parsedItems = JSON.parse(decodedJson);

        if (Array.isArray(parsedItems) && parsedItems.length > 0) {
          const newCartItems: CartItem[] = [];
          const newProductsToAdd: Product[] = [];

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

            // Ensure product is also added to product store if missing
            if (!products.some((p) => p.id === product.id)) {
              newProductsToAdd.push(product);
            }
          });

          setCart(newCartItems);
          if (newProductsToAdd.length > 0) {
            setProducts((prev) => [...newProductsToAdd, ...prev]);
          }

          setSharedCartImportedNotice(
            `تم استيراد سلة المشتريات المشتركة بنجاح! تحتوي على (${newCartItems.length}) منتجات.`
          );
          setIsCartOpen(true);

          // Clean url
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

  // Assistant handlers
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

  // Add / Edit Product
  const handleSaveProduct = (
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
      };
      setProducts((prev) => [newProduct, ...prev]);
    }
    setProductToEdit(null);
  };

  const handleAddSampleProduct = (preset: typeof PRESET_IMAGES[0]) => {
    const newProduct: Product = {
      id: 'prod_' + Date.now(),
      title: preset.title,
      category: preset.category,
      price: preset.price,
      imageUrl: preset.url,
      description: preset.description,
      createdAt: Date.now(),
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.product.id !== id));
  };

  // Cart operations
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

  // Navigation tab
  const handleNavigate = (tab: 'home' | 'categories' | 'add' | 'cart' | 'account') => {
    setActiveTab(tab);
    if (tab === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'categories') {
      const el = document.getElementById('categories-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'add') {
      if (canAddProducts) {
        setProductToEdit(null);
        setIsAddModalOpen(true);
      } else {
        setIsAuthModalOpen(true);
      }
    } else if (tab === 'cart') {
      setIsCartOpen(true);
    } else if (tab === 'account') {
      setIsAuthModalOpen(true);
    }
  };

  const totalCartCount = cart.reduce((sum, it) => sum + it.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C1E18] flex flex-col selection:bg-[#34533F] selection:text-white pb-24">
      {/* 1. Top Iraq Delivery Banner */}
      <TopBanner />

      {/* Shared Cart Imported Banner Notification */}
      {sharedCartImportedNotice && (
        <div className="bg-[#34533F] text-white py-2.5 px-4 text-center text-xs sm:text-sm font-bold flex items-center justify-center gap-2 animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-4 h-4 text-green-300 shrink-0" />
          <span>{sharedCartImportedNotice}</span>
        </div>
      )}

      {/* 2. Header with Role Awareness & Conditional Add Button */}
      <Header
        cartCount={totalCartCount}
        currentUser={currentUser}
        canAddProducts={canAddProducts}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAddProduct={() => {
          setProductToEdit(null);
          setIsAddModalOpen(true);
        }}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenAssistants={() => setIsAssistantsModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-xl mx-auto px-4 sm:px-6 py-4 space-y-5">
        {/* Discount Control Bar & Shopper Banner (زر تفعيل وإلغاء الخصومات) */}
        <DiscountBar
          discount={discount}
          onUpdateDiscount={setDiscount}
          isOwnerOrAssistant={canAddProducts}
        />

        {/* Search Bar */}
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        {/* Hero Banner matching screenshot */}
        <HeroBanner
          hasProducts={products.length > 0}
          canAddProducts={canAddProducts}
          onAddProduct={() => {
            setProductToEdit(null);
            setIsAddModalOpen(true);
          }}
          onExplore={() => {
            const el = document.getElementById('products-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Categories Grid matching screenshot */}
        <section id="categories-section" className="scroll-mt-20">
          <CategoriesGrid
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </section>

        {/* Products Section */}
        <ProductSection
          products={products}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          discount={discount}
          canAddProducts={canAddProducts}
          onAddToCart={handleAddToCart}
          onEdit={(product) => {
            setProductToEdit(product);
            setIsAddModalOpen(true);
          }}
          onDelete={handleDeleteProduct}
          onViewDetails={setSelectedProductDetail}
          onOpenAddModal={() => {
            setProductToEdit(null);
            setIsAddModalOpen(true);
          }}
          onAddSampleProduct={handleAddSampleProduct}
        />
      </main>

      {/* Add / Edit Product Modal - ONLY accessible by Authorized users */}
      {canAddProducts && (
        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setProductToEdit(null);
          }}
          onSaveProduct={handleSaveProduct}
          productToEdit={productToEdit}
        />
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductDetail}
        discount={discount}
        onClose={() => setSelectedProductDetail(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Shopping Cart Drawer with Share Link and Discount Support */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        discount={discount}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />

      {/* Email Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLogin={setCurrentUser}
        onLogout={() =>
          setCurrentUser({
            email: 'guest@lulu-shop.com',
            role: 'customer',
            name: 'زائرة المتجر',
          })
        }
        ownerEmail={OWNER_EMAIL}
        assistants={assistants}
      />

      {/* Assistants Management Modal (Owner Only) */}
      <AssistantsModal
        isOpen={isAssistantsModalOpen}
        onClose={() => setIsAssistantsModalOpen(false)}
        assistants={assistants}
        onAddAssistant={handleAddAssistant}
        onRemoveAssistant={handleRemoveAssistant}
        onTogglePermission={handleToggleAssistantPermission}
      />

      {/* Modern Bottom Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        cartCount={totalCartCount}
        canAddProducts={canAddProducts}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
