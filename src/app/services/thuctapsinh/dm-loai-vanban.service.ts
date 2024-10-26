import {Injectable} from '@angular/core';
import {getApiRouteLink} from "@env";
import {HttpClient, HttpParams} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Dto, IctuConditionParam, IctuQueryCondition} from "@model/dto";
import {HttpParamsHeplerService} from "@service/core/http-params-hepler.service";
import {ThemeSettingsService} from "@service/core/theme-settings.service";


export interface DmLoaiVanBan {
  id?: number;
  title: string;
  status: number;
}

@Injectable({
  providedIn: 'root'
})
export class DmLoaiVanbanService {
  private readonly api = getApiRouteLink('dm-dichvu/');


  constructor(
    private http : HttpClient,
    private themeSettingsService: ThemeSettingsService,
    private httpParamsHelper: HttpParamsHeplerService,
  ) {
  }

  add(data: any): Observable<any> {
    return this.http.post<Dto>(this.api, data).pipe(map(res => res.data));
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put<Dto>(this.api.concat(id.toString()), data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<Dto>(this.api.concat(id.toString()));
  }


  search(page: number, ten: string ,limit?: number): Observable<{ recordsTotal: number; data: DmLoaiVanBan[] }> {
    const conditions: IctuConditionParam[] = [

    ];
    if (ten) {
      conditions.push({
        conditionName: 'ten_dm',
        condition: IctuQueryCondition.like,
        value: `%${ten}%`,
      });
    }

    const fromObject = {
      orderby: 'id',
      order: 'ASC',//DESC
      limit:limit ? limit : this.themeSettingsService.settings.rows,
      paged: page,
    };


    const params = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({ fromObject }));
    return this.http.get<Dto>(this.api, { params }).pipe(map((res) => ({recordsTotal: res.recordsFiltered, data: res.data,})));
  }


}
