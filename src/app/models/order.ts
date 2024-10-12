export interface Product {
	id : number,
	donvi_id : number,
	title : string,
	price : number,
	sale_price : number,
	course_ids : number[],
	date_end : string;
	coupon? : string,
	coupon_price? : number,
}

export interface OrderProduct {
	[ T : string ] : Product;
}

export interface Order {
	id : number,
	user_id : number,
	// course_id : number[],
	donvi_id : number,
	products : OrderProduct;
	price : number,
	total : number,
	note : string,
	updated_by : number,
	created_by : number,
	status : 0 | 1, //Trạng thái thanh toán của đơn hàng; 0 = Chờ thanh toán 1 = Đã thanh toán
	created_at : string,
	updated_at : string,
	is_deleted? : 0 | 1,
	deleted_by? : number,
}
