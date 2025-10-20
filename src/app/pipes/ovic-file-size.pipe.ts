import { Pipe , PipeTransform } from '@angular/core';
import {FileService} from "@service/core/file.service";
import {OvicDriveFile, OvicFile, OvicFileStore} from "@model/file";


@Pipe( {
	name : 'ovicFileSize',
	standalone:true
} )
export class OvicFileSizePipe implements PipeTransform {

	constructor( private fileService : FileService ) {}

	transform( file : OvicFile | OvicFileStore | OvicDriveFile | File | any ) : string {
		return this.fileService.getFileSize( file );
	}

}
