import {Injectable} from '@angular/core';
import {getApiRouteLink} from "@env";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ThemeSettingsService} from "@service/core/theme-settings.service";
import {HttpParamsHeplerService} from "@service/core/http-params-hepler.service";
import {map, Observable} from "rxjs";
import {Dto, IctuConditionParam, IctuQueryCondition} from "@model/dto";
import {FileService} from "@service/core/file.service";
import {OvicFile} from "@model/file";


export interface DmLoaiVanBan {
    id?: number;
    title: string;
    des: string;
    files?:OvicFile[];
}

@Injectable({
    providedIn: 'root'
})
export class DmLoaivanbanService {
    private readonly api = getApiRouteLink('dm-loaivanban/');


    constructor(
        private http: HttpClient,
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


    search(page: number, ten: string, limit?: number): Observable<{ recordsTotal: number; data: DmLoaiVanBan[] }> {
        const conditions: IctuConditionParam[] = [];

        if (ten) {
            conditions.push({
                conditionName: 'title',
                condition: IctuQueryCondition.like,
                value: `%${ten}%`,
            });
        }

        const fromObject = {
            orderby: 'id',
            order: 'ASC',
            limit: limit ? limit : this.themeSettingsService.settings.rows,
            paged: page,
        };

        const params = this.httpParamsHelper.paramsConditionBuilder(conditions, new HttpParams({fromObject}));

        return this.http.get<Dto>(this.api, {params}).pipe(
            map((res) => ({
                recordsTotal: res.recordsFiltered,
                data: res.data,
            })));
    }
}
