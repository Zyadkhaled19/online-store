import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { Userservices } from "./services/userservices";

@Component({
  selector: "app-root",
  standalone: false,
  template: `
    <div class="app-shell">
      <div class="announcement-bar">
        <span>Good things, thoughtfully picked.</span>
        <a routerLink="/products">Explore the collection <span aria-hidden="true">→</span></a>
      </div>
      <header class="site-header">
        <a class="brand" routerLink="/home" aria-label="Digi-store home">
          <span class="brand-mark" aria-hidden="true">D</span>
          <span class="brand-name">Digi-store</span>
        </a>
        <nav class="primary-nav" aria-label="Main navigation">
          <a routerLink="/home" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
          <a routerLink="/products" routerLinkActive="active">Shop</a>
          <a *ngIf="userservice.isAuthenticated()" routerLink="/orders" routerLinkActive="active">Orders</a>
          <a *ngIf="userservice.isAdmin()" routerLink="/admin/products" routerLinkActive="active">Store admin</a>
        </nav>
        <div class="header-actions">
          <a class="header-link" *ngIf="!userservice.isAuthenticated()" routerLink="/login">Sign in</a>
          <a class="header-link" *ngIf="!userservice.isAuthenticated()" routerLink="/register">Create account</a>
          <a class="cart-link" routerLink="/cart" aria-label="Shopping bag">
            <span aria-hidden="true">Bag</span><span class="cart-arrow" aria-hidden="true">↗</span>
          </a>
          <button *ngIf="userservice.isAuthenticated()" class="signout-link" type="button" (click)="logout()">Sign out</button>
        </div>
      </header>
      <main class="route-content">
        <router-outlet></router-outlet>
      </main>
      <footer class="site-footer">
        <a class="brand footer-brand" routerLink="/home">
          <span class="brand-mark" aria-hidden="true">D</span>
          <span class="brand-name">Digi-store</span>
        </a>
        <p>Thoughtful finds for everyday life.</p>
        <span class="footer-note">Made for the everyday.</span>
      </footer>
    </div>
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
