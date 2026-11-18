import React from 'react';
import { ShoppingCart, Trash2 } from 'lucide-react';
import CartItem from './CartItem';
import PaymentSelector from './PaymentSelector';
import CompleteSaleButton from './CompleteSaleButton';

export default function CartPanel({
  cartItems,
  itemCount,
  totalWeight,
  totalAmount,
  paymentMode,
  onSelectPaymentMode,
  onUpdateWeight,
  onRemoveItem,
  onClearCart,
  onCompleteSaleClick,
  cartMessage,
}) {
  return (
    <aside className="cart-panel" aria-label="Current Sale">
      <div className="cart-header">
        <div className="cart-title-group">
          <ShoppingCart size={20} color="#DC2026" />
          <h2 className="cart-title">Current Sale</h2>
          <span className="cart-count-badge">{itemCount}</span>
        </div>

        <button
          type="button"
          className="clear-cart-btn"
          onClick={onClearCart}
          disabled={cartItems.length === 0}
        >
          <Trash2 size={13} />
          <span>Clear Cart</span>
        </button>
      </div>

      {cartMessage && (
        <div
          className={
            cartMessage.type === 'error' ? 'cart-alert' : 'cart-success'
          }
          role="status"
        >
          {cartMessage.text}
        </div>
      )}

      <div className="cart-items-list">
        {cartItems.length === 0 ? (
          <div className="cart-empty">
            No items in cart. Weigh a product or tap <strong>Add +</strong> on any cut.
          </div>
        ) : (
          cartItems.map((item) => (
            <CartItem
              key={`${item.id}-${item.pricePerKg}`}
              item={item}
              onUpdateWeight={onUpdateWeight}
              onRemove={onRemoveItem}
            />
          ))
        )}
      </div>

      <div className="cart-totals-box">
        <div className="total-row">
          <span className="total-label">Total Weight</span>
          <span className="total-weight-val">{totalWeight.toFixed(3)} kg</span>
        </div>
        <div className="total-row">
          <span className="grand-total-label">Total Amount</span>
          <span className="grand-total-val">
            ₹{totalAmount.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      <PaymentSelector
        paymentMode={paymentMode}
        onSelectPaymentMode={onSelectPaymentMode}
      />

      <CompleteSaleButton onClick={onCompleteSaleClick} />
    </aside>
  );
}
