import { Component, OnInit, inject } from "@angular/core";
import { Product } from "../../models/product.model";
import { ProductService } from "../../services/product.service";
import { CartService } from "../../services/cart.service";
import { finalize } from "rxjs";

@Component({
  selector: "app-products",
  standalone: false,
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"],
})
export class ProductsComponent implements OnInit {
  private readonly productsService = inject(ProductService);
  private readonly cartService = inject(CartService);
  products: Product[] = [];
  categories: string[] = [];
  searchTerm = "";
  categoryFilter = "";
  loading = false;
  errorMessage = "";
  noticeMessage = "";

  ngOnInit(): void {
    this.loadProducts(true);
  }

  search(): void {
    this.loadProducts();
  }

  private loadProducts(discoverCategories = false): void {
    this.loading = true;
    this.errorMessage = "";
    this.productsService
      .getProducts(this.searchTerm, this.categoryFilter)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          this.products = response.data || [];
          if (discoverCategories) {
            this.categories = [
              ...new Set(this.products.map((product) => product.category).filter(Boolean)),
            ].sort((a, b) => a.localeCompare(b));
          }
        },
        error: (error) =>
          (this.errorMessage =
            error?.error?.message || "Could not load products."),
      });
  }

  clearFilters(): void {
    this.searchTerm = "";
    this.categoryFilter = "";
    this.search();
  }

  addToCart(product: Product): void {
    if (!product._id) return;
    this.noticeMessage = "";
    this.errorMessage = "";
    this.cartService.add(product._id).subscribe({
      next: () => {
        this.errorMessage = "";
        this.noticeMessage = `${product.name} added to your bag.`;
      },
      error: (error) =>
        (this.errorMessage =
          error?.error?.message || "Please log in to use the cart."),
    });
  }
}
