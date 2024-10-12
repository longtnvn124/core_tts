import { Component , OnInit , HostBinding , Input , ElementRef , ViewEncapsulation , Output , EventEmitter , AfterViewInit } from '@angular/core';
import { NgxResizeableWindowRef } from '../window.service';

type DragDirection = 'top' | 'bottom' | 'left' | 'right';

@Component( {
	selector      : 'rsz-layout' ,
	templateUrl   : 'resizable.component.html' ,
	styleUrls     : [ 'resizable.component.scss' ] ,
	providers     : [ { provide : 'Window' , useValue : window } ] ,
	encapsulation : ViewEncapsulation.None
} )
export class ResizableComponent implements OnInit , AfterViewInit {

	@HostBinding( 'class.resizable' ) resizable        = true;
	@HostBinding( 'class.no-transition' ) noTransition = false;
	@HostBinding( 'style.width' ) width;
	@HostBinding( 'style.height' ) height;
	@HostBinding( 'style.flex-basis' ) flexBasis;

	@Input() directions;
	@Input() rFlex : boolean = false;

	@Output() resizeStart : EventEmitter<any> = new EventEmitter();
	@Output() resizing : EventEmitter<any>    = new EventEmitter();
	@Output() resizeEnd : EventEmitter<any>   = new EventEmitter();

	private nativeElement;

	private style;

	private w;
	private h;

	private vx = 1;
	private vy = 1;

	private start;

	private dragDir : DragDirection;

	private axis;

	private info = {};

	constructor( private regionElement : ElementRef , private windowRef : NgxResizeableWindowRef ) {
		this.nativeElement = this.regionElement.nativeElement;
	}

	ngOnInit() {
		if ( !this.rFlex ) { this.resizable = false; } // Added to permit use of component for all cells
		this.flexBasis = 'flexBasis' in this.nativeElement.style ? 'flexBasis' :
						 'webkitFlexBasis' in this.nativeElement.style ? 'webkitFlexBasis' :
						 'msFlexPreferredSize' in this.nativeElement.style ? 'msFlexPreferredSize' : 'flexBasis';
	}

	ngAfterViewInit() {
		this.style = this.windowRef.nativeWindow.getComputedStyle( this.nativeElement );
	}

	private updateInfo( e ) {
		this.info[ 'width' ]  = false;
		this.info[ 'height' ] = false;
		if ( this.axis === 'x' ) {
			this.info[ 'width' ] = parseInt( this.nativeElement.style[ this.rFlex ? this.flexBasis : 'width' ] , 10 );
		} else {
			this.info[ 'height' ] = parseInt( this.nativeElement.style[ this.rFlex ? this.flexBasis : 'height' ] , 10 );
		}
		this.info[ 'id' ]  = this.nativeElement.id;
		this.info[ 'evt' ] = e;
	}

	public dragStart( e , direction : DragDirection ) {
		const mouseEvent = e.originalEvent;
		this.dragDir     = direction;
		this.axis        = ( this.dragDir === 'left' || this.dragDir === 'right' ) ? 'x' : 'y';
		this.start       = ( this.axis === 'x' ? mouseEvent.clientX : mouseEvent.clientY );
		this.w           = parseInt( this.style.getPropertyValue( 'width' ) , 10 );
		this.h           = parseInt( this.style.getPropertyValue( 'height' ) , 10 );

		this.resizeStart.emit( { info : this.info } );

		// prevent transition while dragging
		this.noTransition = true;
	}

	public dragEnd( e ) {
		const mouseEvent = e.originalEvent;
		this.updateInfo( mouseEvent );
		this.resizeEnd.emit( { info : this.info } );
		this.noTransition = false;
	}

	public dragging( e ) {
		const mouseEvent = e.originalEvent;
		const offset     = ( this.axis === 'x' ) ? this.start - mouseEvent.clientX : this.start - mouseEvent.clientY;
		let operand      = 1;

		const draggingHandler : Record<DragDirection , () => any> = {
			bottom : () => {
				const height = ( this.h - offset * this.vy * operand ) + 'px';
				if ( this.rFlex ) {
					this.flexBasis = height;
				} else {
					this.height = height;
				}
			} ,
			left   : () => {
				operand = -1;
				/* falls through */
			} ,
			right  : () => {
				const width = ( this.w - offset * this.vx * operand ) + 'px';
				if ( this.rFlex ) {
					this.flexBasis = width;
				} else {
					this.width = width;
				}
			} ,
			top    : () => {
				operand = -1;
				/* falls through */
			}
		};
		draggingHandler[ this.dragDir ]();
		this.updateInfo( mouseEvent );
		this.resizing.emit( { info : this.info } );
	}
}
