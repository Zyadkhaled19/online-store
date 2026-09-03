import { Component, OnInit } from "@angular/core";
import { OrdersService } from "../../services/orders";

@Component({
  selector: "app-orders",
  standalone: false,
  templateUrl: "./orders.html",
  styleUrls: ["./orders.css"],
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  loading = false;
  errorMessage = "";

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.loading = true;
    this.ordersService.getUserOrders().subscribe({
      next: (data) => (this.orders = data),
      error: (err) =>
        (this.errorMessage = err?.error?.message || "Could not load orders."),
      complete: () => (this.loading = false),
    });
  }
}
