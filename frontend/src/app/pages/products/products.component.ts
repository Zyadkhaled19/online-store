import { Component, OnInit, inject } from "@angular/core";
import { Router } from "@angular/router";
import { Product } from "../../models/product.model";
import { ProductService } from "../../services/product.service";
import { CartService } from "../../services/cart.service";

@Component({
  selector: "app-products",
  standalone: false,
  template: ` <main class="store-page">
    <header>
      <h1>Products</h1>
      <a routerLink="/cart">View cart</a>
    </header>
    <form (ngSubmit)="search()">
      <input
        name="searchTerm"
        [(ngModel)]="searchTerm"
        placeholder="Search products"
      /><button>Search</button>
    </form>
    <p *ngIf="errorMessage" class="error">{{ errorMessage }}</p>
    <p *ngIf="loading">Loading products...</p>
    <section class="product-grid" [class.single-result]="products.length === 1">
      <article
        *ngFor="let product of products"
        class="product-card"
        tabindex="0"
        role="link"
        (click)="openDetails(product)"
        (keydown.enter)="openDetails(product)"
        (keydown.space)="openDetails(product); $event.preventDefault()"
      >
        <div class="product-image">
          <img
            *ngIf="product.image"
            [src]="product.image"
            [alt]="product.name"
          />
          <span *ngIf="!product.image">No image</span>
        </div>
        <div class="product-copy">
          <span class="product-category">{{ product.category }}</span>
          <h2>
            <a [routerLink]="['/products', product._id]">{{ product.name }}</a>
          </h2>
          <p>{{ product.description }}</p>
        </div>
        <div class="product-footer">
          <strong>{{ product.price | currency }}</strong>
          <small>{{ product.stock }} available</small>
        </div>
        <button
          type="button"
          (click)="addToCart(product); $event.stopPropagation()"
          [disabled]="product.stock === 0"
        >
          {{ product.stock ? "Add to cart" : "Out of stock" }}
        </button>
      </article>
    </section>
  </main>`,
})
export class ProductsComponent implements OnInit {
  private readonly productsService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  products: Product[] = [];
  searchTerm = "";
  loading = false;
  errorMessage = "";

  openDetails(product: Product): void {
    if (product._id) {
      this.router.navigate(["/products", product._id]);
    }
  }

  ngOnInit(): void {
    this.search();
  }
  search(): void {
    this.loading = true;
    this.productsService.getProducts(this.searchTerm).subscribe({
      next: (response) => (this.products = response.data || []),
      error: (error) =>
        (this.errorMessage =
          error?.error?.message || "Could not load products."),
      complete: () => (this.loading = false),
    });
  }
  addToCart(product: Product): void {
    if (!product._id) return;
    this.cartService.add(product._id).subscribe({
      next: () => {
        this.errorMessage = "";
        window.alert(`${product.name} added successfully.`);
      },
      error: (error) =>
        (this.errorMessage =
          error?.error?.message || "Please log in to use the cart."),
    });
  }
}
