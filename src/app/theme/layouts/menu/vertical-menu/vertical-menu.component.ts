// Angular import
import { Component , Input , OnDestroy, OnInit } from '@angular/core';
import { Location , LocationStrategy } from '@angular/common';

// project import
import { NavigationItem } from '@theme/types/navigation';
import { NotificationService } from '@appNotification';
import { AuthService } from '@service/core/auth.service';
import { Subject , takeUntil } from 'rxjs';

@Component( {
	selector    : 'app-vertical-menu' ,
	templateUrl : './vertical-menu.component.html' ,
	styleUrls   : [ './vertical-menu.component.scss' ]
} )
export class VerticalMenuComponent implements OnDestroy {
	// public props
	@Input() menus : NavigationItem[];

	userDisplay : string = 'unknown';

	roleName : string = 'unknown';

	avatar : string = 'assets/images/user/avatar-2.jpg';

	private onDestroy$ : Subject<string> = new Subject<string>();

	// Constructor
	constructor(
		private location : Location ,
		private locationStrategy : LocationStrategy ,
		private notification : NotificationService ,
		private auth : AuthService
	) {
		this.auth.onUserSetup.pipe( takeUntil( this.onDestroy$ ) ).subscribe( ( user ) => {
			this.userDisplay = user.display_name;
			this.avatar      = user.avatar;
		} );		
		this.roleName = 'Admin';
		// this.roleName = this.auth.permission.data.roles.find(dt => dt.name).title;
	}

	ngOnDestroy() : void {
		this.onDestroy$.next( '' );
		this.onDestroy$.complete();
	}

	// public method
	fireOutClick() {
		let current_url : string = this.location.path();
		const baseHref : string  = this.locationStrategy.getBaseHref();
		if ( baseHref ) {
			current_url = baseHref + this.location.path();
		}
		const link = 'a.nav-link[ href=\'' + current_url + '\' ]';
		const ele  = document.querySelector( link );
		if ( ele !== null && ele !== undefined ) {
			const parent      = ele.parentElement;
			const up_parent   = parent?.parentElement?.parentElement;
			const last_parent = up_parent?.parentElement;
			if ( parent?.classList.contains( 'coded-hasmenu' ) ) {
				parent.classList.add( 'coded-trigger' );
				parent.classList.add( 'active' );
			} else if ( up_parent?.classList.contains( 'coded-hasmenu' ) ) {
				up_parent.classList.add( 'coded-trigger' );
				up_parent.classList.add( 'active' );
			} else if ( last_parent?.classList.contains( 'coded-hasmenu' ) ) {
				last_parent.classList.add( 'coded-trigger' );
				last_parent.classList.add( 'active' );
			}
		}
	}

	confirmLogout() {
		this.notification.confirmSignOut();
	}

}
