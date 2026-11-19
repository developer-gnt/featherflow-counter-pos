import React, { useState } from 'react';
import {
  ArrowLeft,
  Download,
  Pencil,
  Plus,
  Printer,
  ReceiptText,
  Truck,
  UserPlus,
  Wallet,
  X,
} from 'lucide-react';
import { CATEGORIES } from '../data/products';
import BusinessDashboard from './dashboard/BusinessDashboard';

export default function ModuleViews({
  activeModule,
  onBackToPOS,
  onSelectModule,
  stats,
  khataCustomers,
  onRecordKhataPayment,
  suppliers,
  onUpdateSupplier,
  products,
  onAdjustStock,
  onUpdateProduct,
  expenses,
  onAddExpense,
  transactions,
  onOpenAddCustomer,
  categories,
  onOpenAddCategory,
  onOpenAddSupplier,
}) {
  const [expenseSuccessToast, setExpenseSuccessToast] = useState('');
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseModalTitle, setExpenseModalTitle] = useState('');
  const [expenseModalCategory, setExpenseModalCategory] = useState('Operations');
  const [expenseModalMode, setExpenseModalMode] = useState('Cash');
  const [expenseModalAmount, setExpenseModalAmount] = useState('');
  const [expenseModalError, setExpenseModalError] = useState('');
  const [paymentDraft, setPaymentDraft] = useState({});
  const [drawerOpeningCash, setDrawerOpeningCash] = useState(2500);
  const [printerAutoReceipt, setPrinterAutoReceipt] = useState(true);
  const [gstRate, setGstRate] = useState('0% (Fresh Meat Exempt)');

  // Product Edit State
  const [editingProduct, setEditingProduct] = useState(null);
  const [editName, setEditName] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editRate, setEditRate] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editError, setEditError] = useState('');

  const handleStartEdit = (prod) => {
    setEditingProduct(prod);
    setEditName(prod.name);
    setEditSubtitle(prod.subtitle || '');
    setEditRate(String(prod.pricePerKg));
    setEditStock(String(prod.stockKg));
    setEditError('');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      setEditError('Product name cannot be empty.');
      return;
    }
    const rateNum = parseFloat(editRate);
    if (Number.isNaN(rateNum) || rateNum <= 0) {
      setEditError('Please enter a valid rate per KG greater than 0.');
      return;
    }
    const stockNum = parseFloat(editStock);
    if (Number.isNaN(stockNum) || stockNum < 0) {
      setEditError('Please enter a valid stock weight (0 or higher).');
      return;
    }

    if (onUpdateProduct && editingProduct) {
      onUpdateProduct({
        ...editingProduct,
        name: editName.trim(),
        subtitle: editSubtitle.trim(),
        pricePerKg: Math.round(rateNum),
        stockKg: Math.round(stockNum * 1000) / 1000,
      });
    }
    setEditingProduct(null);
  };

  // Supplier Edit State
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [editSupplierStatus, setEditSupplierStatus] = useState('Pending');
  const [editSupplierPayable, setEditSupplierPayable] = useState('');
  const [editSupplierBirds, setEditSupplierBirds] = useState('');
  const [editSupplierWeight, setEditSupplierWeight] = useState('');
  const [editSupplierError, setEditSupplierError] = useState('');

  const handleStartEditSupplier = (sup) => {
    setEditingSupplier(sup);
    setEditSupplierStatus(sup.status || 'Pending');
    setEditSupplierPayable(String(sup.payable ?? 0));
    setEditSupplierBirds(String(sup.birdsDelivered ?? ''));
    setEditSupplierWeight(String(sup.weightKg ?? ''));
    setEditSupplierError('');
  };

  const handleSaveEditSupplier = (e) => {
    e.preventDefault();
    const payableNum = parseFloat(editSupplierPayable);
    if (Number.isNaN(payableNum) || payableNum < 0) {
      setEditSupplierError('Please enter a valid payable amount (0 or higher).');
      return;
    }
    const birdsNum = parseInt(editSupplierBirds, 10);
    const weightNum = parseFloat(editSupplierWeight);

    if (onUpdateSupplier && editingSupplier) {
      onUpdateSupplier({
        ...editingSupplier,
        status: editSupplierStatus,
        payable: Math.round(payableNum),
        birdsDelivered: Number.isNaN(birdsNum) || birdsNum <= 0 ? editingSupplier.birdsDelivered : birdsNum,
        weightKg: Number.isNaN(weightNum) || weightNum <= 0 ? editingSupplier.weightKg : Math.round(weightNum * 10) / 10,
      });
    }
    setEditingSupplier(null);
  };

  const handleModalExpenseSubmit = (e) => {
    e.preventDefault();
    if (!expenseModalTitle.trim()) {
      setExpenseModalError('Please enter an expense description.');
      return;
    }
    const amt = parseFloat(expenseModalAmount);
    if (Number.isNaN(amt) || amt <= 0) {
      setExpenseModalError('Please enter a valid amount greater than ₹0.');
      return;
    }
    setExpenseModalError('');
    if (onAddExpense) {
      onAddExpense({
        title: expenseModalTitle.trim(),
        category: expenseModalCategory,
        amount: Math.round(amt),
        mode: expenseModalMode,
      });
    }
    setExpenseSuccessToast(`Expense "${expenseModalTitle.trim()}" (₹${Math.round(amt).toLocaleString('en-IN')}) recorded successfully.`);
    setTimeout(() => setExpenseSuccessToast(''), 3000);
    setShowExpenseModal(false);
    setExpenseModalTitle('');
    setExpenseModalCategory('Operations');
    setExpenseModalMode('Cash');
    setExpenseModalAmount('');
    setExpenseModalError('');
  };

  const handleExportCsv = () => {
    const header = 'Invoice,Customer,Items,Weight(kg),Amount(INR),Payment,Time\n';
    const rows = transactions
      .map(
        (t) =>
          `${t.id},"${t.customer}",${t.itemsCount},${t.weightKg.toFixed(3)},${t.amount},${t.paymentMode},${t.time}`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'featherflow-daily-sales.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderTopBar = (title, subtitle, extraAction = null) => (
    <div className="pos-header-row">
      <div>
        <h1 className="pos-title">{title}</h1>
        <p className="pos-subtitle">{subtitle}</p>
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        {extraAction}
        <button
          type="button"
          className={extraAction ? 'btn-secondary' : 'btn-primary'}
          onClick={onBackToPOS}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <ArrowLeft size={16} />
            Back to Counter POS
          </span>
        </button>
      </div>
    </div>
  );

  if (activeModule === 'dashboard') {
    return (
      <div className="pos-main">
        <BusinessDashboard
          stats={stats}
          transactions={transactions}
          products={products}
          onUpdateProduct={onUpdateProduct}
          onAdjustStock={onAdjustStock}
          onNavigate={onSelectModule || onBackToPOS}
        />
      </div>
    );
  }

  if (activeModule === 'khata') {
    return (
      <div className="pos-main">
        {renderTopBar(
          'Khata (Customer Credit Ledger)',
          'Track regular hotel, caterer, and retail credit balances',
          <button
            type="button"
            className="btn-primary"
            onClick={onOpenAddCustomer}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <UserPlus size={16} />
            <span>Add New Customer</span>
          </button>
        )}
        <div className="module-view-card">
          <div className="module-table-wrap">
            <table className="pos-table">
              <thead>
                <tr>
                  <th>Customer / Business</th>
                  <th>Phone</th>
                  <th>Last Order</th>
                  <th>Balance Due</th>
                  <th>Record Collection</th>
                </tr>
              </thead>
              <tbody>
                {khataCustomers.map((cust) => (
                  <tr key={cust.id}>
                    <td style={{ fontWeight: 700 }}>{cust.name}</td>
                    <td className="tabular-nums">{cust.phone}</td>
                    <td>{cust.lastOrder}</td>
                    <td className="tabular-nums" style={{ fontWeight: 800, color: '#DC2026' }}>
                      ₹{cust.balance.toLocaleString('en-IN')}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <input
                          type="number"
                          min="1"
                          placeholder="₹ Amount"
                          className="text-input"
                          style={{ width: 105, height: 32 }}
                          value={paymentDraft[cust.id] || ''}
                          onChange={(e) =>
                            setPaymentDraft((prev) => ({
                              ...prev,
                              [cust.id]: e.target.value,
                            }))
                          }
                        />
                        <button
                          type="button"
                          className="btn-primary"
                          style={{ height: 32, padding: '0 12px', fontSize: 12 }}
                          onClick={() => {
                            const val = parseFloat(paymentDraft[cust.id]);
                            if (!Number.isNaN(val) && val > 0) {
                              onRecordKhataPayment(cust.id, val);
                              setPaymentDraft((prev) => ({ ...prev, [cust.id]: '' }));
                            }
                          }}
                        >
                          Receive
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (activeModule === 'suppliers') {
    return (
      <div className="pos-main">
        {renderTopBar(
          'Poultry Suppliers & Morning Arrivals',
          'Live bird & dressed chicken supply batches',
          <button
            type="button"
            className="btn-primary"
            onClick={onOpenAddSupplier}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <Plus size={16} />
            <span>Add Supplier</span>
          </button>
        )}
        <div className="module-view-card">
          <div className="module-table-wrap">
            <table className="pos-table">
              <thead>
                <tr>
                  <th>Supplier</th>
                  <th>Contact Person</th>
                  <th>Birds</th>
                  <th>Net Weight</th>
                  <th>Payable</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((sup) => (
                  <tr key={sup.id}>
                    <td style={{ fontWeight: 700 }}>{sup.name}</td>
                    <td>{sup.contact} · {sup.phone}</td>
                    <td className="tabular-nums">{sup.birdsDelivered}</td>
                    <td className="tabular-nums">{sup.weightKg.toFixed(1)} kg</td>
                    <td className="tabular-nums" style={{ fontWeight: 700 }}>
                      ₹{sup.payable.toLocaleString('en-IN')}
                    </td>
                    <td>
                      <span
                        className={`status-tag ${
                          sup.status === 'Pending'
                            ? 'status-tag--amber'
                            : 'status-tag--green'
                        }`}
                      >
                        {sup.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{
                          height: 30,
                          padding: '0 10px',
                          fontSize: 12,
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          cursor: 'pointer',
                        }}
                        onClick={() => handleStartEditSupplier(sup)}
                        title={`Edit ${sup.name}`}
                      >
                        <Pencil size={13} color="#DC2026" />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {editingSupplier && (
          <div
            className="modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-supplier-title"
          >
            <div className="modal-card" style={{ maxWidth: 460 }}>
              <div className="modal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Pencil size={20} color="#DC2026" />
                  <h3 id="edit-supplier-title" className="modal-title">
                    Edit Supplier Payment &amp; Status
                  </h3>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setEditingSupplier(null)}
                  aria-label="Close dialog"
                >
                  <X size={18} />
                </button>
              </div>

              <form
                onSubmit={handleSaveEditSupplier}
                style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 14 }}
              >
                {editSupplierError && (
                  <div className="cart-alert" style={{ margin: 0 }}>
                    {editSupplierError}
                  </div>
                )}

                <div
                  style={{
                    background: 'var(--color-bg)',
                    padding: '10px 14px',
                    borderRadius: 8,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: '#17191D' }}>
                      {editingSupplier.name}
                    </div>
                    <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 2 }}>
                      {editingSupplier.contact} ({editingSupplier.phone})
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#4B5563' }}>
                      {editingSupplier.birdsDelivered} Birds
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#059669' }}>
                      {editingSupplier.weightKg.toFixed(1)} kg
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 5 }}>
                    Payment / Settlement Status <span style={{ color: '#DC2026' }}>*</span>
                  </label>
                  <select
                    className="text-input"
                    style={{ width: '100%', fontWeight: 700 }}
                    value={editSupplierStatus}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      setEditSupplierStatus(newStatus);
                      if (newStatus === 'Paid' && parseFloat(editSupplierPayable) > 0) {
                        setEditSupplierPayable('0');
                      }
                    }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Settled Today">Settled Today</option>
                  </select>
                  <span style={{ fontSize: 11.5, color: '#727988', marginTop: 4, display: 'block' }}>
                    Select whether the batch is Pending, Paid, or Settled Today.
                  </span>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                    <label style={{ fontSize: 13, fontWeight: 700 }}>
                      Payable Amount (₹) <span style={{ color: '#DC2026' }}>*</span>
                    </label>
                    {parseFloat(editSupplierPayable) > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditSupplierPayable('0');
                          setEditSupplierStatus('Paid');
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#059669',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
                          padding: 0,
                          textDecoration: 'underline',
                        }}
                      >
                        Mark as ₹0 (Paid)
                      </button>
                    )}
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    className="text-input"
                    style={{ width: '100%', fontSize: 15, fontWeight: 700 }}
                    placeholder="e.g. 10000 or 0"
                    value={editSupplierPayable}
                    onChange={(e) => {
                      setEditSupplierPayable(e.target.value);
                      if (editSupplierError) setEditSupplierError('');
                    }}
                    required
                  />
                  <span style={{ fontSize: 11.5, color: '#727988', marginTop: 4, display: 'block' }}>
                    Enter current outstanding payable amount (set to 0 when paid).
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 5 }}>
                      Birds (Count)
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      className="text-input"
                      style={{ width: '100%' }}
                      value={editSupplierBirds}
                      onChange={(e) => setEditSupplierBirds(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 5 }}>
                      Net Weight (kg)
                    </label>
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      className="text-input"
                      style={{ width: '100%' }}
                      value={editSupplierWeight}
                      onChange={(e) => setEditSupplierWeight(e.target.value)}
                    />
                  </div>
                </div>

                <div className="modal-actions" style={{ marginTop: 8 }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setEditingSupplier(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    <Pencil size={15} />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (activeModule === 'stock' || activeModule === 'products') {
    return (
      <div className="pos-main">
        {renderTopBar(
          activeModule === 'stock' ? 'Live Chicken Stock' : 'Products & Daily Rates',
          'Available cut weights and counter pricing per KG',
          <button
            type="button"
            className="btn-primary"
            onClick={onOpenAddCategory}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <Plus size={16} />
            <span>Add Category</span>
          </button>
        )}
        <div className="module-view-card">
          <div className="module-table-wrap">
            <table className="pos-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Product</th>
                  <th>Rate / KG</th>
                  <th>Available Stock</th>
                  <th>Quick Refill</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod.id}>
                    <td className="tabular-nums" style={{ fontWeight: 700 }}>{prod.sku}</td>
                    <td style={{ fontWeight: 700 }}>
                      {prod.name} {prod.subtitle}
                    </td>
                    <td className="tabular-nums" style={{ color: '#DC2026', fontWeight: 700 }}>
                      ₹{prod.pricePerKg}/kg
                    </td>
                    <td className="tabular-nums">
                      <span
                        className={`status-tag ${
                          prod.stockKg <= 2 ? 'status-tag--red' : 'status-tag--green'
                        }`}
                      >
                        {prod.stockKg.toFixed(3)} kg
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ height: 32, padding: '0 10px', fontSize: 12 }}
                        onClick={() => onAdjustStock(prod.id, 5)}
                      >
                        +5.0 kg Stock
                      </button>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{
                          height: 32,
                          padding: '0 12px',
                          fontSize: 12,
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          cursor: 'pointer',
                        }}
                        onClick={() => handleStartEdit(prod)}
                        title={`Edit ${prod.name}`}
                      >
                        <Pencil size={13} color="#DC2026" />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {editingProduct && (
          <div
            className="modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-product-title"
          >
            <div className="modal-card" style={{ maxWidth: 440 }}>
              <div className="modal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Pencil size={20} color="#DC2026" />
                  <h3 id="edit-product-title" className="modal-title">
                    Edit Product &amp; Stock
                  </h3>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setEditingProduct(null)}
                  aria-label="Close dialog"
                >
                  <X size={18} />
                </button>
              </div>

              <form
                onSubmit={handleSaveEdit}
                style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 14 }}
              >
                {editError && (
                  <div className="cart-alert" style={{ margin: 0 }}>
                    {editError}
                  </div>
                )}

                <div
                  style={{
                    background: 'var(--color-bg)',
                    padding: '9px 12px',
                    borderRadius: 8,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: '#4B5563' }}>SKU Code</span>
                  <span className="tabular-nums" style={{ fontWeight: 800, color: '#DC2026' }}>
                    {editingProduct.sku}
                  </span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 5 }}>
                    Product Name <span style={{ color: '#DC2026' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="text-input"
                    style={{ width: '100%' }}
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 5 }}>
                    Cut Type / Subtitle
                  </label>
                  <input
                    type="text"
                    className="text-input"
                    style={{ width: '100%' }}
                    placeholder="e.g. (Curry Cut) or (Skinless)"
                    value={editSubtitle}
                    onChange={(e) => setEditSubtitle(e.target.value)}
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
                      value={editRate}
                      onChange={(e) => setEditRate(e.target.value)}
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
                      value={editStock}
                      onChange={(e) => setEditStock(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="modal-actions" style={{ marginTop: 8 }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setEditingProduct(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    <Pencil size={15} />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (activeModule === 'expenses') {
    return (
      <div className="pos-main">
        {renderTopBar(
          'Daily Counter Expenses',
          'Record ice, bags, transport, and shop upkeep',
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setExpenseModalTitle('');
              setExpenseModalAmount('');
              setExpenseModalError('');
              setShowExpenseModal(true);
            }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <Plus size={16} />
            <span>Add Expense</span>
          </button>
        )}
        <div className="module-view-card">
          {expenseSuccessToast && (
            <div className="cart-success" style={{ margin: '0 0 12px' }} role="status">
              {expenseSuccessToast}
            </div>
          )}

          <div className="module-table-wrap">
            <table className="pos-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Mode</th>
                  <th>Time</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp.id}>
                    <td style={{ fontWeight: 700 }}>{exp.title}</td>
                    <td>{exp.category}</td>
                    <td>{exp.mode}</td>
                    <td>{exp.time}</td>
                    <td className="tabular-nums" style={{ fontWeight: 800, color: '#DC2026' }}>
                      ₹{exp.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showExpenseModal && (
          <div
            className="modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-expense-modal-title"
          >
            <div className="modal-card" style={{ maxWidth: 440 }}>
              <div className="modal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ReceiptText size={20} color="#DC2026" />
                  <h3 id="add-expense-modal-title" className="modal-title">
                    Record New Expense
                  </h3>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => {
                    setShowExpenseModal(false);
                    setExpenseModalError('');
                  }}
                  aria-label="Close dialog"
                >
                  <X size={18} />
                </button>
              </div>

              <form
                onSubmit={handleModalExpenseSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 14 }}
              >
                {expenseModalError && (
                  <div className="cart-alert" style={{ margin: 0 }}>
                    {expenseModalError}
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 5 }}>
                    Expense Description <span style={{ color: '#DC2026' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="text-input"
                    style={{ width: '100%' }}
                    placeholder="e.g. Morning Ice Blocks, Carry Bags"
                    value={expenseModalTitle}
                    onChange={(e) => {
                      setExpenseModalTitle(e.target.value);
                      if (expenseModalError) setExpenseModalError('');
                    }}
                    autoFocus
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 5 }}>
                      Category
                    </label>
                    <select
                      className="text-input"
                      style={{ width: '100%' }}
                      value={expenseModalCategory}
                      onChange={(e) => setExpenseModalCategory(e.target.value)}
                    >
                      <option value="Operations">Operations</option>
                      <option value="Packaging">Packaging</option>
                      <option value="Transport">Transport</option>
                      <option value="Staff">Staff</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Utilities">Utilities</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 5 }}>
                      Payment Mode
                    </label>
                    <select
                      className="text-input"
                      style={{ width: '100%' }}
                      value={expenseModalMode}
                      onChange={(e) => setExpenseModalMode(e.target.value)}
                    >
                      <option value="Cash">Cash</option>
                      <option value="UPI">UPI</option>
                      <option value="Card">Card</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 5 }}>
                    Amount (₹) <span style={{ color: '#DC2026' }}>*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    className="text-input"
                    style={{ width: '100%', fontSize: 16, fontWeight: 700 }}
                    placeholder="e.g. 500"
                    value={expenseModalAmount}
                    onChange={(e) => {
                      setExpenseModalAmount(e.target.value);
                      if (expenseModalError) setExpenseModalError('');
                    }}
                    required
                  />
                </div>

                <div className="modal-actions" style={{ marginTop: 8 }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setShowExpenseModal(false);
                      setExpenseModalError('');
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
                    <span>Save Expense</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (activeModule === 'cashdrawer') {
    const cashSales = transactions
      .filter((t) => t.paymentMode === 'Cash')
      .reduce((sum, t) => sum + t.amount, 0);
    const expectedCash = drawerOpeningCash + cashSales - stats.expensesAmount;

    return (
      <div className="pos-main">
        {renderTopBar('Cash Drawer Register', 'Opening float, cash sales, and net counter cash')}
        <div className="module-view-card">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
              gap: 12,
            }}
          >
            <div className="summary-card summary-card--purchase">
              <div className="summary-icon"><Wallet size={18} /></div>
              <div className="summary-text">
                <span className="summary-label">Opening Cash Float</span>
                <span className="summary-value">₹{drawerOpeningCash.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div className="summary-card summary-card--sales">
              <div className="summary-icon"><Wallet size={18} /></div>
              <div className="summary-text">
                <span className="summary-label">Cash Sales Collected</span>
                <span className="summary-value">₹{cashSales.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div className="summary-card summary-card--stock">
              <div className="summary-icon"><Wallet size={18} /></div>
              <div className="summary-text">
                <span className="summary-label">Expected Drawer Balance</span>
                <span className="summary-value">₹{expectedCash.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="inline-form-row" style={{ alignItems: 'center' }}>
            <label htmlFor="opening-float" style={{ fontSize: 13, fontWeight: 700 }}>
              Update Opening Float (₹):
            </label>
            <input
              id="opening-float"
              type="number"
              className="text-input"
              value={drawerOpeningCash}
              onChange={(e) => setDrawerOpeningCash(Number(e.target.value) || 0)}
              style={{ width: 140 }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (activeModule === 'reports') {
    return (
      <div className="pos-main">
        {renderTopBar('Daily Sales Reports', 'Export counter billing logs and shift summaries')}
        <div className="module-view-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>
              Total Day Sales: <span style={{ color: '#DC2026' }}>₹{stats.todaySales.toLocaleString('en-IN')}</span> · Bills Recorded: {transactions.length}
            </div>
            <button type="button" className="btn-primary" onClick={handleExportCsv}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Download size={15} />
                Download CSV Report
              </span>
            </button>
          </div>

          <div className="module-table-wrap">
            <table className="pos-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Weight</th>
                  <th>Payment</th>
                  <th>Time</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="tabular-nums" style={{ fontWeight: 700 }}>{tx.id}</td>
                    <td>{tx.customer}</td>
                    <td className="tabular-nums">{tx.itemsCount}</td>
                    <td className="tabular-nums">{tx.weightKg.toFixed(3)} kg</td>
                    <td>{tx.paymentMode}</td>
                    <td>{tx.time}</td>
                    <td className="tabular-nums" style={{ fontWeight: 800, color: '#DC2026' }}>
                      ₹{tx.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (activeModule === 'categories') {
    return (
      <div className="pos-main">
        {renderTopBar(
          'Product Categories',
          'Manage poultry cut groups displayed on the POS grid',
          <button
            type="button"
            className="btn-primary"
            onClick={onOpenAddCategory}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <Plus size={16} />
            <span>Add Category</span>
          </button>
        )}
        <div className="module-view-card">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: 12,
            }}
          >
            {(categories || CATEGORIES).map((cat) => (
              <div
                key={cat.id}
                style={{
                  border: '1px solid #E5E8ED',
                  borderRadius: 12,
                  padding: 14,
                  background: '#FAFAFB',
                }}
              >
                <div style={{ fontWeight: 800, fontSize: 14 }}>{cat.label}</div>
                <div style={{ fontSize: 12, color: '#727988', marginTop: 4 }}>
                  {cat.id === 'all'
                    ? `${products.length} total cuts`
                    : `${products.filter((p) => p.category === cat.id || (p.secondaryCategories || []).includes(cat.id)).length} items`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pos-main">
      {renderTopBar('Counter POS Settings', 'Scale calibration, thermal printer, and shop configuration')}
      <div className="module-view-card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 460 }}>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, fontSize: 14, fontWeight: 600 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Printer size={17} color="#DC2026" />
              Auto-print thermal bill after sale
            </span>
            <input
              type="checkbox"
              checked={printerAutoReceipt}
              onChange={(e) => setPrinterAutoReceipt(e.target.checked)}
              style={{ width: 18, height: 18, accentColor: '#DC2026' }}
            />
          </label>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label htmlFor="gst-select" style={{ fontSize: 13, fontWeight: 700 }}>
              Tax / GST Classification
            </label>
            <select
              id="gst-select"
              className="text-input"
              value={gstRate}
              onChange={(e) => setGstRate(e.target.value)}
            >
              <option value="0% (Fresh Meat Exempt)">0% (Fresh Meat Exempt)</option>
              <option value="5% GST (Processed Cuts)">5% GST (Processed Cuts)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
