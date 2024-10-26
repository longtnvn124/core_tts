import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { OvicTableComponent } from "../../../../templates/ovic-table/ovic-table.component";
import { Paginator, PaginatorModule, PaginatorState } from "primeng/paginator";
import { ButtonModule } from "primeng/button";
import { RippleModule } from "primeng/ripple";
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { FormType, OvicForm, OvicTableStructure } from "@model/ovic-models";
import { DmLoaiVanBan, DmLoaiVanbanService } from "@service/thuctapsinh/dm-loai-vanban.service";
import { debounceTime, Subject, Subscription } from "rxjs";
import { AuthService } from "@service/core/auth.service";
import { ThemeSettingsService } from "@service/core/theme-settings.service";
import { NotificationService } from "@appNotification";
import { ButtonBase } from "@model/button";
import { NgIf } from "@angular/common";


interface FormDmLoaiVanBan extends OvicForm {
  object: DmLoaiVanBan
}

@Component({
  selector: 'app-loai-dichvu',
  templateUrl: './loai-dichvu.component.html',
  styleUrls: ['./loai-dichvu.component.css'],
  standalone: true,
  imports: [
    OvicTableComponent,
    PaginatorModule,
    ButtonModule,
    RippleModule,
    ReactiveFormsModule,
    NgIf
  ]
})
export class LoaiDichvuComponent implements OnInit {
  @ViewChild('fromUpdate', { static: true }) template: TemplateRef<any>;
  @ViewChild(Paginator) paginator: Paginator;

  listData: DmLoaiVanBan[];
  formData: FormGroup;
  formTitle: string = 'Thêm môn học mới';
  search: string = '';
  page: number = 1;
  recordsTotal: number = 0;
  menuName: string = 'MENU';
  index: number = -1;

  isLoading: boolean = false;
  loadInitFail: boolean = false;

  rows: number = this.themeSettingsService.settings.rows;

  listForm =
    {
      [FormType.ADDITION]: { type: FormType.ADDITION, title: 'Thêm mới môn học', object: null, data: null, },
      [FormType.UPDATE]: { type: FormType.UPDATE, title: 'Cập nhật môn học', object: null, data: null, },
    };


  tblCols: OvicTableStructure[] = [
    {
      fieldType: 'normal',
      field: ['__title_covented'],
      rowClass: '',
      header: 'Tên dịch vụ',
      sortable: false,
      headClass: 'ovic-w-25',
      innerData: true,
    },
    {
      fieldType: 'normal',
      field: ['__status_converted'],
      rowClass: '',
      header: 'Trạng thái',
      sortable: false,
      headClass: 'ovic-w-25',
      innerData: true,
    },

    {
      tooltip: '',
      fieldType: 'buttons',
      field: [],
      rowClass: 'ost-w-150px text-center',
      checker: 'fieldName',
      header: 'Thao tác',
      sortable: false,
      headClass: 'ost-w-200px text-center',
      buttons: [
        {
          tooltip: 'Cập nhật',
          label: '',
          icon: 'pi pi-file-edit',
          name: 'EDIT_DECISION',
          cssClass: 'btn-primary rounded'
        },
        {
          tooltip: 'Xoá',
          label: '',
          icon: 'pi pi-trash',
          name: 'DELETE_DECISION',
          cssClass: 'btn-danger rounded'
        }
      ]
    }
  ];

  headButtons = [
    {
      label: 'Thêm môn học mới',
      name: 'BUTTON_ADD_NEW',
      icon: 'pi-plus pi',
      class: 'p-button-success ml-3 mr-2',
    },
  ];

  statusList = [
    { label: 'Hoạt động', value: 1 },
    { label: 'Dừng hoạt động', value: 0 },
  ]

  formActive: FormDmLoaiVanBan;
  subscription: Subscription = new Subscription();
  private OBSERVE_PROCESS_FORM_DATA = new Subject<FormDmLoaiVanBan>();

  constructor(
    private dmLoaiVanbanService: DmLoaiVanbanService,
    public formBuilder: FormBuilder,
    private auth: AuthService,
    private themeSettingsService: ThemeSettingsService,
    private notificationService: NotificationService
  ) {
    this.formData = this.formBuilder.group(
      {
        ten_dm: ['', Validators.required],
        status: [0, Validators.required],

      }
    );

    const observeProcessFormData = this.OBSERVE_PROCESS_FORM_DATA.asObservable().pipe(debounceTime(500)).subscribe((form) => this.__processFrom(form));
    this.subscription.add(observeProcessFormData);
  }

