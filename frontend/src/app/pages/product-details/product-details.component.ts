import { Component, OnInit, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Product } from "../../models/product.model";
import { ProductService } from "../../services/product.service";
import { CartService } from "../../services/cart.service";

@Component({
  selector: "app-product-details",
  standalone: false,
  template: `
    <main class="details-page">
      <a class="back-link" routerLink="/products">Back to products</a>
      <p *ngIf="loading" class="details-state">Loading product details...</p>
      <p *ngIf="errorMessage" class="details-state error">{{ errorMessage }}</p>

      <section *ngIf="product" class="details-card">
        <div class="details-image">
          <img
            *ngIf="product.image"
            [src]="product.image"
            [alt]="product.name"
          />
          <span *ngIf="!product.image">No image available</span>
        </div>
        <div class="details-copy">
          <span class="product-category">{{ product.category }}</span>
          <h1>{{ product.name }}</h1>
          <p class="details-description">{{ product.description }}</p>
          <div class="details-price">{{ product.price | currency }}</div>
          <p class="details-stock" [class.out-of-stock]="product.stock === 0">
            {{ product.stock ? product.stock + " available" : "Out of stock" }}
          </p>
          <button
            type="button"
            (click)="addToCart()"
            [disabled]="product.stock === 0"
          >
            Add to cart
          </button>
        </div>
      </section>
    </main>
  `,
})
export class ProductDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  product: Product | null = null;
  loading = false;
  errorMessage = "";

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (!id) {
      this.errorMessage = "Product not found.";
      return;
    }

    this.loading = true;
    this.productService.getProduct(id).subscribe({
      next: (response) => (this.product = response.data),
      error: (error) =>
        (this.errorMessage =
          error?.error?.message || "Could not load product details."),
      complete: () => (this.loading = false),
    });
  }

  addToCart(): void {
    if (!this.product?._id) return;
    this.cartService.add(this.product._id).subscribe({
      next: () => window.alert(`${this.product?.name} added successfully.`),
      error: (error) =>
        (this.errorMessage =
          error?.error?.message || "Please log in to use the cart."),
    });
  }
}
