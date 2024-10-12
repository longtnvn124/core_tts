import { Component } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { AuthService } from '@service/core/auth.service';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { NotificationService } from '@appNotification';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	// public props
	private subscription = new Subscription();

	isSpinnerVisible: boolean = true;

	isLoading: boolean = false;
	// constructor
	constructor(
		private router: Router,
		private auth: AuthService,
		private notification: NotificationService
	) {
		const observerOnLoading = this.notification.onAppLoading.pipe(debounceTime(50), distinctUntilChanged()).subscribe(isLoading => this.isLoading = isLoading);
		this.subscription.add(observerOnLoading);

		this.router.events.subscribe({
			next: (event): void => {
				if (event instanceof NavigationStart) {
					this.isSpinnerVisible = true;
				} else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
					this.isSpinnerVisible = false;
				}
			},
			error: (): boolean => this.isSpinnerVisible = false
		});
		this.auth.onGetToLoginPage.pipe(debounceTime(100)).subscribe(() => this.router.navigateByUrl('/auth/login'));
		this.notification.onSignOut.pipe(debounceTime(100)).subscribe(() => this.auth.logout());
	}
}
