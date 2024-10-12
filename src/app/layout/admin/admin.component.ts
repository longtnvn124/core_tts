// Angular import
import { AfterViewInit, Component, OnChanges, OnInit, SimpleChanges, ViewChild, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatDrawer, MatDrawerMode } from '@angular/material/sidenav';

// Project import
import { menus } from '@utilities/syscats';
import { LayoutService } from '@theme/services/layout.service';
import { HIDDEN_MENUS, environment } from 'src/environments/environment';
import { Navigation } from '@theme/types/navigation';
import { AuthService } from '@service/core/auth.service';
import { Ucase } from '@model/ucase';
import { MenuItem } from 'primeng/api';
import { state, style, transition, trigger, useAnimation } from '@angular/animations';
import { Observable, Subscription, debounceTime, delay, filter, of, switchMap } from 'rxjs';
import { NotificationService, SideNavigationMenu } from '@theme/services/notification.service';
import { PersonalInfo } from '@model/user';
import { UserService } from '@service/core/user.service';
import { NavigationEnd, Router } from '@angular/router';
import { UnsubscribeAndCompleteObserversOnDestroy, UnsubscribeOnDestroy } from '@utilities/decorator';


@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.scss'],
	animations: [
		trigger('overlayAnimations', [
			state('open', style({
				opacity: 1,
				visibility: 'visible'
			})),
			state('close', style({
				opacity: 0,
				visibility: 'hidden'
			}))
		]),
		trigger('dropdown', [
			state('open', style({
				top: '100%',
				opacity: 1,
				visibility: 'visible'
			})),
			state('close', style({
				top: 'calc(100% + 13px)',
				opacity: 0,
				visibility: 'hidden'
			}))
		]),
		trigger('navigationMenuEffect', [state('open', style({ right: 0 }))]),
	]
})
@UnsubscribeOnDestroy()

export class AdminComponent implements OnInit, AfterViewInit, OnChanges {
	// public props
	@ViewChild('sidebar') sidebar!: MatDrawer;

	menus: Navigation[];

	modeValue: MatDrawerMode = 'side';

	currentApplicationVersion: string = environment.appVersion;

	isSidebarClosed: boolean = false;

	subscriptions = new Subscription();

	// side navigation menu
	sideNavigationMenuSettings: SideNavigationMenu;

	menuSize = '300px';

	initRight = '-310px';

	defaultNavigationOffsetTop = '60px';

	navigationOffsetTop = this.defaultNavigationOffsetTop;

	sideNavigationOffCanvasSize = '0';

	navigationMenuState: 'open' | 'close' = 'close';
	// Constructor
	private routerSubscription: Subscription;

	constructor(
		private breakpointObserver: BreakpointObserver,
		private auth: AuthService,
		private layoutService: LayoutService,
		private notificationService: NotificationService,
		private userService: UserService,
		private router: Router,

	) {
		const observerOpenSideNavigation = this.notificationService.onSideNavigationMenuOpen().pipe(
			debounceTime(100),
			switchMap(settings => {
				this.sideNavigationMenuSettings = settings;
				this.menuSize = settings.size ? `${settings.size}px` : '100%';
				this.initRight = '-' + (settings.size ? `${settings.size + 10}px` : '110%');
				this.navigationOffsetTop = settings.offsetTop ? settings.offsetTop : this.defaultNavigationOffsetTop;
				this.sideNavigationOffCanvasSize = settings['offCanvas'] ? Math.max(0, (settings.size + 10)) + 'px' : '0';
				return of('');
			}
			), delay(50)).subscribe(() => this.navigationMenuState = 'open');

		this.subscriptions.add(observerOpenSideNavigation);

		const observerCloseSideNavigation = this.notificationService.onSideNavigationMenuClosed().pipe(debounceTime(100)).subscribe(() => {
			this.navigationMenuState = 'close';
			this.sideNavigationOffCanvasSize = '0';
		});

		this.subscriptions.add(observerCloseSideNavigation);

	}
	ngOnChanges(changes: SimpleChanges): void {
		throw new Error('Method not implemented.');
	}

	// life cycle event
	ngOnInit() {
		this.breakpointObserver.observe(['(min-width: 1025px)', '(max-width: 1024.98px)']).subscribe((result) => {
			if (result.breakpoints['(max-width: 1024.98px)']) {
				this.modeValue = 'over';
			} else if (result.breakpoints['(min-width: 1025px)']) {
				this.modeValue = 'side';
			}
		});
		// const lang = APP_CONFIGS.multiLanguage ? settings : null;
		this.menus = this.useCase2ToMenuItem(this.auth.permission.data.menus, null);
	}

	useCase2ToMenuItem(data: Ucase[], lang: any = null): Navigation[] {
		const translated = lang ? lang.translations.route : null;
		let result: Navigation[] = [];
		if (data.length) {
			data.filter(u => u.position === 'left').forEach(({ child, title, icon, id }) => {
				if (!HIDDEN_MENUS.has(id)) {
					const menu: Navigation = {
						id: id,
						title: translated && translated.hasOwnProperty(id) ? translated[id] : title,
						icon: icon,
						type: 'item',
						url: id,
					};
					if (child && child.length) {
						menu['children'] = [];
						const styleClass = [id ? id.replace(/\//gmi, '__') : ''];
						child.filter(u => u.position === 'left').forEach(nodeChild => {
							if (!HIDDEN_MENUS.has(nodeChild.id)) {
								menu['children'].push({
									id: nodeChild.id,
									url: nodeChild.id,
									title: translated && translated.hasOwnProperty(nodeChild.id) ? translated[nodeChild.id] : nodeChild.title,
									icon: nodeChild.icon,
									link: nodeChild.id,
									type: 'item',

								});
								styleClass.push(nodeChild.id ? nodeChild.id.replace(/\//gmi, '__') : '');
							}
						});
						menu['styleClass'] = styleClass.join(' ');
						menu['type'] = 'collapse';
					} else {
						menu['url'] = id;
					}
					result.push(menu);
				}
			})
		}
		return result;
	}

	ngAfterViewInit(): void {
		this.layoutService.layoutState.subscribe(() => this.sidebar.toggle());
		this.sidebar.openedStart.subscribe(() => this.isSidebarClosed = false);
		this.sidebar.closedStart.subscribe(() => this.isSidebarClosed = true);

	}
	closePanel(settings: SideNavigationMenu) {
		if (settings && !settings['preventCloseWhenClickOnOverlay']) {
			this.notificationService.closeSideNavigationMenu(settings.name);
		}
	}

	// closePanel(name: string) {
	//     this.notificationService.closeSideNavigationMenu(name);
	// }

	loadInit() {
		// this.personalInfo = this.userService.getPersonalInfo();
	}

}
