import { Component, OnInit, inject } from "@angular/core";
import { Cart, CartItem, CartService } from "../../services/cart.service";
import { OrdersService } from "../../services/orders";
import { finalize } from "rxjs";

@Component({
  selector: "app-cart",
  standalone: false,
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.css"],
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly ordersService = inject(OrdersService);
  cart: Cart = { items: [] };
  shippingAddress = "";
  loading = false;
  checkingOut = false;
  errorMessage = "";
  successMessage = "";

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
    this.cartService.getCart().pipe(finalize(() => (this.loading = false))).subscribe({
      next: (cart) => (this.cart = cart),
      error: (error) =>
        (this.errorMessage =
          error?.error?.message || "Please log in to view your cart."),
    });
  }
  change(item: CartItem, amount: number): void {
    this.errorMessage = "";
    this.cartService
      .update(item._id, item.quantity + amount)
      .subscribe({
        next: (cart) => (this.cart = cart),
        error: (error) =>
          (this.errorMessage =
            error?.error?.message || "Could not update this item."),
      });
  }
  remove(item: CartItem): void {
    this.errorMessage = "";
    this.cartService
      .remove(item._id)
      .subscribe({
        next: (cart) => (this.cart = cart),
        error: (error) =>
          (this.errorMessage =
            error?.error?.message || "Could not remove this item."),
      });
  }
  checkout(): void {
    if (!this.cart.items.length || this.checkingOut) return;
    if (!this.shippingAddress.trim()) {
      this.errorMessage = "Shipping address is required.";
      return;
    }
    this.errorMessage = "";
    this.successMessage = "";
    this.checkingOut = true;
    this.ordersService
      .createOrder({
        items: this.cart.items,
        totalPrice: this.total,
        shippingAddress: this.shippingAddress,
      })
      .pipe(finalize(() => (this.checkingOut = false)))
      .subscribe({
        next: () => {
          this.cart = { items: [] };
          this.shippingAddress = "";
          this.errorMessage = "";
          this.successMessage = "Your order is in. You can follow its progress in your order history.";
        },
        error: (error) =>
          (this.errorMessage =
            error?.error?.message || "Could not place order."),
      });
  }
}
