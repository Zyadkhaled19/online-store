import { Component, OnInit, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Product } from "../../models/product.model";
import { ProductService } from "../../services/product.service";
import { CartService } from "../../services/cart.service";

@Component({
  selector: "app-product-details",
  standalone: false,
  templateUrl: "./product-details.component.html",
  styleUrls: ["./product-details.component.css"],
})
export class ProductDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  product: Product | null = null;
  loading = false;
  errorMessage = "";
  noticeMessage = "";

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
    this.noticeMessage = "";
    this.errorMessage = "";
    this.cartService.add(this.product._id).subscribe({
      next: () => (this.noticeMessage = `${this.product?.name} added to your bag.`),
      error: (error) =>
        (this.errorMessage =
          error?.error?.message || "Please log in to use the cart."),
    });
  }
}
