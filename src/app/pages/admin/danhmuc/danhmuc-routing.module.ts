import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoaiVanbanComponent} from "@pages/admin/danhmuc/loai-vanban/loai-vanban.component";
import {LoaiHosoComponent} from "@pages/admin/danhmuc/loai-hoso/loai-hoso.component";
import {LoaiDichvuComponent} from "@pages/admin/danhmuc/loai-dichvu/loai-dichvu.component";
import {DmSachComponent} from "@pages/admin/danhmuc/dm-sach/dm-sach.component";

const routes: Routes = [

  {
    path:'dm-dichvu',
    component:LoaiDichvuComponent
  },
  {
    path:'dm-loai-vanban',
    component:LoaiVanbanComponent
  },
  {
    path:'dm-loai-hoso',
    component:LoaiHosoComponent
  },
  {
    path:'dm-sach',
    component:DmSachComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DanhmucRoutingModule { }
