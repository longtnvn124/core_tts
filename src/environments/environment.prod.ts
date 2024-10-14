import packageInfo from '../../package.json';
import { Environment } from './environment.model';

const server = 'https://api-dev.ictu.vn:10091/';
export const environment : Environment = {
	appVersion : packageInfo.version ,
	production : true ,
	deploy: {
		title: '', // title website
		googleClientId: '196027039836-kjhoo8f8p3i2eldcodouvs94p1gbi4jo.apps.googleusercontent.com',
		domain: 'https://api-dev.ictu.vn',
		url: server,
		api: server + 'luyenthi-thpt/api/',
		fileDir: server + 'folder/luyenthi-thpt/',
		media: server + 'luyenthi-thpt/api/uploads/',
		driverFile: server + 'luyenthi-thpt/api/driver/',
		aws: server + 'luyenthi-thpt/api/aws/',
		// X_APP_ID: '60A111A9-09EE-48B6-9B2D-6CCB70F56B1F'
		X_APP_ID: '64c9a192-cc0e-4198-acb8-2188dbb472fa'
	}

	// deploy : {
	// 	title                           : 'Hệ thống quản lý học tập trực tuyến - [LMS]' ,
	// 	googleClientId                  : '434017265280-s5825cmm5f1gggkjukqgcpqvm7kv7emq.apps.googleusercontent.com' ,
	// 	domain                          : 'https://api-dev.ictu.vn' ,
	// 	url                             : 'https://api-dev.ictu.vn:10091/' ,
	// 	api                             : 'https://api-dev.ictu.vn:10091/lcms_v3/api/' ,
	// 	fileDir                         : 'https://api-dev.ictu.vn:10091/folder/lcms_v3/' ,
	// 	media                           : 'https://api-dev.ictu.vn:10091/lcms_v3/api/uploads/' ,
	// 	driverFile                      : 'https://api-dev.ictu.vn:10091/lcms_v3/api/driver/' ,
	// 	aws                             : 'https://api-dev.ictu.vn:10091/lcms_v3/api/aws/' ,
	// 	X_APP_ID                        : 'B89FB354-CEA7-4FDD-BA67-C9418489A3D4' ,
	// 	enableReviewAfterCompleteLesson : false
	// }
};

export const linkDriveFileInfo : ( id : string ) => string     = ( id : string ) : string => environment.deploy.driverFile + id;
export const linkDownloadDriveFile : ( id : string ) => string = ( id : string ) : string => environment.deploy.driverFile + id + 'download';
export const linkFileInfo : ( id : string ) => string          = ( id : string ) : string => environment.deploy.media + id;
export const getLinkDownload : ( id : string ) => string       = ( id : string ) : string => environment.deploy.media + 'file/' + id;
export const linkDownloadFile : ( id : string ) => string      = ( id : string ) : string => environment.deploy.media + id + 'download';
export const linkAwsInfo : ( id : string ) => string           = ( id : string ) : string => environment.deploy.aws + id;
export const linkGetFileContentAws : ( id : number ) => string = ( id : number ) : string => environment.deploy.aws + 'file/' + id.toString( 10 );
export const getLinkDriverStream : ( id : string ) => string   = ( id : string ) : string => environment.deploy.driverFile + 'stream/' + id;

export const getApiRouteLink : ( route : string ) => string = ( route : string ) : string => ( route ? ''.concat( environment.deploy.api , route ) : environment.deploy.api );

export const getHostDomain : ( suffix? : string ) => string = ( suffix? : string ) : string => ( suffix ? ''.concat( environment.deploy.domain , suffix ) : environment.deploy.domain );

// export const allowedDomains : Array<string | RegExp>   = [ 'https://localhost:8008/' , 'https://api-dev.ictu.vn' ];
// export const disallowedRoutes : Array<string | RegExp> = [];
export const ENCRYPT_KEY : string            = 'JkNxq7mS6WHDy04u';
export const REFRESH_TOKEN_KEY : string      = '_pr_ocmQk73vw6fp';
export const ACCESS_TOKEN_KEY : string       = '_pr_ocmI69Hl3avA';
export const USER_STORAGE_KEY : string       = '_pr_ocmJg6Db36rU';
export const STUDENT_STORAGE_KEY : string    = '_pr_ocm56ZvFpN4H';
export const PERMISSION_STORAGE_KEY : string = '_pr_ocmF3ACvs0O7';
export const ROLES_STORAGE_KEY : string      = '_pr_ocmEMSu316PB';
export const USER_META_STORAGE_KEY : string  = '_pr_ocmCX40BVR9Z';
export const USER_COURSE_IDS : string        = '_pr_ocmPR0k12vL0';
export const AUTH_OPTIONS : string           = '_pr_ocm057iFXr48';
export const CART_KEY : string               = '__lms-v3_cart';
export const IDENTITY_CODE : string          = '12vL0?ZkNxq7mS';
/* define menu filter */
export const HIDDEN_MENUS = new Set(['message/notification-details']); // id của menu không muốn hiển thị
export const SELECTED_DONVI_ID = 'd8lPtY#N';
export const DEFAULT_AVATAR = `/assets/images/client/avatar_default.svg`;