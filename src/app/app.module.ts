import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from '@sharedModule';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ACCESS_TOKEN_KEY , REFRESH_TOKEN_KEY } from '@env';
import { HTTP_INTERCEPTORS , provideHttpClient , withInterceptors } from '@angular/common/http';
import { httpInterceptor } from './interceptor/interceptor';
import { MatDialog , MatDialogModule } from '@angular/material/dialog';
import { getSaver , SAVER } from './providers/saver.provider';
import { ReactiveFormsModule } from '@angular/forms';
import { TableLoaderComponent } from './templates/table-loader/table-loader.component';
import { TableModule } from 'primeng/table';
// import { QlCaThiComponent } from './pages/admin/ql-ca-thi/ql-ca-thi.component';

// import { OvicEditorComponent } from './templates/ovic-editor/ovic-editor.component';
export function tokenGetter() : string | null {
	return localStorage.getItem( ACCESS_TOKEN_KEY );
}

export function tokenSetter( access_token : string ) : string {
	localStorage.setItem( ACCESS_TOKEN_KEY , access_token );
	return access_token;
}

export function deleteToken() : void {
	if ( localStorage.getItem( ACCESS_TOKEN_KEY ) ) {
		localStorage.removeItem( ACCESS_TOKEN_KEY );
	}
}

export function refreshTokenGetter() : string | null {
	return localStorage.getItem( REFRESH_TOKEN_KEY );
}

export function refreshTokenSetter( refresh_token : string ) {
	return localStorage.setItem( REFRESH_TOKEN_KEY , refresh_token );
}

@NgModule( {
	declarations : [
		AppComponent,
		// OvicEditorComponent
	] ,
	imports      : [
		BrowserModule ,
		AppRoutingModule ,
		BrowserAnimationsModule ,
		SharedModule ,
		MatDialogModule ,
		ToastModule,
		ReactiveFormsModule,
		TableModule
		
	] ,
	providers    : [
		MatDialog ,
		MessageService ,
		provideHttpClient( withInterceptors( [ httpInterceptor ] ) ) ,
		{ provide : SAVER , useFactory : getSaver }
	] ,
	bootstrap    : [ AppComponent ]
} )
export class AppModule {}
