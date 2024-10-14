import { Injectable } from '@angular/core';
import {getApiRouteLink} from "@env";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Dto} from "@model/dto";


export interface DmLoaiVanBan{
  id?:number;
  title:string;
  status:number;
}
@Injectable({
  providedIn: 'root'
})
export class DmLoaiVanbanService {
  private readonly api = getApiRouteLink('dm_loai_vanban');


  constructor(
    private http: HttpClient
  ) { }

  add(data:any):Observable<any> {
    return this.http.post<Dto>(this.api,data).pipe(map(res=>res.data));
  }
  update(id:number,data:any): Observable<any>{
    return this.http.put<Dto>( this.api.concat( id.toString() ) , data ).pipe(
      map( res => res.data )
    );
  }
  delete(id:number):Observable<any>{
    return this.http.delete<Dto>( this.api.concat( id.toString() ) ).pipe(
      map( res => res.data )
    );
  }



}
