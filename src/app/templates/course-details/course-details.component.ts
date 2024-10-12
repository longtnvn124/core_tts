import { Component , EventEmitter , Input , OnDestroy , OnInit , Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@service/auth.service';
import { CoursesService } from '@service/courses.service';
import { Course , CourseCertificationRecord , CourseCertificationType , CourseExtend , CourseInstructor , CoursePrice } from '@model/course';
import { of , Subject , switchMap , takeUntil } from 'rxjs';
import { LoadingProgressBarComponent } from '../loading-progress-bar/loading-progress-bar.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CourseCurriculumComponent } from '../course-curriculum/course-curriculum.component';
import { CourseInstructorComponent } from '../course-instructor/course-instructor.component';
import { CourseReviewComponent } from '../course-review/course-review.component';
import { Curriculum } from '@model/lesson';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';
import { LoadCourseThumbnailDirective } from '../../directives/load-course-thumbnail.directive';
import { LoadMediaOnTextDirective } from '../../directives/load-media-on-text.directive';
import { Button } from '@model/button';
import { CourseVideoIntroComponent } from '../course-video-intro/course-video-intro.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CourseInfoEvent } from '../course-info/course-info.component';
import { CartService } from '@service/cart.service';
import { CartActionEvent } from '@model/cart';
import { NotificationService } from '@appNotification';

type CourseDetailTab = 'description' | 'curriculum' | 'instructor' | 'review';
type CourseDetailNavigate = 'PREVIOUS'


type CourseDetailBuyButtonName = 'buy' | 'study';

interface CourseDetailBuyButton extends Button {
	name : CourseDetailBuyButtonName;
	disable : boolean;
}

@Component( {
	selector    : 'app-course-details' ,
	standalone  : true ,
	imports     : [ CommonModule , LoadingProgressBarComponent , MatTabsModule , MatTooltipModule , ButtonModule , RippleModule , CourseCurriculumComponent , CourseInstructorComponent , CourseReviewComponent , SafeHtmlPipe , LoadCourseThumbnailDirective , LoadMediaOnTextDirective ] ,
	templateUrl : './course-details.component.html' ,
	styleUrls   : [ './course-details.component.css' ]
} )
export class CourseDetailsComponent implements OnInit , OnDestroy {

	@Input() set courseId( _courseId : number ) {
		this._courseId = _courseId;
		this.loadData();
	}

	private _courseId : number;

	get courseId() : number {
		return this._courseId;
	}

	@Input() showPreviousNav : boolean = false;

	@Output() navigate : EventEmitter<CourseDetailNavigate> = new EventEmitter<CourseDetailNavigate>();

	@Output() onEvent : EventEmitter<CourseInfoEvent> = new EventEmitter<CourseInfoEvent>();

	course : Course;

	loading : boolean = true;

	error : boolean = false;

	private onDestroy : Subject<string> = new Subject<string>();

	lessons : Curriculum[];

	tabActive : CourseDetailTab = 'description';

	isOwner : boolean = false;

	button : CourseDetailBuyButton;

	certification : Record<CourseCertificationType , string> = CourseCertificationRecord;

	price : string = '';

	instructor : CourseInstructor[];

	mainInstructorName : string = '';

	protected cost : CoursePrice = { price : '0' , sale : '' , free : false };

	private buttonRedirection : Record<CourseDetailBuyButtonName , () => any> = {
		buy   : () => {
			// this.onEvent.emit( {
			// 	name     : 'BUY_COURSE' ,
			// 	course   : this.course as CourseExtend ,
			// 	category : 0
			// } )
			const status : CartActionEvent = this.cartService.addToCart( this.course );
			if ( status.success ) {
				this.notification.toastSuccess( 'Đã thêm sản phẩm vào giở hàng' );
				setTimeout( () => this.cartService.openMiniCart( 'course-detail' ) , 500 );
			} else {
				this.notification.toastError( status.message );
			}
		} ,
		study : () => {
			this.onEvent.emit( {
				name     : 'GET_TO_LEARNING_PANEL' ,
				course   : this.course as CourseExtend ,
				category : 0
			} );
		}
	};

	addedToCart : boolean = false;

	constructor(
		private router : Router ,
		private auth : AuthService ,
		private coursesService : CoursesService ,
		private cartService : CartService ,
		private notification : NotificationService ,
		public dialog : MatDialog
	) {}


	ngOnInit() : void {
		this.cartService.onCartChanges.pipe( takeUntil( this.onDestroy ) ).subscribe( ( { items } ) => {
			if ( this.course ) {
				this.addedToCart = items.reduce( ( find , i ) => find || i.course.id === this.course.id , false );
				this.button      = this.getPrimaryButton();
			}
		} );
	}

	loadData() {
		this.isOwner = this.auth.isAuthenticated && this.auth.courseIdSet.size && this.auth.courseIdSet.has( this.courseId );
		this.loading = true;
		this.cartService.buildCart.pipe( takeUntil( this.onDestroy ) , switchMap( cart => cart ? this.coursesService.getCourseByCourseId( this.courseId , '' , true ) : of( null ) ) ).subscribe( {
			next  : ( course : Course ) => {
				if ( course ) {
					this.addedToCart        = this.cartService.isAddedToCart( course.id );
					this.button             = this.getPrimaryButton();
					this.loading            = false;
					this.error              = false;
					this.course             = course;
					this.cost.price         = course.price.toLocaleString( 'vi-VN' , { style : 'currency' , currency : 'VND' } );
					this.cost.sale          = course.price && course.price !== course.sale_price ? course.sale_price.toLocaleString( 'vi-VN' , { style : 'currency' , currency : 'VND' } ) : '';
					this.cost.free          = course.sale_price === 0;
					this.instructor         = course[ 'teacher' ];
					this.mainInstructorName = course[ 'teacher' ] && course[ 'teacher' ][ 0 ] && course[ 'teacher' ][ 0 ].full_name ? course[ 'teacher' ][ 0 ].full_name : '';
				} else {
					this.loading = false;
					this.error   = true;
				}
			} ,
			error : () => {
				this.loading = false;
				this.error   = true;
			}
		} );
	}

	private getPrimaryButton() : CourseDetailBuyButton {
		return !this.isOwner ? {
			name    : 'buy' ,
			label   : !this.addedToCart ? 'Thêm khóa học vào giỏ hàng' : 'Đã thêm khóa học vào giỏ hàng' ,
			icon    : 'pi pi-shopping-cart' ,
			class   : this.addedToCart ? '--course-added-to-cart' : '' ,
			disable : this.addedToCart
		} : {
			name    : 'study' ,
			label   : 'Vào học' ,
			icon    : 'pi pi-video' ,
			class   : 'p-button-success' ,
			disable : false
		};
	}

	changesTab( tabName : CourseDetailTab ) {
		this.tabActive = tabName;
	}

	setLessonData( lessons : Curriculum[] ) {
		this.lessons = lessons;
	}

	onNavigate( name : CourseDetailNavigate ) {
		this.navigate.emit( name );
	}

	onButtonClick( btn : CourseDetailBuyButton ) {
		this.buttonRedirection[ btn.name ]();
	}

	playVideoIntro( src : string ) {
		this.dialog.open( CourseVideoIntroComponent , {
			data       : { sources : [ { src , provider : 'youtube' } ] } ,
			panelClass : [ 'theme-mat-dialog-circle' , 'cdk-overlay-pane--max-100vw' ]
		} );
	}

	ngOnDestroy() : void {
		this.onDestroy.next( '' );
		this.onDestroy.complete();
	}
}
