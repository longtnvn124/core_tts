import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoaiVanbanComponent} from "@pages/admin/danhmuc/loai-vanban/loai-vanban.component";
import {LoaiHosoComponent} from "@pages/admin/danhmuc/loai-hoso/loai-hoso.component";
import {LoaiDichvuComponent} from "@pages/admin/danhmuc/loai-dichvu/loai-dichvu.component";

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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DanhmucRoutingModule { }
