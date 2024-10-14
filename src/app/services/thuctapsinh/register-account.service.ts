import { Injectable } from '@angular/core';
import {getApiRouteLink} from "@env";
import {HttpClient} from "@angular/common/http";
import {HttpParamsHeplerService} from "@service/core/http-params-hepler.service";
import {ThemeSettingsService} from "@service/core/theme-settings.service";
import {AuthService} from "@service/core/auth.service";
import {map, Observable} from "rxjs";
import {Dto} from "@model/dto";

@Injectable({
  providedIn: 'root'
})
export class RegisterAccountService {
  private readonly api = getApiRouteLink('register-account/');

  constructor(
      private http: HttpClient,
  ) {
  }

  registerAccount(data: any): Observable<any> {
    return this.http.post<Dto>(''.concat(this.api), data).pipe(map(res => res.data));
  }


  VerifiCationAccount(id: number, data: any): Observable<any> {
    return this.http.post<Dto>(''.concat(getApiRouteLink('verification/'), id.toString(10)), data);
  }

  verifiCationAccountAcpect(text: string): Observable<any> {
    // return this.http.get<Dto>(''.concat(getRoute('verification/'),text),null).pipe(map(res=>res));
    const url = text ? ''.concat(getApiRouteLink('verification/'), text) : this.api;
    return this.http.get<Dto>(url).pipe(map(res => res.data));
  }
}
