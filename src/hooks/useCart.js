import { useCallback, useMemo, useState } from 'react';
import { INITIAL_CART } from '../data/products';

const roundWeight = (val) => Math.round(val * 1000) / 1000;

export function useCart() {
  const [cartItems, setCartItems] = useState(INITIAL_CART);

  const addItem = useCallback((product, weightKg = 0.5, customRate = null) => {
    const validWeight = roundWeight(Number(weightKg));
    if (!product || validWeight <= 0) return;

    const rate = customRate !== null ? Number(customRate) : product.pricePerKg;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.id === product.id && item.pricePerKg === rate
      );

      if (existingIndex > -1) {
        return prev.map((item, idx) =>
          idx === existingIndex
            ? { ...item, weightKg: roundWeight(item.weightKg + validWeight) }
            : item
        );
      }

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          subtitle: product.subtitle || '',
          pricePerKg: rate,
          weightKg: validWeight,
          image: product.image,
        },
      ];
    });
  }, []);

  const updateItemWeight = useCallback((id, pricePerKg, deltaKg) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id && item.pricePerKg === pricePerKg) {
            const nextWeight = roundWeight(item.weightKg + deltaKg);
            return nextWeight > 0 ? { ...item, weightKg: nextWeight } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  }, []);

  const removeItem = useCallback((id, pricePerKg) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.id === id && item.pricePerKg === pricePerKg))
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const totals = useMemo(() => {
    const totalWeight = cartItems.reduce((sum, item) => sum + item.weightKg, 0);
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + Math.round(item.weightKg * item.pricePerKg),
      0
    );
    return {
      itemCount: cartItems.length,
      totalWeight: roundWeight(totalWeight),
      totalAmount,
    };
  }, [cartItems]);

  return {
    cartItems,
    addItem,
    updateItemWeight,
    removeItem,
    clearCart,
    ...totals,
  };
}
