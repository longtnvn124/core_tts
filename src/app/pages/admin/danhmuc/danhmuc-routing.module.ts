import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DichvuComponent} from "@pages/admin/danhmuc/dichvu/dichvu.component";

const routes: Routes = [

  {
    path:'dm_loai_vanban',
    component:DichvuComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DanhmucRoutingModule { }
