import React, { useMemo, useState } from 'react';
import { CheckCircle2, Lock, X } from 'lucide-react';
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
            expenses={expenses}
            onAddExpense={handleAddExpense}
            transactions={transactions}
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
