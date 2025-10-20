import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {DmLoaiVanBan, DmLoaivanbanService} from '@service/thuctapsinh/dm-loaivanban.service';
import {NotificationService} from '@appNotification';
import {PaginatorModule} from 'primeng/paginator';
import {FileListLocalComponent} from "../../../../templates/file-list-local/file-list-local.component";
import {getLinkDownload} from "@env";

@Component({
    selector: 'app-loai-hoso',
    standalone: true,
    templateUrl: './loai-hoso.component.html',
    styleUrls: ['./loai-hoso.component.css'],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, RippleModule, PaginatorModule, FileListLocalComponent],
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

    filePermission = {
        canDelete: true,
        canDownload: true,
        canUpload: true
    };
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
            files: [''],
        });
    }


    get f(): { [key: string]: AbstractControl<any> } {
        return this.formData.controls;
    }
    // Phân trang
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
                this.listData = data.map((m, i) => {
                    m['_index'] = i + 1;
                    m['_file']= m.files && m.files['0'] ?  getLinkDownload(m.files[0].id.toString()) : '//assets/images/authentication/video-thumb.png';
                    return m;
                });
                this.notifi.isProcessing(false);
                console.log(this.listData);
            },
            error: () => this.notifi.isProcessing(false),
        });
    }

    onSearch() {
        this.page = 1;
        this.loadInit();
    }

    // Mở sidebar
    openForm(title: string, item?: DmLoaiVanBan) {
        this.formTitle = title;
        if (item) {
            this.currentItem = item;
            this.formData.patchValue({
                title: item.title,
                des: item.des,
                files: item.files,
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

    //Đóng sidebar
    closeForm() {
        this.notifi.closeSideNavigationMenu(this.menuName);
        this.formData.reset();
        this.currentItem = null;
    }

    //Lưu
    saveForm() {
        console.log(this.formData.value)
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

    // Xóa item
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

    //Sửa
    edit(item: DmLoaiVanBan) {
        this.openForm('Cập nhật loại hồ sơ', item);
    }

    //Thêm
    addNew() {
        this.openForm('Thêm loại hồ sơ mới');
    }
}
