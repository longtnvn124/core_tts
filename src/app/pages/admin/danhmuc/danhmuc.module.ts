import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DanhmucRoutingModule} from './danhmuc-routing.module';
import {RippleModule} from "primeng/ripple";
import {ButtonModule} from "primeng/button";
import {LoaiHosoComponent} from './loai-hoso/loai-hoso.component';
import {FormsModule} from "@angular/forms";


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        DanhmucRoutingModule,
        RippleModule,
        ButtonModule,
        FormsModule,
        LoaiHosoComponent
    ]
})
export class DanhmucModule {
}
