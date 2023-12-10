export namespace ShoppingCart {
  interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
  }
  const storageKey = "shoppingCart";

  export function addItem(item: CartItem): void {
    const cart = getCart();
    const existingItem = cart.find((i) => i.id === item.id);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      cart.push(item);
    }
    saveCart(cart);
  }

  export function GetItemById(itemId: number): CartItem | undefined {
    const cart = getCart();
    return cart.find((i) => i.id === itemId);
  }

  export function removeItem(itemId: number): void {
    const cart = getCart();
    saveCart(cart.filter((item) => item.id !== itemId));
  }

  export function getItems(): CartItem[] {
    return getCart();
  }

  export function removeAll(): void {
    localStorage.removeItem(storageKey);
  }

  export function getPrice(): number {
    const cart = getCart();
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  function getCart(): CartItem[] {
    const cartJSON = localStorage.getItem(storageKey);
    return cartJSON ? JSON.parse(cartJSON) : [];
  }

  function saveCart(cart: CartItem[]): void {
    localStorage.setItem(storageKey, JSON.stringify(cart));
  }
}
