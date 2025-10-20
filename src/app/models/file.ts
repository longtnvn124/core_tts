

export interface File {
}

export type IctuMediaSourceType = 'googleDrive' | 'serverFile' | 'local' | 'vimeo' | 'youtube' | 'encrypted' | 'serverAws';

export type IctuDocumentType = 'docx' | 'pptx' | 'pdf' | 'xlsx' | 'audio' | 'video' | 'image' | 'text' | 'zip';

export interface IctuDocument {
	type : IctuDocumentType; // image
	source : IctuMediaSourceType; // serverFile
	path : number | string ; // id
	size? : number;
	fileName? : string;
	preview? : boolean;
	_ext? : IctuDocumentType;
	download? : boolean;
}

export interface Upload {
    progress: number;
    state: 'PENDING' | 'IN_PROGRESS' | 'DONE';
    content?: any;
}

type DownloadStateType = 'PENDING' | 'IN_PROGRESS' | 'DONE';

export interface Download {
	content : Blob | null;
	progress : number;
	state : DownloadStateType;
}

export interface EncryptedFormats {
	itag : number;
	url : string;
	mimeType : string;
	bitrate : number;
	width : number;
	height : number;
	lastModified : string;
	fps : number;
	quality : string;
	qualityLabel : string;
	initRange? : {
		start : string;
		end : string;
	};
	indexRange? : {
		start : string;
		end : string;
	};
	projectionType? : string;
	audioQuality? : string;
	approxDurationMs? : string;
	audioSampleRate? : string;
	audioChannels? : 2;
	type? : string;
	averageBitrate? : string;
	highReplication? : boolean;
	loudnessDb? : number;
}

export interface EncryptedSource extends Source {
	src : string;
	approxDurationMs? : string;
}

export interface IctuMedia {
	type : string; // only 'audio' and 'video' is accepted
	source : IctuMediaSourceType;
	path : string | number;
	replay? : number;
	encryptedSource? : EncryptedSource[]; // Trường hợp source === encrypted thì trường này chứa link video
}

export interface AwsResponseInfo {
	code : string,
	data : string,
	message : string
}

export type IctuMediaHandlerFullType = { [T in IctuMediaSourceType] : ( file : IctuMedia ) => void };

export interface EncryptedVideo {
	code : string,
	message : string,
	videoDetails : EncryptedVideoDetails;
	video? : EncryptedVideoDetails;
	formats? : EncryptedFormats[];
	format? : EncryptedFormats;
}

export interface EncryptedVideoDetails {
	title : string;
	lengthSeconds : string;
	keywords : string[];
	channelId : string;
	isOwnerViewing : boolean;
	shortDescription : string;
	isCrawlable : boolean;
	allowRatings : boolean;
	viewCount : string;
	author : string;
	isPrivate : boolean;
	isUnpluggedCorpus : boolean;
	isLiveContent : boolean;
}

export interface IctuFileInfo {
	id? : number;
	name : string;
	size : number;
	type : string;
	donvi_id? : number;
	ext? : string;
	realm? : string;
	title? : string;
	url? : string;
	user_id? : number;
	updated_at? : string;
	created_at? : string;
}

export interface IctuDocumentDownloadResult {
	state : 'REJECTED' | 'ERROR' | 'INVALIDATE' | 'COMPLETED' | 'CANCEL';
	download : Download;
}

export interface IctuDriveFile extends IctuTinyDriveFile {
	parents : string[];
	spaces : string[];
	webContentLink? : string;
	webViewLink? : string;
	thumbnailLink? : string;
	createdTime : string;
	modifiedTime : string;
	originalFilename : string;
	fullFileExtension : string;
}

export interface IctuFileStore {
	id : number;
	name : string;
	title : string;
	size : number;
	type : string;
	ext : string;
	progress? : number;
}

export interface IctuTinyDriveFile {
	id : string;
	mimeType : string;
	name : string;
	fileExtension : string;
	shared : boolean;
	size : string;
}

export interface IctuFile {
	id : number;
	name : string;
	title : string;
	url : string;
	ext : string;
	type : string;
	size : number;
	user_id : number;
	public? : number; // '-1' => public | '0' => private | '|12|24|25|' => share group
	created_at? : string; // mySql DATETIME format: YYYY-MM-DD HH:MI:SS
	updated_at? : string; // mySql DATETIME format: YYYY-MM-DD HH:MI:SS
}

export interface IctuPreviewFileContent {
	id : string | number;
	file? : IctuFile | IctuDriveFile | IctuTinyDriveFile | SimpleFileLocal;
}

export interface SimpleFileLocal {
	id : number,
	name : string,
	title : string,
	ext : string,
	type : string,
	size : number
}

export interface AwsFileInfo {
	id : number,
	name : string,
	title : string,
	tag : string,
	url : string,
	ext : string,
	type : string,
	size : number,
	user_id : number,
	public : number,
	status : number,
	is_deleted : number,
	deleted_by : number,
	created_by : number,
	updated_by : number,
	created_at : string,
	updated_at : string,
}

export interface OvicFile {
    id: number;
    name: string;
    title: string;
    url: string;
    ext: string;
    type?: string;
    size: number;
    user_id?: number;
    public?: number; // '-1' => public | '0' => private | '|12|24|25|' => share group
    created_at?: string; // mySql DATETIME format: YYYY-MM-DD HH:MI:SS
    updated_at?: string; // mySql DATETIME format: YYYY-MM-DD HH:MI:SS
    source?: string;
    path?: string | number;
}

import { Source } from 'plyr';

