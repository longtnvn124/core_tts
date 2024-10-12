import { Routes, RouterModule } from '@angular/router';
import { ThongTinTaiKhoanComponent } from './thong-tin-tai-khoan/thong-tin-tai-khoan.component';
import { QuanLyTaiKhoanComponent } from './quan-ly-tai-khoan/quan-ly-tai-khoan.component';
import { NgModule } from '@angular/core';


const routes: Routes = [
  { 
    path : 'thong-tin-tai-khoan',
    component : ThongTinTaiKhoanComponent
  },
  { 
    path : 'quan-ly-tai-khoan',
    component : QuanLyTaiKhoanComponent
  },
  { 
    path : '**',
    redirectTo : 'thong-tin-tai-khoan'
  },
];

// @NgModule({
// 	imports: [RouterModule.forRoot(routes)],
// 	exports: [RouterModule]
// })
export const HeThongRoutes = RouterModule.forChild(routes);
// export class HeThongRoutingModule { }