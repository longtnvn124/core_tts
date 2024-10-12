import { inject, Injectable, TemplateRef } from '@angular/core';
import {
  BehaviorSubject,
  filter,
  firstValueFrom,
  map,
  Observable,
  Subject,
  tap,
} from 'rxjs';
import { MessageService } from 'primeng/api';
import { getApiRouteLink } from '@env';
import { refreshTokenGetter, tokenSetter } from '../../app.module';
import { HttpClient } from '@angular/common/http';
import {
  ConfirmComponent,
  ConfirmDialogData,
} from '@theme/components/confirm/confirm.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ButtonBase } from '@model/button';
import { ConfirmDeleteComponent } from '@theme/components/confirm-delete/confirm-delete.component';
import { NORMAL_MODAL_OPTIONS } from '@utilities/syscats';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
export interface SideNavigationMenu {
  name?: string;
  template?: TemplateRef<any>;
  size: number;
  offCanvas?: boolean;
  offsetTop?: string; // 60px | 20% ...
  // preventCloseWhenClickOnOverlay?: true; // 60px | 20% ...
}
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private observerSignOut$: Subject<string> = new Subject<string>();

  private observerSessionExpired$: Subject<string> = new Subject<string>();

  private refreshTokenSubject$: BehaviorSubject<string> =
    new BehaviorSubject<string>('');

  private OBSERVE_CLOSE_RIGHT_CONTEXT_MENU = new Subject<string>();

  private OBSERVE_OPEN_SIDE_NAVIGATION_MENU = new Subject<SideNavigationMenu>();

  private OBSERVE_CLOSE_SIDE_NAVIGATION_MENU = new Subject<string>();

  private OBSERVE_ON_SCREEN_RESIZE = new BehaviorSubject<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  private OBSERVE_LOADING_ANIMATION = new Subject<boolean>();

  constructor(private modalService: NgbModal,
  ) { }

  /****************************************************************************
   * Loading full screen
   * ***************************************************************************/

  get onAppLoading(): Observable<boolean> {
    return this.OBSERVE_LOADING_ANIMATION.asObservable();
  }

  isProcessing(isLoading = true) {
    this.OBSERVE_LOADING_ANIMATION.next(isLoading);
  }

  /****************************************************************************
   * Toast message
   * ***************************************************************************/

  private messageService: MessageService = inject(MessageService);

  toastSuccess(body: string, heading: string = 'Thông báo'): void {
    this.messageService.add({
      severity: 'success',
      summary: heading || 'Success',
      detail: body,
      closable: true,
    });
  }

  toastWarning(body: string, heading: string = 'Cảnh báo'): void {
    this.messageService.add({
      severity: 'warn',
      summary: heading || 'Warn',
      detail: body,
      closable: true,
    });
  }

  toastInfo(body: string, heading: string = 'Thông báo'): void {
    this.messageService.add({
      severity: 'info',
      summary: heading || 'Info',
      detail: body,
      closable: true,
    });
  }

  toastError(body: string, heading: string = 'Cảnh báo'): void {
    this.messageService.add({
      severity: 'error',
      summary: heading || 'Error',
      detail: body,
      closable: true,
    });
  }

  /************************* End *************************/

  sessionExpired(message?: string) {
    this.observerSessionExpired$.next(message || '');
  }

  get onSessionExpired(): Observable<string> {
    return this.observerSessionExpired$;
  }

  /****************************************************************************
   * Refresh token
   * ***************************************************************************/
  private http: HttpClient = inject(HttpClient);

  private refreshToken(): Observable<string> {
    this.refreshTokenSubject$.next('');
    return this.http
      .post<{ data: string }>(getApiRouteLink('refresh-token'), {
        refresh_token: refreshTokenGetter(),
      })
      .pipe(
        map(({ data }) => tokenSetter(data)),
        tap((access_token) => this.refreshTokenSubject$.next(access_token))
      );
  }

  waitingForNewAccessTokenToBeServed(): Observable<string> {
    return this.refreshTokenSubject$
      .asObservable()
      .pipe(filter((token: string) => token != ''));
  }

  /************************* End *************************/

  private dialog: MatDialog = inject(MatDialog);

  public get createDialog(): MatDialog {
    return this.dialog;
  }

  private dataConfirmSignOut: ConfirmDialogData = {
    title: 'XÁC NHẬN ĐĂNG XUẤT',
    heading: 'Bạn có chắc chắn muốn đăng xuất không?',
    buttons: [
      {
        name: 'yes',
        label: 'Có',
        icon: 'ti ti-check',
        class: 'p-button-primary v-step-popup__btn'
      },
      {
        name: 'no',
        label: 'Không',
        icon: 'ti ti-x',
        class: 'p-button-secondary v-step-popup__btn'
      }
    ]
  };

  confirmTemplate(template: TemplateRef<any>, disableClose: boolean = true, panelClass: string = 'ictu-app-notification'): MatDialog {
    this.dialog.open(template, {
      disableClose: true,
      panelClass: 'ictu-app-notification',
    });
    return this.dialog;
  }

  confirm(data: ConfirmDialogData): Observable<ButtonBase> {
    const dialogRef: MatDialogRef<ConfirmComponent> = this.dialog.open(
      ConfirmComponent,
      { data, disableClose: true, panelClass: 'ictu-app-notification' }
    );
    return dialogRef.afterClosed();
  }

  confirmSignOut() {
    void this._handleConfirmSignOut();
  }

  private async _handleConfirmSignOut(): Promise<void> {
    const confirm = await firstValueFrom(
      this.confirm(this.dataConfirmSignOut)
    ).then((u) => u.name);
    if (confirm === 'yes') {
      this.observerSignOut$.next('logout');
    }
  }

  get onSignOut(): Observable<string> {
    return this.observerSignOut$.asObservable();
  }

  //confirmDelete

  confirmDelete(message: string = null, head: string = null): Promise<boolean> {
    const c = this.modalService.open(
      ConfirmDeleteComponent,
      NORMAL_MODAL_OPTIONS
    );
    if (head) {
      c.componentInstance.head = head;
    }
    if (message) {
      c.componentInstance.message = message;
    }
    return c.result;
  }


  // open navigation menu
  get eventCloseRightContextMenu$(): Observable<string> {
    return this.OBSERVE_CLOSE_RIGHT_CONTEXT_MENU.asObservable();
  }

  onSideNavigationMenuOpen(): Observable<SideNavigationMenu> {
    return this.OBSERVE_OPEN_SIDE_NAVIGATION_MENU.asObservable();
  }

  openSideNavigationMenu(settings: SideNavigationMenu): void {
    settings.name = settings.name || 'default-menu';
    this.OBSERVE_OPEN_SIDE_NAVIGATION_MENU.next(settings);
  }

  onSideNavigationMenuClosed(): Observable<string> {
    return this.OBSERVE_CLOSE_SIDE_NAVIGATION_MENU.asObservable();
  }

  closeSideNavigationMenu(menuName: string = 'close'): void {
    this.OBSERVE_CLOSE_SIDE_NAVIGATION_MENU.next(menuName);
  }

  get observeScreenSize(): Observable<{ width: number; height: number }> {
    return this.OBSERVE_ON_SCREEN_RESIZE.asObservable();
  }

  setScreenSize(data: { width: number; height: number }): void {
    this.OBSERVE_ON_SCREEN_RESIZE.next(data);
  }

}
