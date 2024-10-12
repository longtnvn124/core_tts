import { Injectable } from '@angular/core';
import { environment } from '@env';
import { HttpClient , HttpParams } from '@angular/common/http';
import { map , Observable , timer } from 'rxjs';
import { paramsConditionBuilder } from '@utilities/helper';
import { Dto , DtoObject , dtoToIctuPaginator , IctuPaginator , IctuQueryCondition , IctuQueryParams } from '@model/dto';
import { Order } from '@model/order';
import { CartItem } from '@model/cart';

@Injectable( {
	providedIn : 'any'
} )
export class OrdersService {

	private readonly api : string = ''.concat( environment.deploy.api , 'orders/' );

	constructor( private http : HttpClient ) {}

	listOrders( paged : number , limit : number , created_by : number , select : string = '' ) : Observable<IctuPaginator<Order>> {
		const fromObject : IctuQueryParams = { limit , paged , order : 'DESC' , orderby : 'created_at' };
		if ( select ) {
			fromObject[ 'select' ] = select;
		}
		const params : HttpParams = paramsConditionBuilder( [ {
			conditionName : 'created_by' ,
			condition     : IctuQueryCondition.equal ,
			value         : created_by.toString( 10 )
		} ] , new HttpParams( { fromObject } ) );
		return this.http.get<Dto>( this.api , { params } ).pipe( map( ( res : Dto ) => dtoToIctuPaginator<Order>( res , limit ) ) );
	}

	get( id : number ) : Observable<Order> {
		return this.http.get<DtoObject<Order>>( ''.concat( this.api , id.toString( 10 ) ) ).pipe( map( res => res.data ) );
	}

	create( items : CartItem[] ) : Observable<Order> {
		const course_ids : number[] = items.filter( i => i.course ).map( i => i.course.id );
		return this.http.post<DtoObject<Order>>( ''.concat( this.api , 'checkout' ) , { course_ids } ).pipe( map( res => res.data ) );
	}

	createTest( items : CartItem[] ) : Observable<Order> {
		return timer( 2000 ).pipe( map( () => {
			const order : Order = {
				'id'         : 52 ,
				'user_id'    : 5011437 ,
				'donvi_id'   : 0 ,
				'products'   : {
					'9'  : {
						'id'           : 9 ,
						'donvi_id'     : 100 ,
						'title'        : 'Thành thạo Excel 2010' ,
						'price'        : 200000 ,
						'course_ids'   : [
							9
						] ,
						'sale_price'   : 2200 ,
						'coupon'       : '' ,
						'coupon_price' : 0 ,
						'date_end'     : '2024-04-11'
					} ,
					'12' : {
						'id'           : 12 ,
						'donvi_id'     : 103 ,
						'title'        : 'TỔNG HỢP VỀ KIỂM KÊ KHÍ NHÀ KÍNH' ,
						'price'        : 3000000 ,
						'course_ids'   : [
							12
						] ,
						'sale_price'   : 499999 ,
						'coupon'       : '' ,
						'coupon_price' : 0 ,
						'date_end'     : '2024-04-11'
					} ,
					'13' : {
						'id'           : 13 ,
						'donvi_id'     : 103 ,
						'title'        : 'KIỂM KÊ KHÍ NHÀ KÍNH CHUYÊN SÂU NGÀNH DỆT MAY' ,
						'price'        : 4000000 ,
						'course_ids'   : [
							13
						] ,
						'sale_price'   : 999999 ,
						'coupon'       : '' ,
						'coupon_price' : 0 ,
						'date_end'     : '2024-04-11'
					}
				} ,
				'price'      : 1502198 ,
				'total'      : 0 ,
				'note'       : '' ,
				'updated_by' : 5011437 ,
				'created_by' : 5011437 ,
				'status'     : 0 ,
				'created_at' : '2024-04-11T09:26:00.245Z' ,
				'updated_at' : '2024-04-11T09:26:00.245Z'
			};
			return order;
		} ) );
	}

	addCoupon( id : number , code : string ) : Observable<Order> {
		const params : HttpParams = new HttpParams( { fromObject : { code } } );
		return this.http.get<Dto>( ''.concat( this.api , id.toString( 10 ) , '/coupon' ) , { params } ).pipe( map( res => res.data ) );
	}

	deleteCoupon( id : number , code : string ) : Observable<Order> {
		const params : HttpParams = new HttpParams( { fromObject : { code } } );
		return this.http.delete<Dto>( ''.concat( this.api , id.toString( 10 ) , '/coupon' ) ).pipe( map( res => res.data ) );
	}

	getUrlPayOsPayment( id : number , returnUrl : string ) : Observable<string> {
		const fromObject : any    = { returnUrl };
		const params : HttpParams = new HttpParams( { fromObject } );
		return this.http.get<Dto>( ''.concat( this.api , id.toString() , '/create-payment-url' ) , { params } ).pipe( map( res => res.data ) );
	}

	validPayment( fromString : string ) : Observable<boolean> {
		const params : HttpParams = new HttpParams( { fromString } );
		return this.http.get<{ code : string, message : string }>( ''.concat( this.api , 'return' ) , { params } ).pipe( map( res => res.code === 'success' ) );
	}

}
