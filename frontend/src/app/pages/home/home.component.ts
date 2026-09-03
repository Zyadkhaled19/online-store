import { Component } from "@angular/core";

@Component({
  selector: "app-home",
  standalone: false,
  template: `<main class="home">
    <h1>Mini E-Commerce</h1>
    <p>Find useful products at a glance.</p>
    <a routerLink="/products">Browse products</a>
  </main>`,
})
export class HomeComponent {}
