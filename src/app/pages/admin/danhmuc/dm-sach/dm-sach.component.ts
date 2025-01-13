import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {NgIf} from "@angular/common";
import {OvicTableComponent} from "../../../../templates/ovic-table/ovic-table.component";
import {Paginator, PaginatorModule, PaginatorState} from "primeng/paginator";
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {RippleModule} from "primeng/ripple";
import {FormType, OvicForm, OvicTableStructure} from "@model/ovic-models";
import {debounceTime, Subject, Subscription} from "rxjs";
import {AuthService} from "@service/core/auth.service";
import {ThemeSettingsService} from "@service/core/theme-settings.service";
import {NotificationService} from "@appNotification";
import {ButtonBase} from "@model/button";
import {DmSach, DmSachService} from "@service/thuctapsinh/dm-sach.service";

interface FormDmSach extends OvicForm {
  object: DmSach;
}
@Component({
  selector: 'app-dm-sach',
  templateUrl: './dm-sach.component.html',
  styleUrls: ['./dm-sach.component.css'],
  standalone: true,
  imports: [
    ButtonModule,
    DropdownModule,
    NgIf,
    OvicTableComponent,
    PaginatorModule,
    ReactiveFormsModule,
    RippleModule
  ]
})
export class DmSachComponent implements OnInit{

  @ViewChild("fromUpdate", { static: true }) template: TemplateRef<any>;
  @ViewChild(Paginator) paginator: Paginator;

  listData: DmSach[];
  formData: FormGroup;
  formTitle: string = "Thêm môn học mới";
  search: string = "";
  page: number = 1;
  recordsTotal: number = 0;
  menuName: string = "MENU";
  index: number = -1;

  isLoading: boolean = false;
  loadInitFail: boolean = false;

  rows: number = this.themeSettingsService.settings.rows;

  listForm = {
    [FormType.ADDITION]: {
      type: FormType.ADDITION,
      title: "Thêm mới",
      object: null,
      data: null,
    },
    [FormType.UPDATE]: {
      type: FormType.UPDATE,
      title: "Cập nhật",
      object: null,
      data: null,
    },
  };

  tblCols: OvicTableStructure[] = [
    {
      fieldType: "normal",
      field: ["__title_covented"],
      rowClass: "",
      header: "Tên loại sách",
      sortable: false,
      headClass: "ovic-w-25",
      innerData: true,
    },
    {
      fieldType: "normal",
      field: ["__status_converted"],
      rowClass: "",
      header: "Trạng thái",
      sortable: false,
      headClass: "ovic-w-25",
      innerData: true,
    },

    {
      tooltip: "",
      fieldType: "buttons",
      field: [],
      rowClass: "ost-w-150px text-center",
      checker: "fieldName",
      header: "Thao tác",
      sortable: false,
      headClass: "ost-w-200px text-center",
      buttons: [
        {
          tooltip: "Cập nhật",
          label: "",
          icon: "pi pi-file-edit",
          name: "EDIT_DECISION",
          cssClass: "btn-primary rounded",
        },
        {
          tooltip: "Xoá",
          label: "",
          icon: "pi pi-trash",
          name: "DELETE_DECISION",
          cssClass: "btn-danger rounded",
        },
      ],
    },
  ];

  headButtons = [
    {
      label: "Thêm mới",
      name: "BUTTON_ADD_NEW",
      icon: "pi-plus pi",
      class: "p-button-success ml-3 mr-2",
    },
  ];

  statusList = [
    { label: "Hoạt động", value: 1 },
    { label: "Dừng hoạt động", value: 0 },
  ];

  formActive: FormDmSach;
  subscription: Subscription = new Subscription();
  private OBSERVE_PROCESS_FORM_DATA = new Subject<FormDmSach>();

  constructor(
    private dmSachService: DmSachService,
    public formBuilder: FormBuilder,
    private auth: AuthService,
    private themeSettingsService: ThemeSettingsService,
    private notificationService: NotificationService
  ) {
    this.formData = this.formBuilder.group({
      title: ["", Validators.required],
      status: [1, Validators.required],
    });

    const observeProcessFormData = this.OBSERVE_PROCESS_FORM_DATA.asObservable()
      .pipe(debounceTime(500))
      .subscribe((form) => this.__processFrom(form));
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
    this.dmSachService.search(this.page, this.search).subscribe({
      next: (res) => {
        console.log(res.data);
        this.listData =
          res.data.length > 0
            ? res.data.map((m) => {
              // m['__title_covented']= `<strong>${m.title}</strong>` + (m.desc ? `<br> ${m.desc}` : '' ) ;
              m["__title_covented"] = `<span class="status-active"><strong>${m["title"]}</strong></span>` ;
              m["__status_converted"] =
                m.status == 1
                  ? `<span class="status-active">Hoạt động</span>`
                  : `<span class="status-inactive">Không hoạt động</span>`;
              return m;
            })
            : [];
        this.recordsTotal = res.recordsTotal;

        this.notificationService.isProcessing(false);
      },
      error: () => {
        this.notificationService.isProcessing(false);
        this.notificationService.toastError("Load dữ liệu không thành công ");
      },
    });
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
      offsetTop: "0px",
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
    const decision =
      button.data && this.listData
        ? this.listData.find((u) => u.id === button.data)
        : null;
    switch (button.name) {
      case "BUTTON_ADD_NEW":
        // this.isUpdated = false;

        console.log("button add new");
        this.formActive = this.listForm[FormType.ADDITION];
        this.preSetupForm(this.menuName);
        break;
      case "EDIT_DECISION":
        const object1 = this.listData.find((u) => u.id === decision.id);
        if (!object1) break;
        // this.setUpCheckBox(object1);

        this.formData.reset({
          title: object1.title,
          status: object1.status,
        });
        this.formActive = this.listForm[FormType.UPDATE];
        this.formActive.object = object1;
        this.preSetupForm(this.menuName);
        break;

      case "DELETE_DECISION":
        const confirm = await this.notificationService.confirmDelete();
        console.log(confirm);
        if (confirm) {
          this.dmSachService.delete(decision.id).subscribe(
            () => {
              this.notificationService.toastSuccess("Xoá dữ liệu thành công");
              this.loadData();
            },
            () => this.notificationService.toastError("Xóa dữ liệu thất bại")
          );
        }
        break;
    }
  }

  private __processFrom({ data, object, type }: FormDmSach) {
    if (type === FormType.ADDITION) {
      // set truong_id

      this.dmSachService.add(this.formData.value).subscribe({
        next: () => {
          this.notificationService.toastSuccess("Thêm môn học mới thành công");
          this.formData.reset();
          this.loadData();
          this.closeForm();
        },
        error: () =>
          this.notificationService.toastError("Thêm môn học thất bại"),
      });
    } else {
      this.dmSachService
        .update(this.formActive.object.id, this.formData.value)
        .subscribe({
          next: () => {
            this.notificationService.toastSuccess(
              "Sửa thông tin môn học thành công"
            );
            this.loadData();
            this.closeForm();
          },
          error: () =>
            this.notificationService.toastError(
              "Sửa thông tin môn học thất bại"
            ),
        });
    }
  }
  saveForm() {
    if (this.formData.valid) {
      this.formActive.data = this.formData.value;
      this.OBSERVE_PROCESS_FORM_DATA.next(this.formActive);
    } else {
      this.notificationService.toastError("Vui lòng nhập đủ và đúng thông tin");
    }
  }
  paginate({ page }: PaginatorState) {
    this.page = page + 1;
    this.loadData();
  }

}
