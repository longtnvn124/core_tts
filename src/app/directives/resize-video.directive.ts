import { Directive , ElementRef , HostListener , Input , OnInit } from '@angular/core';
import { Subject } from 'rxjs';

export type ratioName = '16:9' | '4:3';

@Directive( {
	selector   : '[appResizeVideo]' ,
	standalone : true
} )
export class ResizeVideoDirective implements OnInit {

	@Input( { transform : ( value : ratioName ) : ratioName => ( value || '16:9' ) , alias : 'appResizeVideo' } ) ratio : ratioName = '16:9';

	@Input() fullSize : boolean = false;

	@HostListener( 'window:resize' ) onResize() {
		console.log( this.fullSize );
	}

	constructor( private target : ElementRef ) {}

	ngOnInit() : void {
		console.log(this.target.nativeElement);
	}

	private resize() {

	}

}
