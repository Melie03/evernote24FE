import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from "./shared/authentication.service";
import { inject } from "@angular/core";

export const canSeeOwnContentGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);
  if (authService.isLoggedIn()) {
    return true;
  } else {
    console.log(state);
    router.navigate(["/login"]);
    return false;
  }
};
