import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { Userservices } from "./services/userservices";

@Component({
  selector: "app-root",
  standalone: false,
  template: `
    <nav class="app-nav">
      <a routerLink="/home">Home</a>
      <a routerLink="/products">Products</a>
      <a routerLink="/cart">Cart</a>
      <a routerLink="/orders">Orders</a>
      <a *ngIf="userservice.isAdmin()" routerLink="/admin/products">Admin</a>
      <ng-container *ngIf="!userservice.isAuthenticated()">
        <a routerLink="/login">Login</a>
        <a routerLink="/register">Register</a>
      </ng-container>
      <button
        *ngIf="userservice.isAuthenticated()"
        class="nav-logout"
        type="button"
        (click)="logout()"
      >
        Logout
      </button>
    </nav>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  readonly userservice = inject(Userservices);
  private readonly router = inject(Router);

  logout(): void {
    this.userservice.logout();
    this.router.navigate(["/products"]);
  }
}
