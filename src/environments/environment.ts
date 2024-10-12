import packageInfo from '../../package.json';
import { Environment } from './environment.model';

const server = 'https://api-dev.ictu.vn:10091/';
export const environment: Environment = {
	appVersion: packageInfo.version,
	production: false,
	deploy: {
		title: '', // title website
		googleClientId: '196027039836-kjhoo8f8p3i2eldcodouvs94p1gbi4jo.apps.googleusercontent.com',
		domain: 'https://api-dev.ictu.vn',
		url: server,
		api: server + 'thuctapsinh/api/',
		fileDir: server + 'folder/thuctapsinh/',
		media: server + 'thuctapsinh/api/uploads/',
		driverFile: server + 'thuctapsinh/api/driver/',
		aws: server + 'thuctapsinh/api/aws/',
		// X_APP_ID: '60A111A9-09EE-48B6-9B2D-6CCB70F56B1F'
		X_APP_ID: '0645451e-3396-41eb-8d02-ae39cb030cdd'
	}
};

export const linkDriveFileInfo: (id: string) => string = (id: string): string => environment.deploy.driverFile + id;
export const linkDownloadDriveFile: (id: string) => string = (id: string): string => environment.deploy.driverFile + id + 'download';
export const linkFileInfo: (id: string) => string = (id: string): string => environment.deploy.media + id;
export const getLinkDownload: (id: string) => string = (id: string): string => environment.deploy.media + 'file/' + id;
export const linkDownloadFile: (id: string) => string = (id: string): string => environment.deploy.media + id + 'download';
export const linkAwsInfo: (id: string) => string = (id: string): string => environment.deploy.aws + id;
export const linkGetFileContentAws: (id: number) => string = (id: number): string => environment.deploy.aws + 'file/' + id.toString(10);
export const getLinkDriverStream: (id: string) => string = (id: string): string => environment.deploy.driverFile + 'stream/' + id;

export const getApiRouteLink: (route: string) => string = (route: string): string => (route ? ''.concat(environment.deploy.api, route) : environment.deploy.api);
export const getHostDomain: (suffix?: string) => string = (suffix?: string): string => (suffix ? ''.concat(environment.deploy.domain, suffix) : environment.deploy.domain);

// export const allowedDomains : Array<string | RegExp>   = [ 'https://localhost:8008/' , 'https://api-dev.ictu.vn' ];
// export const disallowedRoutes : Array<string | RegExp> = [];
export const ENCRYPT_KEY: string = 'ZkNxq7mS6WHDy04u';
export const REFRESH_TOKEN_KEY: string = '__ocmQk73vw6fp';
export const ACCESS_TOKEN_KEY: string = '__ocmI69Hl3avA';
export const USER_STORAGE_KEY: string = '__ocmJg6Db36rU';
export const PERMISSION_STORAGE_KEY: string = '__ocmF3ACvs0O7';
export const ROLES_STORAGE_KEY: string = '__ocmEMSu316PB';
export const USER_META_STORAGE_KEY: string = '__ocmCX40BVR9Z';
export const AUTH_OPTIONS: string = '__ocm057iFXr48';
export const CART_KEY: string = '__lms-v3_cart';
export const IDENTITY_CODE: string = '12vL0?ZkNxq7mS';
export const UCASE_KEY = '__ocm057cFor065';

/* define menu filter */
export const HIDDEN_MENUS = new Set(['message/notification-details']); // id của menu không muốn hiển thị
export const SELECTED_DONVI_ID = 'd8lPtY#N';

// default avatar image
export const DEFAULT_AVATAR = `/assets/images/client/avatar_default.svg`;
// export const DEFAULT_AVATAR = `/assets/images/course-thumbnail-590x430.jpg`;