export interface OvicTree {
	slug : string;
	label : string;
	isOpen : boolean;
	children? : OvicTree[];
}

export interface FileDto {
	draw : number;
	recordsTotal : number;
	recordsFiltered : number;
	data : OvicFile[];
}

export interface OvicFileStore {
	id : number;
	name : string;
	title : string;
	size : number;
	type : string;
	ext : string;
	progress? : number;
}

// export interface OvicFileServer {
// 	id : number;
// 	name : string;
// 	title : string;
// 	size : number;
// 	type : string;
// 	ext : string;
// 	content? : Blob | null; // base 64 file
// 	donvi_id : number;
// 	realm : string;
// 	url : string;
// 	shared? : string; // '-1' => public | '0' => private | '|12|24|25|' => share group
// 	user_id : number;
// 	updated_at : string;
// 	created_at : string;
// }

export interface OvicFileUpload {
	id? : number;
	name : string;
	title? : string;
	type? : string;
	size : number;
	validate? : boolean;
	uploaded? : boolean;
	message? : string;
	file? : File;
}

export interface OvicDriveFolder {
	id : string;
	name : string;
	mimeType : string;
	parents : string[];
	spaces : string[];
	webViewLink? : string;
	createdTime : string;
	modifiedTime : string;
	shared : boolean;
}

export interface OvicDriveFile extends OvicTinyDriveFile {
	parents : string[];
	spaces : string[];
	webContentLink? : string;
	webViewLink? : string;
	thumbnailLink? : string;
	createdTime : string;
	modifiedTime : string;
	originalFilename : string;
	fullFileExtension : string;
}

export class OvicDriveFileObject {
	_file : OvicDriveFile;

	constructor( file : OvicDriveFile ) {
		this._file = file;
	}

	toOvicTinyDriveFile() : OvicTinyDriveFile {
		return {
			id            : this._file.id ,
			name          : this._file.name ,
			fileExtension : this._file.fileExtension ,
			shared        : this._file.shared ,
			size          : this._file.size ,
			mimeType      : this._file.mimeType
		};
	}
}


export const toOvicTinyDriveFile = ( { id , name , fileExtension , shared , size , mimeType } : { id : string; name : string; fileExtension : string; shared : boolean; size : number; mimeType : string } ) : OvicTinyDriveFile => ( { id , name , fileExtension , shared , size : size.toString() , mimeType } );

export interface OvicTinyDriveFile {
	id : string;
	mimeType : string;
	name : string;
	fileExtension : string;
	shared : boolean;
	size : string;
}

export interface OvicUploadFiles {
	files : OvicFileUpload[];
	delete : OvicFileUpload[]; // Files to delete ( these files have been uploaded and are no longer in use )
	upload : File[]; // Files required upload before it can be saved
}

export enum OvicMediaSourceTypes {
	local       = 'local' ,
	serverFile  = 'serverFile' ,
	vimeo       = 'vimeo' ,
	youtube     = 'youtube' ,
	googleDrive = 'googleDrive' ,
	encrypted   = 'encrypted'
}

export const OVIC_MEDIA_SOURCE = {
	local       : 'local' ,
	serverFile  : 'serverFile' ,
	vimeo       : 'vimeo' ,
	youtube     : 'youtube' ,
	googleDrive : 'googleDrive' ,
	encrypted   : 'encrypted'
};

export interface OvicMedia {
	type : string; // only 'audio' and 'video' is accepted
	source : OvicMediaSourceTypes;
	path : string | number;
	replay? : number;
	encryptedSource? : EncryptedSource[]; // Trường hợp source === encrypted thì trường này chứa link video
}

export const OvicMediaSources = {
	local       : 'local' ,
	serverFile  : 'serverFile' ,
	vimeo       : 'vimeo' ,
	youtube     : 'youtube' ,
	googleDrive : 'googleDrive' ,
	encrypted   : 'encrypted'
};

export interface EncryptedSource extends Source {
	src : string;
	approxDurationMs? : string;
}

export interface OvicDocument {
	type : OvicDocumentTypes;
	source : OvicMediaSourceTypes;
	path : string | number;
	fileName? : string;
	preview? : boolean;
	_ext? : string | OvicDocumentTypes;
	download? : boolean;
}

export enum OvicDocumentTypes {
	docx  = 'docx' ,
	pptx  = 'pptx' ,
	ppt   = 'ppt' ,
	pdf   = 'pdf' ,
	xlsx  = 'xlsx' ,
	audio = 'audio' ,
	video = 'video' ,
	image = 'image' ,
	text  = 'text' ,
	zip   = 'zip' ,
}

export interface OvicFileInfoOld {
	id? : number;
	name : string;
	size : number;
	type : string;
	donvi_id? : number;
	ext? : string;
	realm? : string;
	title? : string;
	url? : string;
	user_id? : number;
	updated_at? : string;
	created_at? : string;
}

export interface Download {
	content : Blob | null;
	progress : number;
	state : 'PENDING' | 'IN_PROGRESS' | 'DONE';
}

export interface OvicPreviewFileContent {
	id : string | number;
	file? : OvicFile | OvicDriveFile | OvicTinyDriveFile | SimpleFileLocal;
}

export interface OvicDocumentDownloadResult {
	state : 'REJECTED' | 'ERROR' | 'INVALIDATE' | 'COMPLETED' | 'CANCEL';
	download : Download;
}

export interface SimpleFileLocal {
	id : number,
	name : string,
	title : string,
	ext : string,
	type : string,
	size : number
}

export interface FileLocalPermission {
	canDownload? : boolean,
	canUpload? : boolean,
	canDelete? : boolean
}
