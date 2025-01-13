import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DanhmucRoutingModule } from './danhmuc-routing.module';
import {RippleModule} from "primeng/ripple";
import {ButtonModule} from "primeng/button";
import { LoaiVanbanComponent } from './loai-vanban/loai-vanban.component';
import { LoaiHosoComponent } from './loai-hoso/loai-hoso.component';



@NgModule({
  declarations: [

    LoaiVanbanComponent,
    LoaiHosoComponent,


  ],
  imports: [
    CommonModule,
    DanhmucRoutingModule,
    RippleModule,
    ButtonModule
  ]
})
export class DanhmucModule { }
