import { Routes } from "@angular/router";
import { AdminProductsComponent } from "./pages/admin-products/admin-products.component";
import { Login } from "./pages/login/login";
import { Register } from "./pages/register/register";
import { OrdersComponent } from "./pages/orders/orders";
import { ProductsComponent } from "./pages/products/products.component";
import { CartComponent } from "./pages/cart/cart.component";
import { HomeComponent } from "./pages/home/home.component";
import { authGuard, adminGuard } from "./guards/auth.guard";
import { ProductDetailsComponent } from "./pages/product-details/product-details.component";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "products",
    pathMatch: "full",
  },
  { path: "home", component: HomeComponent },
  { path: "login", component: Login },
  { path: "register", component: Register },
  { path: "products", component: ProductsComponent },
  { path: "products/:id", component: ProductDetailsComponent },
  { path: "cart", component: CartComponent, canActivate: [authGuard] },
  { path: "orders", component: OrdersComponent, canActivate: [authGuard] },
  {
    path: "admin/products",
    component: AdminProductsComponent,
    canActivate: [adminGuard],
  },
  {
    path: "**",
    redirectTo: "products",
  },
];
