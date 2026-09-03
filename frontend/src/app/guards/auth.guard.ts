import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

function tokenPayload(): { role?: string } | null {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1])) as { role?: string };
  } catch {
    return null;
  }
}

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  return tokenPayload() ? true : router.createUrlTree(["/login"]);
};

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  return tokenPayload()?.role === "admin"
    ? true
    : router.createUrlTree(["/products"]);
};