  get f(): { [key: string]: AbstractControl<any> } {
    return this.formData.controls;
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    const limit = this.themeSettingsService.settings.rows;
    this.index = this.page * limit - limit + 1;

    // this.isLoading = true;
    this.notificationService.isProcessing(true);
    this.dmLoaiVanbanService.search(this.page, this.search).subscribe({
      next: (res) => {
        console.log(res.data);
        this.listData = res.data.length > 0 ? res.data.map(m => {
          // m['__title_covented']= `<strong>${m.title}</strong>` + (m.desc ? `<br> ${m.desc}` : '' ) ;
          m['__title_covented'] = m['ten_dm'];
          m['__status_converted'] = m.status == 1 ? `<span class="status-active">Hoạt động</span>` : `<span class="status-inactive">Không hoạt động</span>`
          return m;
        }) : [];
        this.recordsTotal = res.recordsTotal;

        this.notificationService.isProcessing(false);

      }, error: () => {
        this.notificationService.isProcessing(false);
        this.notificationService.toastError('Load dữ liệu không thành công ');
      }
    })
  }

  onSearch(text: string) {
    this.search = text;
    this.page = 1;
    this.paginator.changePage(1);
    this.loadData();
  }

  private preSetupForm(name: string) {
    // this.notificationService.isProcessing(false);
    this.notificationService.openSideNavigationMenu({
      name,
      template: this.template,
      size: 500,
      offsetTop: '0px',
    });
  }

  closeForm() {
    this.loadData();
    this.formData.reset();
    this.formActive = null;

    this.notificationService.closeSideNavigationMenu(this.menuName);
  }


  async handleClickOnTable(button: ButtonBase) {
    console.log(button);

    if (!button) {
      return;
    }
    const decision = button.data && this.listData ? this.listData.find((u) => u.id === button.data) : null;
    switch (button.name) {
      case 'BUTTON_ADD_NEW':
        // this.isUpdated = false;

        console.log('button add new');
        this.formActive = this.listForm[FormType.ADDITION];
        this.preSetupForm(this.menuName);
        break;
      case 'EDIT_DECISION':

        const object1 = this.listData.find((u) => u.id === decision.id);
        if (!object1) break;
        // this.setUpCheckBox(object1);
        console.log(object1);

        this.formData.reset({
          ten_dm: object1['ten_dm'],
          status: object1.status,

        });
        this.formActive = this.listForm[FormType.UPDATE];
        this.formActive.object = object1;
        this.preSetupForm(this.menuName);
        break;

      case 'DELETE_DECISION':
        const confirm = await this.notificationService.confirmDelete();
        console.log(confirm);
        if (confirm) {
          this.dmLoaiVanbanService.delete(decision.id).subscribe(
            () => {
              this.notificationService.toastSuccess('Xoá dữ liệu thành công');
              this.loadData();
            },
            () => this.notificationService.toastError('Xóa dữ liệu thất bại')
          );
        }
        break;
    }
  }

  private __processFrom({ data, object, type }: FormDmLoaiVanBan) {
    if (type === FormType.ADDITION) {
      // set truong_id

      this.dmLoaiVanbanService.add(this.formData.value).subscribe({
        next: () => {
          this.notificationService.toastSuccess('Thêm môn học mới thành công');
          this.formData.reset();
          this.loadData();
          this.closeForm();
        },
        error: () => this.notificationService.toastError('Thêm môn học thất bại')
      }
      );
    } else {
      this.dmLoaiVanbanService.update(this.formActive.object.id, this.formData.value).subscribe({
        next: () => {
          this.notificationService.toastSuccess('Sửa thông tin môn học thành công');
          this.loadData();
          this.closeForm();
        },
        error: () => this.notificationService.toastError('Sửa thông tin môn học thất bại')
      }
      );
    }
  }
  saveForm() {
    if (this.formData.valid) {
      this.formActive.data = this.formData.value;
      this.OBSERVE_PROCESS_FORM_DATA.next(this.formActive);
    } else {
      this.notificationService.toastError('Vui lòng nhập đủ và đúng thông tin');
    }
  }
  paginate({ page }: PaginatorState) {
    this.page = page + 1;
    this.loadData();
  }


}
