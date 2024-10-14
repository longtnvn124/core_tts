import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DanhmucRoutingModule } from './danhmuc-routing.module';
import { DichvuComponent } from './dichvu/dichvu.component';
import {RippleModule} from "primeng/ripple";
import {ButtonModule} from "primeng/button";


@NgModule({
  declarations: [
    DichvuComponent
  ],
  imports: [
    CommonModule,
    DanhmucRoutingModule,
    RippleModule,
    ButtonModule
  ]
})
export class DanhmucModule { }
