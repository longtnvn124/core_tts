import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {OvicForm, OvicTableStructure } from "@model/ovic-models";
// import { TnBank } from "@model/tn-bank";
// import { TnMonHoc } from "@model/tn-mon-hoc";

import { TYPE_BANK } from "@utilities/syscats";
import {Paginator, PaginatorModule} from "primeng/paginator";
import {Subject,Subscription,} from "rxjs";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {OvicTableComponent} from "../../../../templates/ovic-table/ovic-table.component";
import {OvicDropdownComponent} from "../../../../templates/ovic-dropdown/ovic-dropdown.component";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {InputTextModule} from "primeng/inputtext";
import {Helper} from "@utilities/helper";

// interface FormBank extends OvicForm {
//   // object: TnBank;
// }

@Component({
  selector: "app-danh-sach-bank",
  templateUrl: "./danh-sach-bank.component.html",
  styleUrls: ["./danh-sach-bank.component.css"],
  standalone: true,
  imports: [
    PaginatorModule,
    ButtonModule,
    RippleModule,
    ReactiveFormsModule,
    OvicTableComponent,
    OvicDropdownComponent,
    NgClass,
    InputTextModule,
    NgIf,
    NgForOf
  ]
})
export class DanhSachBankComponent implements OnInit {
  handleChangeDonviSubscription: Subscription;
  @ViewChild("formBank") formBank: ElementRef;
  @ViewChild("templateChildrenBank") templateChildrenBank: TemplateRef<any>;
  @ViewChild(Paginator) paginator: Paginator;
  @ViewChild("fromUpdate", { static: true }) template: TemplateRef<any>;
  @ViewChild("fromAddChild", { static: true }) templateChild: TemplateRef<any>;


  searchBank        : string;
  formData          : FormGroup;
  slugIsValid       :boolean= true;

  typeTest          : { type: "THI"; title: "Thi" }[] = [{ type: "THI", title: "Thi" }];
  typeBank          :{label:string,value:string}[]   = TYPE_BANK;
  isAdmin           :boolean = false;
  isUpdated         :boolean = false;
  // canAdded = false;
  // showParent = false;
  // titleIsValid = true;
  tblCols: OvicTableStructure[] = [
    {
      fieldType: "normal",
      field: ["name_converted"],
      rowClass: "",
      header: "Tên ngân hàng",
      sortable: false,
      headClass: "ovic-w-25",
      innerData: true,
    },
    {
      fieldType: "normal",
      field: ["name_subject"],
      rowClass: "",
      header: "Tên môn học",
      sortable: false,
      headClass: "ovic-w-25",
    },
    {
      fieldType: "normal",
      field: ["type_name"],
      rowClass: "",
      header: "Kiểu ngân hàng",
      sortable: false,
      headClass: "ovic-w-150px",
    },
    {
      fieldType: "normal",
      field: ["desc"],
      rowClass: "",
      header: "Mô tả",
      sortable: false,
      innerData: true,
      headClass: "",
    },
    {
      tooltip: "",
      fieldType: "buttons",
      field: [],
      rowClass: "ost-w-150px text-center",
      checker: "fieldName",
      header: "Thao tác",
      sortable: false,
      headClass: "ost-w-200px text-center ",
      buttons: [
        {
          tooltip: 'Thêm chương',
          label: "",
          icon: "pi pi-plus",
          name: "ADD_CHILD_DECISION",
          cssClass: "btn-success rounded text-sm p-2 ml-2 icon-no-ml w-36 h-36",
        },
        {
          tooltip: "Cập nhật",
          label: "",
          icon: "pi pi-file-edit",
          name: "EDIT_DECISION",
          cssClass: "btn-primary rounded text-sm p-2 ml-2 icon-no-ml w-36 h-36",
        },

        {
          tooltip: 'Xoá',
          label: "",
          icon: "pi pi-trash",
          name: "DELETE_DECISION",
          cssClass: "btn-danger rounded text-sm p-2 ml-2 icon-no-ml w-36 h-36",
        },
      ],
    },
  ];

  // custom news
  inputErrors         : { name: boolean, slug: boolean } = {name: false, slug: false}
  page                :number = 1;
  index               :number = 1;
  btn_checkAdd        : "Lưu lại" | "Cập nhật";
  recordsTotal        :number = 0;

  isLoading           : boolean = false;
  menuName            : "menu_nganhang_cauhoi";
  menuNameChild       : "menu_themchuong_nganhang_cauhoi";
  bankChild           : string = "";
  btnActionChild      : 'add' | 'edit' = 'add';
  // rows                :number = this.themeSettingsService.settings.rows;
  subscription        :Subscription = new Subscription();
  // private OBSERVE_PROCESS_FORM_DATA = new Subject<FormBank>();
  // formActive          : FormBank;


  constructor() {}

  ngOnInit(): void {

  }

  get f() {
    return this.formData.controls;
  }


}
