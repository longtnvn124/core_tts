import { Component, OnInit, ViewChild, Input, Output, EventEmitter, TemplateRef, ViewContainerRef, OnDestroy, ChangeDetectionStrategy, ViewEncapsulation, SimpleChanges } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { NotificationService } from '@theme/services/notification.service';
import { InsideAction, OvicTableStructure, OvicTableStructureButton } from '@model/ovic-models';
import { ButtonBase } from '@model/button';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { DropdownModule } from 'primeng/dropdown';
import { MatMenuModule } from '@angular/material/menu';
import { TooltipModule } from 'primeng/tooltip';
import { SafeHtmlPipe } from "../../pipes/safe-html.pipe";
import { LoadCourseThumbnailDirective } from 'src/app/directives/load-course-thumbnail.directive';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {InputTextModule} from "primeng/inputtext";

@Component({
	selector: 'ovic-table',
	standalone: true,
	templateUrl: './ovic-table.component.html',
	styleUrls: ['./ovic-table.component.css'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, ButtonModule, RippleModule, TableModule, DropdownModule, MatMenuModule, TooltipModule, SafeHtmlPipe, LoadCourseThumbnailDirective, InputTextModule],
})
export class OvicTableComponent implements OnInit, OnDestroy {

	@Input() min_width: string = '70rem'; // Khởi tạo giá trị của biến min_width

	tableStyles: { [key: string]: string } = {};

	@Input() session = 1; // using to force regenerate view from parent component

	@Input() index = 1;

	@Input() data;

	@Input() tableName: string = null;

	@Input() enableSearch: boolean;

	@Input() enableSearchLocal = true;

	@Input() searchCircle = false;

	@Input() searchDebounceTime = 500; // unit mini seconds

	@Input() searchPlaceholder = 'Tìm kiếm thông tin';

	@Input() loading;

	@Input() dataKey;

	@Input() rowHover;

	@Input() rows: number;

	@Input() page: number = 1;

	@Input() globalFilterFields;

	@Input() styleClass;

	@Input() tblStructure: OvicTableStructure[];

	@Input() ovicFiler;

	@Input() ovicFilterOption;

	@Input() addRow: boolean;

	@Input() headerButtons: ButtonBase[];

	@Input() addRowLabel: string;

	// new lcms

	@Input() options_dropdown: any[];

	@Input() label_dropdown: string = 'label';

	@Input() addDropdown: boolean = false;

	@Input() placeholder_dropdown: string = '--Tất cả--';

	/*For Expantion settings */

	@Input() rowExpanded = false;

	@Input() expandedHeadCssClass: string;

	@Input() expandedHeadInner: string;

	@Input() expandedColumnCssClass: string;

	@Input() expandedDataField: string;

	@Input() expandedTooltip: string;

	@Input() expandedBtnIcons: any; /*[ 'pi pi-chevron-down' , 'pi pi-chevron-right' ]*/

	@Input() expandedBtnInside: InsideAction;

	@Input() menuTemplate: TemplateRef<any>;

	@Input() enablePaginator = false;

	@Input() emptyMessage = 'Không có dữ liệu';

	@Output() onChangeDropdownEvent = new EventEmitter<any>();
	/*------------------------------------------------------------*/

	@Output() expandedInside = new EventEmitter<any>();

	@Output() editData = new EventEmitter<number>();

	@Output() deleteData = new EventEmitter<number>();

	@Output() lockData = new EventEmitter<boolean>();

	@Output() switch = new EventEmitter<boolean>();

	@Output() rowClick = new EventEmitter<boolean>();

	@Output() addNewRow = new EventEmitter<boolean>();

	@Output() onButtonClick = new EventEmitter<ButtonBase>();

	@Output() onSearch = new EventEmitter<string>();

	@ViewChild(Table, { static: true }) table: Table;

	@ViewChild('topSelectorValue') topSelectorValue;

	tblClass = 'ovic-ui-table';

	rowLength = 3;

	activeRow: any;

	private _EVENT_CLICK = new Subject<ButtonBase>();

	private closeObservers$ = new Subject<string>();

	private _SEARCH_DEBOUNCE = new Subject<string>();

