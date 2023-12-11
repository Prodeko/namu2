import type { CartProduct } from "@/common/types";

export namespace ShoppingCart {
  const storageKey = "shoppingCart";

  export function addItem(item: CartProduct): void {
    const cart = getCart();
    const existingItem = cart.find((i) => i.id === item.id);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      cart.push(item);
    }
    saveCart(cart);
  }

  export function GetItemById(itemId: number): CartProduct | undefined {
    const cart = getCart();
    return cart.find((i) => i.id === itemId);
  }

  export function removeItem(itemId: number): void {
    const cart = getCart();
    saveCart(cart.filter((item) => item.id !== itemId));
  }

  export function hasItem(product: CartProduct): boolean {
    const cart = getCart();
    return cart.some((item) => item.id === product.id);
  }

  export function getItems(): CartProduct[] {
    return getCart();
  }

  export function removeAll(): void {
    localStorage.removeItem(storageKey);
  }

  export function getPrice(): number {
    const cart = getCart();
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  function getCart(): CartProduct[] {
    const cartJSON = localStorage.getItem(storageKey);
    return cartJSON ? JSON.parse(cartJSON) : [];
  }

  function saveCart(cart: CartProduct[]): void {
    localStorage.setItem(storageKey, JSON.stringify(cart));
  }
}
