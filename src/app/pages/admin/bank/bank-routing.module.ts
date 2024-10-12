import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhSachBankComponent } from './danh-sach-bank/danh-sach-bank.component';
// import {CapNhatCauHoiComponent} from "@pages/admin/bank/cap-nhat-cau-hoi/cap-nhat-cau-hoi.component";

const routes: Routes = [
  {
    path: 'danh-sach-ngan-hang-cau-hoi',
    component: DanhSachBankComponent,
    data: {title: 'danh-sach-ngan-hang-cau-hoi'}
  },
  // {
  //   path: 'cap-nhat-cau-hoi',
  //   component: CapNhatCauHoiComponent,
  //   data: {title: 'danh-sach-ngan-hang-cau-hoi'}
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankRoutingModule { }
