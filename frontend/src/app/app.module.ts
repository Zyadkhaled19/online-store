import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { routes } from "./app.routes";
import { Login } from "./pages/login/login";
import { Register } from "./pages/register/register";
import { OrdersComponent } from "./pages/orders/orders";
import { AdminProductsComponent } from "./pages/admin-products/admin-products.component";
import { ProductsComponent } from "./pages/products/products.component";
import { CartComponent } from "./pages/cart/cart.component";
import { HomeComponent } from "./pages/home/home.component";
import { ProductDetailsComponent } from "./pages/product-details/product-details.component";

@NgModule({
  declarations: [
    AppComponent,
    Login,
    Register,
    OrdersComponent,
    AdminProductsComponent,
    ProductsComponent,
    CartComponent,
    HomeComponent,
    ProductDetailsComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
