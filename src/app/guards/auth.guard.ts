import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@service/core/auth.service';
import { PersonalInfo, UserMeta } from '@model/user';

// default
export const authGuard: CanActivateFn = (route, state) => {
	return inject(AuthService).isAuthenticated ? true : inject(Router).createUrlTree(['auth/login'], { queryParams: { returnUrl: state.url } });
};

export const canActivateChild: CanActivateFn = (route, state) => {
	const currentRoute = state.url.replace('/admin/', '').split('?')[0];
	const authService = inject(AuthService);
	const router = inject(Router);

	if (currentRoute !== 'content-none' && !authService.userCanAccess(currentRoute)) {		
		return router.createUrlTree(['/admin/content-none']);
	}
	return true;
};

export const authGuardV2: CanActivateFn = (route, state) => {
	const authService = inject(AuthService);
	const router = inject(Router);

	if (!authService.isAuthenticated) {
		return router.createUrlTree(['auth/login'], { queryParams: { returnUrl: state.url } });
	}

	const currentRoute = state.url.replace('/admin/', '').split('?')[0];

	if (currentRoute !== 'content-none' && !authService.userCanAccess(currentRoute)) {
		return router.createUrlTree(['/admin/content-none']);
	}

	return true;
};
