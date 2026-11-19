import React, { useMemo, useState } from 'react';
import { CheckCircle2, FolderPlus, Lock, Plus, UserPlus, X } from 'lucide-react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import POSHeader from './components/POSHeader';
import WeightPanel from './components/WeightPanel';
import CategoryNavigation from './components/CategoryNavigation';
import ProductGrid from './components/ProductGrid';
import CartPanel from './components/CartPanel';
import SummaryCards from './components/SummaryCards';
import ModuleViews from './components/ModuleViews';
import {
  CATEGORIES,
  INITIAL_EXPENSES,
  INITIAL_KHATA_CUSTOMERS,
  INITIAL_SUPPLIERS,
  INITIAL_TRANSACTIONS,
  PRODUCTS,
} from './data/products';
import { useCart } from './hooks/useCart';

export default function App() {
  const [activeModule, setActiveModule] = useState('pos');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSessionLocked, setIsSessionLocked] = useState(false);

  // Catalog & Scale state
  const [products, setProducts] = useState(PRODUCTS);
  const [categories, setCategories] = useState(CATEGORIES);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(PRODUCTS[0].id);
  const [scaleWeightKg, setScaleWeightKg] = useState(2.0);
  const [ratePerKg, setRatePerKg] = useState(PRODUCTS[0].pricePerKg);

  // Customer & Payment state
  const [customerType, setCustomerType] = useState('walkin');
  const [khataCustomers, setKhataCustomers] = useState(INITIAL_KHATA_CUSTOMERS);
  const [selectedKhataId, setSelectedKhataId] = useState(INITIAL_KHATA_CUSTOMERS[0].id);
  const [paymentMode, setPaymentMode] = useState('Cash');

  // Business Accounting state
  const [todaySales, setTodaySales] = useState(12840);
  const [liveStockKg, setLiveStockKg] = useState(45.2);
  const [purchaseAmount] = useState(7560);
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [suppliers] = useState(INITIAL_SUPPLIERS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);

  // Cart Hook & Sale Confirmation Modal
  const {
    cartItems,
    addItem,
    updateItemWeight,
    removeItem,
    clearCart,
    itemCount,
    totalWeight,
    totalAmount,
  } = useCart();

  const [cartMessage, setCartMessage] = useState(null);
  const [showSaleConfirm, setShowSaleConfirm] = useState(false);

  // Khata Add Customer State
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newCustomerBalance, setNewCustomerBalance] = useState('');
  const [addCustomerError, setAddCustomerError] = useState('');

  // Add Category & Live Stock State
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('Bird');
  const [newProductSku, setNewProductSku] = useState('');
  const [newProductRate, setNewProductRate] = useState('280');
  const [newProductStock, setNewProductStock] = useState('10.0');
  const [addCategoryError, setAddCategoryError] = useState('');

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === selectedProductId) || products[0],
    [products, selectedProductId]
  );

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === 'all' ||
        product.category === activeCategory ||
        (product.secondaryCategories || []).includes(activeCategory);
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        (product.subtitle || '').toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  const khataBalance = useMemo(
    () => khataCustomers.reduce((sum, c) => sum + c.balance, 0),
    [khataCustomers]
  );

  const expensesAmount = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses]
  );

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 700);
  };

  const handleSelectCustomerType = (mode) => {
    setCustomerType(mode);
    if (mode === 'khata') {
      setPaymentMode('Khata');
    } else if (paymentMode === 'Khata') {
      setPaymentMode('Cash');
    }
  };

  const handleSelectPaymentMode = (mode) => {
    setPaymentMode(mode);
    if (mode === 'Khata') {
      setCustomerType('khata');
    }
  };

  const handleSelectProductForScale = (product) => {
    setSelectedProductId(product.id);
    setRatePerKg(product.pricePerKg);
    setCartMessage(null);
  };

  const handleQuickAddProduct = (product) => {
    const addWeight = product.defaultAddWeight || 0.5;
    addItem(product, addWeight, product.pricePerKg);
    setCartMessage(null);
  };

  const handleAddPresetWeight = (presetKg) => {
    setScaleWeightKg((prev) => Math.round(((Number(prev) || 0) + presetKg) * 1000) / 1000);
  };

  const handleResetWeight = () => {
    setScaleWeightKg(0);
    setSelectedProductId(PRODUCTS[0].id);
    setRatePerKg(PRODUCTS[0].pricePerKg);
  };

  const handleAddWeighedToCart = () => {
    if (!scaleWeightKg || scaleWeightKg <= 0) {
      setCartMessage({ type: 'error', text: 'Enter or select a weight above 0 kg.' });
      return;
    }
    addItem(selectedProduct, scaleWeightKg, ratePerKg);
    setCartMessage({
      type: 'success',
      text: `Added ${scaleWeightKg.toFixed(3)} kg ${selectedProduct.name} to cart.`,
    });
  };

  const handleQuickScanSku = (skuText) => {
    const matched = products.find(
      (p) => p.sku.toLowerCase() === skuText.toLowerCase()
    );
    if (matched) {
      addItem(matched, matched.defaultAddWeight || 0.5, matched.pricePerKg);
      setCartMessage({
        type: 'success',
        text: `Scanned ${matched.name} (${matched.sku}) into cart.`,
      });
    }
    return matched || null;
  };

  const handleCompleteSaleClick = () => {
    if (cartItems.length === 0) {
      setCartMessage({
        type: 'error',
        text: 'Cart is empty. Please add chicken products before completing the sale.',
      });
      return;
    }
    setCartMessage(null);
    setShowSaleConfirm(true);
  };

  const handleConfirmSale = () => {
    const activeKhata = khataCustomers.find((c) => c.id === selectedKhataId);
    const customerLabel =
      customerType === 'khata' || paymentMode === 'Khata'
        ? activeKhata?.name || 'Khata Customer'
        : 'Walk-in Cash';

    const now = new Date();
    const timeLabel = now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const newInvoice = {
      id: `INV-${2049 + transactions.length}`,
      customer: customerLabel,
      itemsCount: itemCount,
      weightKg: totalWeight,
      amount: totalAmount,
      paymentMode,
      time: timeLabel,
    };

    setTransactions((prev) => [newInvoice, ...prev]);
    setTodaySales((prev) => prev + totalAmount);
    setLiveStockKg((prev) => Math.max(0, Math.round((prev - totalWeight) * 1000) / 1000));

    if (paymentMode === 'Khata' && activeKhata) {
      setKhataCustomers((prev) =>
        prev.map((c) =>
          c.id === activeKhata.id
            ? { ...c, balance: c.balance + totalAmount, lastOrder: `Today, ${timeLabel}` }
            : c
        )
      );
    }

    setProducts((prev) =>
      prev.map((prod) => {
        const soldQty = cartItems
          .filter((item) => item.id === prod.id)
          .reduce((s, item) => s + item.weightKg, 0);
        return soldQty > 0
          ? {
            ...prod,
            stockKg: Math.max(0, Math.round((prod.stockKg - soldQty) * 1000) / 1000),
          }
          : prod;
      })
    );

    clearCart();
    handleResetWeight();
    setShowSaleConfirm(false);
    setCartMessage({
      type: 'success',
      text: `Sale ${newInvoice.id} (₹${totalAmount.toLocaleString('en-IN')}) recorded via ${paymentMode}.`,
    });
  };

  const handleRecordKhataPayment = (customerId, amount) => {
    setKhataCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId
          ? { ...c, balance: Math.max(0, Math.round(c.balance - amount)) }
          : c
      )
    );
  };

  const handleCreateCustomerSubmit = (e) => {
    e.preventDefault();
    if (!newCustomerName.trim()) {
      setAddCustomerError('Customer or business name is required.');
      return;
    }
    const cleanPhone = newCustomerPhone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setAddCustomerError('Phone number must be exactly 10 digits.');
      return;
    }
    const formattedPhone = `+91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`;
    const initialBal = parseFloat(newCustomerBalance);
    const validBal = Number.isNaN(initialBal) ? 0 : Math.round(initialBal);
    const newCust = {
      id: `kh-${Date.now()}`,
      name: newCustomerName.trim(),
      phone: formattedPhone,
      balance: validBal,
      lastOrder: 'Just added',
    };
    setKhataCustomers((prev) => [newCust, ...prev]);
    setSelectedKhataId(newCust.id);
    setShowAddCustomerModal(false);
    setNewCustomerName('');
    setNewCustomerPhone('');
    setNewCustomerBalance('');
    setAddCustomerError('');
    setCartMessage({
      type: 'success',
      text: `Customer "${newCust.name}" added to Khata successfully.`,
    });
  };

  const handleOpenAddCategory = () => {
    setNewProductSku(`FF-${100 + products.length + 1}`);
    setNewCategoryName('');
    setNewProductRate('280');
    setNewProductStock('10.0');
    setAddCategoryError('');
    setShowAddCategoryModal(true);
  };

  const handleAddCategorySubmit = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      setAddCategoryError('Product / Category name is required.');
      return;
    }
    const rateNum = parseFloat(newProductRate);
    if (Number.isNaN(rateNum) || rateNum <= 0) {
      setAddCategoryError('Please enter a valid Rate / KG greater than 0.');
      return;
    }
    const stockNum = parseFloat(newProductStock);
    if (Number.isNaN(stockNum) || stockNum < 0) {
      setAddCategoryError('Please enter a valid Available Stock (0 or higher).');
      return;
    }

    const cleanName = newCategoryName.trim();
    const cleanSku = (newProductSku.trim() || `FF-${100 + products.length + 1}`).toUpperCase();

    if (products.some((p) => p.sku.toUpperCase() === cleanSku)) {
      setAddCategoryError(`SKU "${cleanSku}" already exists. Please use a unique SKU.`);
      return;
    }

    const slug =
      cleanName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || `prod-${Date.now()}`;

    // Add to categories if not existing
    if (!categories.some((c) => c.label.toLowerCase() === cleanName.toLowerCase())) {
      const newCat = {
        id: slug,
        label: cleanName,
        icon: newCategoryIcon || 'Bird',
      };
      setCategories((prev) => [...prev, newCat]);
    }

    // Add to products in live stock
    const newProd = {
      id: slug,
      name: cleanName,
      subtitle: '',
      pricePerKg: Math.round(rateNum),
      category: slug,
      sku: cleanSku,
      defaultAddWeight: 1.0,
      stockKg: Math.round(stockNum * 1000) / 1000,
      image: '/src/assets/images/chicken_whole_1794998816005.jpg',
    };

    setProducts((prev) => [...prev, newProd]);
    setLiveStockKg((prev) => Math.round((prev + newProd.stockKg) * 1000) / 1000);

    setShowAddCategoryModal(false);
    setNewCategoryName('');
    setNewProductSku('');
    setNewProductRate('280');
    setNewProductStock('10.0');
    setAddCategoryError('');
    setCartMessage({
      type: 'success',
      text: `Added "${newProd.name}" (${newProd.sku}) to Live Stock at ₹${newProd.pricePerKg}/kg with ${newProd.stockKg.toFixed(3)} kg stock.`,
    });
  };

  const handleAdjustStock = (productId, addKg) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, stockKg: Math.round((p.stockKg + addKg) * 1000) / 1000 }
          : p
      )
    );
    setLiveStockKg((prev) => Math.round((prev + addKg) * 1000) / 1000);
  };

  const handleUpdateProduct = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p))
    );
    if (selectedProductId === updatedProduct.id && updatedProduct.pricePerKg !== undefined) {
      setRatePerKg(updatedProduct.pricePerKg);
    }
    setLiveStockKg((prev) => {
      const oldProd = products.find((p) => p.id === updatedProduct.id);
      const diff = (updatedProduct.stockKg ?? oldProd?.stockKg ?? 0) - (oldProd?.stockKg ?? 0);
      return Math.max(0, Math.round((prev + diff) * 1000) / 1000);
    });
    setCartMessage({
      type: 'success',
      text: `Updated "${updatedProduct.name}" rates and stock successfully.`,
    });
  };

  const handleAddExpense = (newExp) => {
    const now = new Date();
    const timeLabel = now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
    setExpenses((prev) => [
      {
        id: `exp-${Date.now()}`,
        ...newExp,
        time: timeLabel,
      },
      ...prev,
    ]);
  };

  const isPOSView = activeModule === 'pos';

  return (
    <div className="app-shell">
      <Header
        isOnline={isOnline}
        onToggleOnline={() => setIsOnline((prev) => !prev)}
        isSyncing={isSyncing}
        onSync={handleSync}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onSelectModule={setActiveModule}
        onLogout={() => setIsSessionLocked(true)}
        notificationsCount={2}
      />

      <div className={`workspace-body ${isPOSView ? '' : 'is-single-main'}`}>
        <Sidebar
          activeModule={activeModule}
          onSelectModule={setActiveModule}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {isPOSView ? (
          <>
            <main className="pos-main">
              <POSHeader
                customerType={customerType}
                onSelectCustomerType={handleSelectCustomerType}
                khataCustomers={khataCustomers}
                selectedKhataId={selectedKhataId}
                onSelectKhataId={setSelectedKhataId}
                onQuickScanSku={handleQuickScanSku}
                onOpenAddCustomer={() => setShowAddCustomerModal(true)}
              />

              <WeightPanel
                weightKg={scaleWeightKg}
                onChangeWeight={setScaleWeightKg}
                ratePerKg={ratePerKg}
                onChangeRate={setRatePerKg}
                selectedProduct={selectedProduct}
                onAddPreset={handleAddPresetWeight}
                onResetWeight={handleResetWeight}
                onAddWeighedToCart={handleAddWeighedToCart}
              />

              <CategoryNavigation
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
                searchQuery={searchQuery}
                onChangeSearch={setSearchQuery}
                filteredCount={filteredProducts.length}
                categories={categories}
              />

              <ProductGrid
                products={filteredProducts}
                selectedProductId={selectedProductId}
                onSelectForScale={handleSelectProductForScale}
                onQuickAdd={handleQuickAddProduct}
                onClearFilters={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                }}
              />

              <SummaryCards
                stats={{
                  todaySales,
                  liveStockKg,
                  khataBalance,
                  purchaseAmount,
                  expensesAmount,
                }}
                onOpenModule={setActiveModule}
              />
            </main>

            <CartPanel
              cartItems={cartItems}
              itemCount={itemCount}
              totalWeight={totalWeight}
              totalAmount={totalAmount}
              paymentMode={paymentMode}
              onSelectPaymentMode={handleSelectPaymentMode}
              onUpdateWeight={updateItemWeight}
              onRemoveItem={removeItem}
              onClearCart={() => {
                clearCart();
                handleResetWeight();
                setCartMessage(null);
              }}
              onCompleteSaleClick={handleCompleteSaleClick}
              cartMessage={cartMessage}
            />
          </>
        ) : (
          <ModuleViews
            activeModule={activeModule}
            onBackToPOS={() => setActiveModule('pos')}
            stats={{
              todaySales,
              liveStockKg,
              khataBalance,
              purchaseAmount,
              expensesAmount,
            }}
            khataCustomers={khataCustomers}
            onRecordKhataPayment={handleRecordKhataPayment}
            suppliers={suppliers}
            products={products}
            onAdjustStock={handleAdjustStock}
            onUpdateProduct={handleUpdateProduct}
            expenses={expenses}
            onAddExpense={handleAddExpense}
            transactions={transactions}
            onOpenAddCustomer={() => setShowAddCustomerModal(true)}
            categories={categories}
            onOpenAddCategory={handleOpenAddCategory}
          />
        )}
      </div>

      {showSaleConfirm && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-sale-title"
        >
          <div className="modal-card">
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={22} color="#DC2026" />
                <h3 id="confirm-sale-title" className="modal-title">
                  Confirm Counter Sale
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSaleConfirm(false)}
                aria-label="Close confirmation dialog"
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  padding: 4,
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-summary-list">
              <div className="modal-summary-row">
                <span style={{ color: '#727988' }}>Customer</span>
                <strong>
                  {customerType === 'khata' || paymentMode === 'Khata'
                    ? khataCustomers.find((c) => c.id === selectedKhataId)?.name
                    : 'Walk-in Cash'}
                </strong>
              </div>
              <div className="modal-summary-row">
                <span style={{ color: '#727988' }}>Items &amp; Total Weight</span>
                <strong className="tabular-nums">
                  {itemCount} items · {totalWeight.toFixed(3)} kg
                </strong>
              </div>
              <div className="modal-summary-row">
                <span style={{ color: '#727988' }}>Payment Mode</span>
                <strong>{paymentMode}</strong>
              </div>
              <div
                className="modal-summary-row"
                style={{ borderTop: '1px solid #E5E8ED', paddingTop: 8, marginTop: 4 }}
              >
                <span style={{ fontWeight: 700 }}>Total Payable</span>
                <strong
                  className="tabular-nums"
                  style={{ fontSize: 18, color: '#DC2026' }}
                >
                  ₹{totalAmount.toLocaleString('en-IN')}
                </strong>
              </div>
            </div>

            <p style={{ margin: 0, fontSize: 12.5, color: '#727988' }}>
              Confirming will record this bill in Today&apos;s Sales, deduct stock weight, and clear the current cart.
            </p>

            <div className="modal-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowSaleConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleConfirmSale}
              >
                Confirm &amp; Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddCustomerModal && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-customer-modal-title"
        >
          <div className="modal-card" style={{ maxWidth: 440 }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <UserPlus size={20} color="#DC2026" />
                <h3 id="add-customer-modal-title" className="modal-title">
                  Add New Khata Customer
                </h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => {
                  setShowAddCustomerModal(false);
                  setNewCustomerName('');
                  setNewCustomerPhone('');
                  setNewCustomerBalance('');
                  setAddCustomerError('');
                }}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleCreateCustomerSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 14 }}
            >
              {addCustomerError && (
                <div className="cart-alert" style={{ margin: 0 }}>
                  {addCustomerError}
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 5 }}>
                  Customer / Business Name <span style={{ color: '#DC2026' }}>*</span>
                </label>
                <input
                  type="text"
                  className="text-input"
                  style={{ width: '100%' }}
                  placeholder="e.g. Al-Madina Biryani or Imran Khan"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  autoFocus
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                  <label style={{ fontSize: 13, fontWeight: 700 }}>
                    Phone Number <span style={{ color: '#DC2026' }}>*</span>
                  </label>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color:
                        newCustomerPhone.length === 10
                          ? '#16A34A'
                          : newCustomerPhone.length > 0
                            ? '#DC2026'
                            : '#727988',
                    }}
                  >
                    {newCustomerPhone.length}/10 digits
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 38,
                      padding: '0 10px',
                      background: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                      borderRight: 'none',
                      borderTopLeftRadius: 9,
                      borderBottomLeftRadius: 9,
                      fontSize: 13,
                      fontWeight: 700,
                      color: '#4B5563',
                      userSelect: 'none',
                    }}
                  >
                    +91
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    className="text-input"
                    style={{
                      width: '100%',
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                      letterSpacing: '0.04em',
                      fontWeight: 600,
                    }}
                    placeholder="9820411230"
                    value={newCustomerPhone}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setNewCustomerPhone(digits);
                      if (addCustomerError) {
                        setAddCustomerError('');
                      }
                    }}
                  />
                </div>
                <span style={{ fontSize: 11.5, color: '#727988', marginTop: 4, display: 'block' }}>
                  Must be exactly 10 digits (numbers only).
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 5 }}>
                  Opening Balance Due (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  className="text-input"
                  style={{ width: '100%' }}
                  placeholder="0"
                  value={newCustomerBalance}
                  onChange={(e) => setNewCustomerBalance(e.target.value)}
                />
                <span style={{ fontSize: 11.5, color: '#727988', marginTop: 4, display: 'block' }}>
                  Initial outstanding credit balance for this customer.
                </span>
              </div>

              <div className="modal-actions" style={{ marginTop: 8 }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setShowAddCustomerModal(false);
                    setNewCustomerName('');
                    setNewCustomerPhone('');
                    setNewCustomerBalance('');
                    setAddCustomerError('');
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <UserPlus size={16} />
                  <span>Save Customer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddCategoryModal && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-category-title"
        >
          <div className="modal-card" style={{ maxWidth: 460 }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FolderPlus size={20} color="#DC2026" />
                <h3 id="add-category-title" className="modal-title">
                  Add New Chicken Category / Product
                </h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => {
                  setShowAddCategoryModal(false);
                  setNewCategoryName('');
                  setNewProductSku('');
                  setNewProductRate('280');
                  setNewProductStock('10.0');
                  setAddCategoryError('');
                }}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleAddCategorySubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 14 }}
            >
              {addCategoryError && (
                <div className="cart-alert" style={{ margin: 0 }}>
                  {addCategoryError}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 5 }}>
                    SKU Code <span style={{ color: '#DC2026' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="text-input"
                    style={{ width: '100%', textTransform: 'uppercase', fontWeight: 700 }}
                    placeholder="e.g. FF-109"
                    value={newProductSku}
                    onChange={(e) => {
                      setNewProductSku(e.target.value.toUpperCase());
                      if (addCategoryError) setAddCategoryError('');
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 5 }}>
                    Category Icon
                  </label>
                  <select
                    className="text-input"
                    style={{ width: '100%' }}
                    value={newCategoryIcon}
                    onChange={(e) => setNewCategoryIcon(e.target.value)}
                  >
                    <option value="Bird">Bird (Whole / Desi)</option>
                    <option value="Drumstick">Drumstick (Legs / Curry)</option>
                    <option value="Slice">Slice (Breast / Boneless)</option>
                    <option value="Boxes">Boxes (Pre-cut / Packs)</option>
                    <option value="Feather">Feather (Wings / Specialty)</option>
                    <option value="UtensilsCrossed">Utensils (Tikka / Ready)</option>
                    <option value="Heart">Heart (Offal &amp; Liver)</option>
                    <option value="Package">Package (Frozen / Bulk)</option>
                    <option value="Layers">Layers (Assorted / Other)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 5 }}>
                  Product Name <span style={{ color: '#DC2026' }}>*</span>
                </label>
                <input
                  type="text"
                  className="text-input"
                  style={{ width: '100%' }}
                  placeholder="e.g. Desi / Country Chicken, Biryani Cut"
                  value={newCategoryName}
                  onChange={(e) => {
                    setNewCategoryName(e.target.value);
                    if (addCategoryError) setAddCategoryError('');
                  }}
                  autoFocus
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 5 }}>
                    Rate / KG (₹) <span style={{ color: '#DC2026' }}>*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    className="text-input"
                    style={{ width: '100%' }}
                    placeholder="e.g. 280"
                    value={newProductRate}
                    onChange={(e) => {
                      setNewProductRate(e.target.value);
                      if (addCategoryError) setAddCategoryError('');
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 5 }}>
                    Available Stock (kg) <span style={{ color: '#DC2026' }}>*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.05"
                    className="text-input"
                    style={{ width: '100%' }}
                    placeholder="e.g. 15.000"
                    value={newProductStock}
                    onChange={(e) => {
                      setNewProductStock(e.target.value);
                      if (addCategoryError) setAddCategoryError('');
                    }}
                    required
                  />
                </div>
              </div>

              <div className="modal-actions" style={{ marginTop: 8 }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setShowAddCategoryModal(false);
                    setNewCategoryName('');
                    setNewProductSku('');
                    setNewProductRate('280');
                    setNewProductStock('10.0');
                    setAddCategoryError('');
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <Plus size={16} />
                  <span>Save to Live Stock</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isSessionLocked && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="session-lock-title"
        >
          <div className="modal-card" style={{ maxWidth: 380, textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div className="scale-icon-box">
                <Lock size={24} />
              </div>
            </div>
            <h3 id="session-lock-title" className="modal-title">
              Counter Session Locked
            </h3>
            <p style={{ margin: 0, fontSize: 13.5, color: '#727988' }}>
              Signed in as <strong>Sheezan Shaikh (Admin)</strong>. Resume counter billing when ready.
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={() => setIsSessionLocked(false)}
              style={{ width: '100%' }}
            >
              Resume Counter POS
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
