import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmptyComponent } from '@layout/empty';
import { AdminComponent } from '@layout/admin';
import {
  authGuard,
  authGuardV2,
  canActivateChild,
} from './guards/auth.guard';
import ContentNoneComponent from '@pages/content-none/content-none.component';
import UnauthorizedComponent from '@pages/auth/unauthorized/unauthorized.component';
// import { DanhSachMonHocComponent } from '@pages/admin/danh-sach-mon-hoc/danh-sach-mon-hoc.component';
// import { QlCaThiComponent } from '@pages/admin/ql-ca-thi/ql-ca-thi.component';
// import { KetQuaThiComponent } from '@pages/admin/ket-qua-thi/ket-qua-thi.component';
// import { PhucKhaoComponent } from '@pages/admin/phuc-khao/phuc-khao.component';
// import { QuanLiThiSinhComponent } from '@pages/admin/quan-li-thi-sinh/quan-li-thi-sinh.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuardV2],
    canActivateChild: [canActivateChild],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'prefix',
      },

      {
        path: 'dashboard',
        loadComponent: () => import('./pages/admin/dashboard/dashboard.component'),
        data: { title: 'Dashboard' },
      },
      {
        path: 'danh-muc',
        loadChildren: () => import('./pages/admin/danhmuc/danhmuc.module').then((m) => m.DanhmucModule),
        data: { title: 'danh muc' },
      },

      {
        path: 'he-thong',
        loadChildren: () => import('./pages/admin/he-thong/he-thong.module').then((m) => m.HeThongModule),
        data: { title: 'He thong' },
      },


      // mon-hoc
      // {
      //   path: 'mon-hoc',
      //   component: DanhSachMonHocComponent,
      //   data: { title: 'Mon Hoc' },
      // },

      // {
      //   path: 'form-de-thi',
      //   loadComponent: () => import('./pages/admin/quan-ly-form-de-thi/quan-ly-form-de-thi.component'),
      //   data: { title: 'Form đề thi' },
      // },

      // bank
      {
        path: 'ngan-hang',
        loadChildren: () => import('./pages/admin/bank/bank.module').then((m) => m.BankModule),
        data: { title: 'Ngan hang' },
      },

      // ql ca thi
      // {
      //   path: 'ca-thi',
      //   component: QlCaThiComponent,
      //   data: { title: 'Ca thi' },
      // },

      // ket qua thi
      // {
      //   path: 'ket-qua-thi',
      //   component: KetQuaThiComponent,
      //   data: { title: 'ket qua thi' },
      // },

      // quan li thi sinh
      // {
      //   path: 'quan-ly-thi-sinh',
      //   component: QuanLiThiSinhComponent,
      //   data: { title: 'quan li thi sinh' },
      // },

      // phuc khao
      // {
      //   path: 'xem-bai-thi',
      //   component: PhucKhaoComponent,
      //   data: { title: 'xem bai thi' },
      // },
      // {
      //   path: 'theo-doi-ca-thi',
      //   loadComponent: () => import('./pages/admin/theo-doi-thi/theo-doi-thi.component'),
      //   data: {title: 'Theo dõi ca thi'}
      // },

      //content none
      {
        path: 'content-none',
        component: ContentNoneComponent,
        data: { state: 'content-none' },
      },

      {
        path: '**',
        redirectTo: '/admin/content-none',
        pathMatch: 'prefix',
      },
    ],
  },
  {
    path: '',
    // component: LoginComponent
    component: EmptyComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () =>
          import('./pages/auth/auth.module').then((m) => m.AuthModule),
      },
      {
        path: '**',
        redirectTo: '/auth/login',
        pathMatch: 'full',
      },
    ],
  },

  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
    data: { state: 'unauthorized' },
  },

  // {
  // 	path: '**',
  // 	redirectTo: '/auth/login',
  // 	pathMatch: 'full'
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
