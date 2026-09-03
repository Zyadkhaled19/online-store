import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Userservices } from "../../services/userservices";

@Component({
  selector: "app-login",
  standalone: false,
  templateUrl: "./login.html",
  styleUrl: "./login.css",
})
export class Login {
  loginform: FormGroup;
  errorMessage = "";

  constructor(
    private userservice: Userservices,
    private fp: FormBuilder,
    private router: Router,
  ) {
    this.loginform = this.fp.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(4)]],
    });
  }

  login() {
    if (this.loginform.invalid) {
      this.loginform.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginform.value;
    this.userservice.loginApi(email, password).subscribe({
      next: () => this.router.navigate(["/products"]),
      error: (error) =>
        (this.errorMessage = error?.error?.msg || "Invalid email or password."),
    });
  }
}
