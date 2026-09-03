import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface CartItem {
  _id: string;
  productId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
}

@Injectable({ providedIn: "root" })
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = "/api/v1/cart";

  private headers() {
    return { Authorization: `Bearer ${localStorage.getItem("token") || ""}` };
  }

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.apiUrl, { headers: this.headers() });
  }

  add(productId: string, quantity = 1): Observable<Cart> {
    return this.http.post<Cart>(
      this.apiUrl,
      { productId, quantity },
      { headers: this.headers() },
    );
  }

  update(itemId: string, quantity: number): Observable<Cart> {
    return this.http.put<Cart>(
      `${this.apiUrl}/${itemId}`,
      { quantity },
      { headers: this.headers() },
    );
  }

  remove(itemId: string): Observable<Cart> {
    return this.http.delete<Cart>(`${this.apiUrl}/${itemId}`, {
      headers: this.headers(),
    });
  }
}
