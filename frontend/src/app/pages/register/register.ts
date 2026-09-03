import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Userservices } from "../../services/userservices";
import { Router } from "@angular/router";

@Component({
  selector: "app-register",
  standalone: false,
  templateUrl: "./register.html",
  styleUrl: "./register.css",
})
export class Register {
  registerform: FormGroup;
  errorMessage = "";
  constructor(
    private fp: FormBuilder,
    private userservice: Userservices,
    private router: Router,
  ) {
    this.registerform = this.fp.group({
      email: ["", [Validators.required, Validators.email]],
      phoneNumber: [
        "",
        [Validators.required, Validators.pattern(/^\+?[0-9 ()-]{7,20}$/)],
      ],
      password: ["", [Validators.required, Validators.minLength(4)]],
      passwordConfirm: ["", [Validators.required, Validators.minLength(8)]],
      name: ["", [Validators.required, Validators.minLength(4)]],
      age: [18, [Validators.required, Validators.min(0)]],
    });
  }
  register() {
    if (this.registerform.invalid) {
      this.registerform.markAllAsTouched();
      return;
    }
    if (
      this.registerform.value.password !==
      this.registerform.value.passwordConfirm
    ) {
      alert("Passwords do not match");
      return;
    }

    const { email, phoneNumber, password, passwordConfirm, name, age } =
      this.registerform.value;
    this.userservice
      .registerApi({
        email,
        phoneNumber,
        password,
        confirmpassword: passwordConfirm,
        name,
        age,
      })
      .subscribe({
        next: () => this.router.navigate(["/products"]),
        error: (error) =>
          (this.errorMessage =
            error?.error?.message || "Could not create account."),
      });
  }
}
