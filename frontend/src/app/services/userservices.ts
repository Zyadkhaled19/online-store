import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";

export interface ManagedUser {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: "user" | "admin";
}

@Injectable({
  providedIn: "root",
})
export class Userservices {
  private readonly http = inject(HttpClient);

  private authHeaders() {
    return { Authorization: `Bearer ${localStorage.getItem("token") || ""}` };
  }

  findUserByEmail(email: string): Observable<{ data: ManagedUser }> {
    return this.http.get<{ data: ManagedUser }>("/api/v1/users", {
      params: { email },
      headers: this.authHeaders(),
    });
  }

  changeUserRole(
    id: string,
    role: "user" | "admin",
  ): Observable<{ data: ManagedUser }> {
    return this.http.patch<{ data: ManagedUser }>(
      `/api/v1/users/${id}/role`,
      { role },
      { headers: this.authHeaders() },
    );
  }
  isAdmin(): boolean {
    const token = localStorage.getItem("token");
    if (!token) {
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1])) as {
        role?: string;
      };
      return payload.role === "admin";
    } catch {
      return false;
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  }

  loginApi(email: string, password: string): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>("/api/v1/auth/login", { email, password })
      .pipe(tap((response) => localStorage.setItem("token", response.token)));
  }

  registerApi(user: {
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmpassword: string;
    age: number;
  }): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>("/api/v1/auth/register", user)
      .pipe(tap((response) => localStorage.setItem("token", response.token)));
  }

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
}
