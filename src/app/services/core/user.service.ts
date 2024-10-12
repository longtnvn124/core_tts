import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment, getApiRouteLink } from '@env';
import { ConstructUser, PersonalInfo, User, UserMeta, UserUpdatableFields } from '@model/user';
import { map, Observable } from 'rxjs';
import { Dto, IctuConditionParam, IctuQueryCondition, IctuQueryParams } from '@model/dto';
import { paramsConditionBuilder } from '@utilities/helper';
import { HttpParamsHeplerService } from './http-params-hepler.service';
import { ConditionOption } from '@model/condition-option';

@Injectable({
	providedIn: 'any'
})
export class UserService {
	private readonly apiRegister: string = getApiRouteLink('register');
	private readonly apiProfile: string = getApiRouteLink('profile');
	private readonly api = getApiRouteLink('users');
	private readonly userMetaApi = getApiRouteLink('user-meta');

	constructor(
		private http: HttpClient,
		private httpParamsHelper: HttpParamsHeplerService,
	) { }

	create(user: ConstructUser): Observable<number> {
		return this.http.post<Dto>(this.apiRegister, user).pipe(map(res => res.data));
	}

	get(): Observable<User> {
		return this.http.get<Dto>(this.apiProfile).pipe(map(res => res.data as User));
	}
	getUserById(id: number): Observable<User> {
		const conditions: IctuConditionParam[] = [{
			conditionName: 'id',
			condition: IctuQueryCondition.equal,
			value: id.toString()
		}];

		const params = paramsConditionBuilder(conditions);
		return this.http.get<Dto>(this.api, { params }).pipe(map(res => res.data as User));
	}

	getUserByIds(ids: number[]): Observable<User[]> {
		const fromObject: IctuQueryParams = {
			include: ids.join(','),
			include_by: 'id',
			limit: '-1'
		};
		const params = new HttpParams({ fromObject });

		return this.http.get<Dto>(this.api, { params }).pipe(map(res => res.data));
	}

	update(info: Partial<UserUpdatableFields>): Observable<number> {
		return this.http.put<Dto>(this.apiProfile, info).pipe(map(res => res.data));
	}

	updateMeta(info: UserMeta): Observable<number> {
		return this.http.post<Dto>(this.userMetaApi, info).pipe(map(res => res.data));
	}
	getUserByCols(condition: HttpParams): Observable<User[]> {
		return this.http.get<Dto>(this.api, { params: condition }).pipe(
			map(res => res.data)
		);
	}
	getUserByCol(col: string, value: string): Observable<User[]> {
		const search = new HttpParams().set(col, value);
		return this.http.get<Dto>(this.api, { params: search }).pipe(
			map(res => res.data)
		);
	}

	getUserByItem(email: string, col: string): Observable<User[]> {
		const by = new HttpParams().set('by', col);
		return this.http.get<Dto>(this.api.concat('/', email), { params: by }).pipe(
			map(res => res.data)
		);
	}

	/*************************************************
	* mặc đinh filter theo user hiện tại rồi
	* *********************************************/
	getUserMeta(meta_key: string = null): Observable<UserMeta[]> {
		const conditions: IctuConditionParam[] = [];
		if (meta_key) {
			conditions.push({
				conditionName: 'meta_key',
				condition: IctuQueryCondition.equal,
				value: meta_key
			});
		}
		const params = paramsConditionBuilder(conditions);
		return this.http.get<Dto>(getApiRouteLink('user-meta'), { params }).pipe(map(res => res.data));
	}

	/*************************************************
	 * mặc đinh tạo meta theo user hiện tại rồi
	 * *********************************************/
	updateUserInfo(id: number, data): Observable<number> {
		const url = ''.concat(this.api, '/', id.toString());
		return this.http.put<any>(url, data);
	}

	getUserByPageNew(option: ConditionOption): Observable<{ data: User[], recordsFiltered: number }> {
		let filter = option.page ? this.httpParamsHelper.paramsConditionBuilder(option.condition).set("paged", option.page) : this.httpParamsHelper.paramsConditionBuilder(option.condition);
		if (option.set && option.set.length)
			option.set.forEach(f => {
				filter = filter.set(f.label, f.value);
			})
		return this.http.get<Dto>(this.api, { params: filter }).pipe(
			map(res => { return { data: res.data, recordsFiltered: res.recordsFiltered } })
		);
	}

	updateUserByEmail(email: string, col: string, data: any): Observable<any> {
		const by = new HttpParams().set('by', col);
		return this.http.put<Dto>(this.api.concat('/', email), data, { params: by }).pipe(
			map(res => res.data)
		);
	}

	addRoles(user_id: number, role_ids: string[]): Observable<{ data: string[], message: string }> {
        const url = ''.concat(this.api, '/roles/', user_id.toString(10));
        return this.http.post<{ data: string[], message: string }>(url, { role_ids })
    }

	deleteRoles(user_id: number, role_ids: string[]): Observable<any> {
		const url = ''.concat(this.api, '/roles/', user_id.toString(10));
		return this.http.delete<any>(url, { body: { role_ids: role_ids } });
	}

	updateUserS(id, data): Observable<number> {
		// return this.http.put<any>(this.api.concat('/', id.toString()), data);
		return this.http.put<Dto>(this.api.concat('/', id.toString()), data).pipe(map(res => res.data));
	}

	deleteUser(id: any): Observable<number> {
        return this.http.delete<any>(''.concat(this.api, '/', id.toString()));
    }
	

}
