import { Component, OnInit, inject } from "@angular/core";
import { Router } from "@angular/router";
import { Product } from "../../models/product.model";
import { ProductService } from "../../services/product.service";
import { CartService } from "../../services/cart.service";

@Component({
  selector: "app-products",
  standalone: false,
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"],
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
