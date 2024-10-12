import { Injectable } from '@angular/core';
import { HttpClient , HttpParams } from '@angular/common/http';
import { map , Observable } from 'rxjs';
import { SystemConfig } from '@model/system-config';
import { getApiRouteLink } from '@env';
import { DtoObject } from '@model/dto';

@Injectable( {
	providedIn : 'any'
} )
export class SysConfigsService {

	private readonly api : string = getApiRouteLink( 'configs/' );

	constructor( private http : HttpClient ) {}

	getAppConfigs( select : string = '' ) : Observable<SystemConfig[]> {
		const params : HttpParams = select ? new HttpParams().set( 'select' , select ) : new HttpParams();
		return this.http.get<DtoObject<SystemConfig[]>>( this.api , { params } ).pipe( map( r => r.data ) );
	}
}
