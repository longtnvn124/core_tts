import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {DmLoaiVanBan, DmLoaivanbanService} from '@service/thuctapsinh/dm-loaivanban.service';
import {NotificationService} from '@appNotification';
import {PaginatorModule} from 'primeng/paginator';

@Component({
    selector: 'app-loai-hoso',
    standalone: true,
    templateUrl: './loai-hoso.component.html',
    styleUrls: ['./loai-hoso.component.css'],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, RippleModule, PaginatorModule],
})
export class LoaiHosoComponent implements OnInit {
    @ViewChild('formSidebar', {static: true}) formSidebar!: TemplateRef<any>;

    listData: DmLoaiVanBan[] = [];
    textSearch: string = '';
    page: number = 1;
    limit: number = 10;
    totalRecords: number = 0;

    formData!: FormGroup;
    formTitle: string = '';
    currentItem: DmLoaiVanBan | null = null;

    menuName = 'FORM_LOAIHOSO';

    constructor(
        private dmLoaiVanbanService: DmLoaivanbanService,
        private notifi: NotificationService,
        private fb: FormBuilder
    ) {
    }

    ngOnInit(): void {
        this.initForm();
        this.loadInit();
    }

    initForm() {
        this.formData = this.fb.group({
            title: ['', Validators.required],
            des: [''],
        });
    }

    onPageChange(event: any) {
        this.page = event.page + 1;
        this.limit = event.rows;
        this.loadInit();
    }


    loadInit() {
        this.notifi.isProcessing(true);
        this.dmLoaiVanbanService.search(this.page, this.textSearch, this.limit).subscribe({
            next: ({recordsTotal, data}) => {
                this.totalRecords = recordsTotal;
                this.listData = data.map((m, i) => ({...m, _index: i + 1}));
                this.notifi.isProcessing(false);
            },
            error: () => this.notifi.isProcessing(false),
        });
    }

    onSearch() {
        this.page = 1;
        this.loadInit();
    }

    /** Mở sidebar khi thêm mới hoặc chỉnh sửa */
    openForm(title: string, item?: DmLoaiVanBan) {
        this.formTitle = title;
        if (item) {
            this.currentItem = item;
            this.formData.patchValue({
                title: item.title,
                des: item.des,
            });
        } else {
            this.currentItem = null;
            this.formData.reset();
        }

        this.notifi.openSideNavigationMenu({
            name: this.menuName,
            template: this.formSidebar,
            size: 500,
            offsetTop: '0px',
        });
    }

    /** Đóng sidebar */
    closeForm() {
        this.notifi.closeSideNavigationMenu(this.menuName);
        this.formData.reset();
        this.currentItem = null;
    }

    /** Lưu dữ liệu */
    saveForm() {
        if (this.formData.invalid) {
            this.notifi.toastError('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        const data = this.formData.value;

        if (this.currentItem) {
            // Cập nhật
            this.dmLoaiVanbanService.update(this.currentItem.id!, data).subscribe({
                next: () => {
                    this.notifi.toastSuccess('Cập nhật thành công');
                    this.closeForm();
                    this.loadInit();
                },
                error: () => this.notifi.toastError('Cập nhật thất bại'),
            });
        } else {
            // Thêm mới
            this.dmLoaiVanbanService.add(data).subscribe({
                next: () => {
                    this.notifi.toastSuccess('Thêm mới thành công');
                    this.closeForm();
                    this.loadInit();
                },
                error: () => this.notifi.toastError('Thêm mới thất bại'),
            });
        }
    }

    /** Xóa item */
    delete(item: DmLoaiVanBan) {
        this.notifi.confirmDelete().then((confirmed) => {
            if (confirmed) {
                this.dmLoaiVanbanService.delete(item.id!).subscribe({
                    next: () => {
                        this.notifi.toastSuccess('Xóa thành công');
                        this.loadInit();
                    },
                    error: () => this.notifi.toastError('Xóa thất bại'),
                });
            }
        });
    }

    /** Khi nhấn nút Sửa */
    edit(item: DmLoaiVanBan) {
        this.openForm('Cập nhật loại hồ sơ', item);
    }

    /** Khi nhấn nút Thêm */
    addNew() {
        this.openForm('Thêm loại hồ sơ mới');
    }
}
