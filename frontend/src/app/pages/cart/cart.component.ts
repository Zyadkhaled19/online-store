import { Component, OnInit, inject } from "@angular/core";
import { Cart, CartItem, CartService } from "../../services/cart.service";
import { OrdersService } from "../../services/orders";

@Component({
  selector: "app-cart",
  standalone: false,
  template: ` <main class="store-page">
    <header>
      <h1>Your cart</h1>
      <a routerLink="/products">Continue shopping</a>
    </header>
    <p *ngIf="errorMessage" class="error">{{ errorMessage }}</p>
    <p *ngIf="loading">Loading cart...</p>
    <p *ngIf="!loading && !cart.items.length">Your cart is empty.</p>
    <section *ngIf="cart.items.length">
      <article *ngFor="let item of cart.items" class="cart-item">
        <div class="cart-item-image">
          <img *ngIf="item.image" [src]="item.image" [alt]="item.name" />
          <span *ngIf="!item.image">No image</span>
        </div>
        <span>{{ item.name }} - {{ item.price | currency }}</span>
        <button
          type="button"
          (click)="change(item, -1)"
          [disabled]="item.quantity <= 1"
        >
          -</button
        ><span>{{ item.quantity }}</span>
        <button type="button" (click)="change(item, 1)">+</button
        ><button type="button" (click)="remove(item)">Remove</button>
      </article>
      <h2>Total: {{ total | currency }}</h2>
      <input
        [(ngModel)]="shippingAddress"
        placeholder="Shipping address"
      /><button type="button" (click)="checkout()">Place order</button>
    </section>
  </main>`,
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly ordersService = inject(OrdersService);
  cart: Cart = { items: [] };
  shippingAddress = "";
  loading = false;
  errorMessage = "";

  ngOnInit(): void {
    this.load();
  }
  get total(): number {
    return this.cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  }
  load(): void {
    this.loading = true;
    this.cartService.getCart().subscribe({
      next: (cart) => (this.cart = cart),
      error: (error) =>
        (this.errorMessage =
          error?.error?.message || "Please log in to view your cart."),
      complete: () => (this.loading = false),
    });
  }
  change(item: CartItem, amount: number): void {
    this.cartService
      .update(item._id, item.quantity + amount)
      .subscribe({ next: (cart) => (this.cart = cart) });
  }
  remove(item: CartItem): void {
    this.cartService
      .remove(item._id)
      .subscribe({ next: (cart) => (this.cart = cart) });
  }
  checkout(): void {
    if (!this.shippingAddress.trim()) {
      this.errorMessage = "Shipping address is required.";
      return;
    }
    this.ordersService
      .createOrder({
        items: this.cart.items,
        totalPrice: this.total,
        shippingAddress: this.shippingAddress,
      })
      .subscribe({
        next: () => {
          this.cart = { items: [] };
          this.shippingAddress = "";
          this.errorMessage = "";
          window.alert("Order placed successfully. Your cart is now empty.");
        },
        error: (error) =>
          (this.errorMessage =
            error?.error?.message || "Could not place order."),
      });
  }
}
