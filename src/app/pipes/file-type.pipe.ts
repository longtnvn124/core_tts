import { Pipe , PipeTransform } from '@angular/core';
import {FileType} from "@utilities/syscats";
import {OvicDocument, OvicDriveFile, OvicFile, OvicFileStore, OvicFileUpload} from "@model/file";


@Pipe( { name : 'ovicFileType' ,standalone:true} )
export class FileTypePipe implements PipeTransform {

	fileType = FileType;

	transform( file : OvicFile | OvicFileStore | OvicDriveFile | OvicFileUpload | File | OvicDocument ) : string {
		if ( file[ '_ext' ] ) {
			return file[ '_ext' ];
		} else {
			return file[ 'type' ] || file[ 'mimeType' ] && this.fileType.has( file[ 'type' ] || file[ 'mimeType' ] ) ? this.fileType.get( file[ 'type' ] || file[ 'mimeType' ] ) : 'undefined';
		}
	}

}