	constructor(
		private notificationService: NotificationService,
		private viewContainerRef: ViewContainerRef,
		private sanitizer: DomSanitizer
	) {
		this.notificationService.eventCloseRightContextMenu$.pipe(takeUntil(this.closeObservers$)).subscribe({ next: () => this.activeRow = null });
		this._EVENT_CLICK.asObservable().pipe(takeUntil(this.closeObservers$), debounceTime(300)).subscribe({ next: button => this.onButtonClick.emit(button) });
		this._SEARCH_DEBOUNCE.asObservable().pipe(takeUntil(this.closeObservers$), debounceTime(this.searchDebounceTime), distinctUntilChanged()).subscribe(search => this.onSearch.emit(search));
	}

	ngOnInit(): void {

		if (this.styleClass) {
			this.tblClass = `ovic-ui-table ${this.styleClass}`;
		}
		if (!this.rows) {
			this.rows = 20;
		}
		if (this.tblStructure) {
			this.rowLength = this.tblStructure.length + 1;
			if (this.rowExpanded) {
				this.rowLength = this.tblStructure.length + 2;
			}
		}
		if (!this.addRow) {
			this.addRow = false;
		} else {
			if (!this.addRowLabel) {
				this.addRowLabel = 'Thêm trường mới';
			}
		}

		this.tableStyles = {
			'min-width': this.min_width,
			'width': '100%'
		};
	}

	getSafeHtmlContent(html: string): SafeHtml {
		// console.log(html);

		return this.sanitizer.bypassSecurityTrustHtml(html);
	}

	ngOnDestroy() {
		this.closeObservers$.next('close');
		this.closeObservers$.complete();
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['data']) {
			// console.log('Data changed:', this.data); // Log giá trị mới của data khi thay đổi
		}
	}

	editClick(key: any) {
		this.editData.emit(key);
		this.userClick({
			label: 'Edit button',
			name: 'EDIT',
			data: key,
			icon: '',
			class: ''
		});
	}

	deleteClick(key: any) {
		this.deleteData.emit(key);
		this.userClick({
			label: 'Delete button',
			name: 'DELETE',
			data: key,
			icon: '',
			class: ''
		});
	}

	lockClick(key: any) {
		this.lockData.emit(key);
		this.userClick({
			label: 'Lock button',
			name: 'LOCK',
			data: key,
			icon: '',
			class: ''
		});
	}

	buttonClick(button: OvicTableStructureButton, key: any) {
		this.userClick({
			label: button.label,
			name: button.name,
			data: key,
			icon: '',
			class: ''
		});
	}

	switchClick(key: any) {
		this.switch.emit(key);
		this.userClick({
			label: 'Switch button',
			name: 'SWITCH',
			data: key,
			icon: '',
			class: ''
		});
	}

	rowClickHandle(key: any) {
		this.rowClick.emit(key);
	}

	addNewRowClick(key: any) {
		this.addNewRow.emit(true);
		this.userClick({
			label: 'Add new row button',
			name: 'ADD_NEW_ROW',
			data: key,
			icon: '',
			class: ''
		});
	}

	expandedBtnInsideHandle(key: any) {
		this.expandedInside.emit(key);
		this.userClick({
			label: 'Expanded inside button',
			name: 'EXPANDED_INSIDE',
			data: key,
			icon: '',
			class: ''
		});
	}

	/********************************************************
	 * Disable context menu
	 * ******************************************************/
	disableContextMenu(event: Event) {
		if (this.menuTemplate) {
			event.preventDefault();
			event.stopPropagation();
			return;
		}
	}

	/**********************************************
	 * open context menu
	 * *******************************************/
	// openContextMenu(event: MouseEvent, data) {
	// 	this.notificationService.closeContextMenu();
	// 	if (this.menuTemplate) {
	// 		this.notificationService.openContextMenu(event, this.menuTemplate, this.viewContainerRef, data, true);
	// 		this.activeRow = data[this.dataKey];
	// 	}
	// }

	userClick(button: ButtonBase) {
		this._EVENT_CLICK.next(button);
	}

	inputSearch(text: string) {
		if (this.enableSearchLocal) {
			this.table.filterGlobal(text, 'contains');
		} else {
			this._SEARCH_DEBOUNCE.next(text);
		}
	}

	onChangeDropdown(event) {
		this.onChangeDropdownEvent.emit(event.value);
	}

}
