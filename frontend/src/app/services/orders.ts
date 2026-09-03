import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class OrdersService {
  private apiUrl = "/api/v1/orders";

  constructor(private http: HttpClient) {}

  private authHeaders() {
    return { Authorization: `Bearer ${localStorage.getItem("token") || ""}` };
  }

  createOrder(orderData: any): Observable<any> {
    return this.http.post(this.apiUrl, orderData, {
      headers: this.authHeaders(),
    });
  }

  getUserOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.authHeaders() });
  }
}
