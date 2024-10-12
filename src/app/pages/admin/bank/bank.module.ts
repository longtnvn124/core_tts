import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BankRoutingModule } from './bank-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { OvicDropdownComponent } from 'src/app/templates/ovic-dropdown/ovic-dropdown.component';
import { OvicTableComponent } from 'src/app/templates/ovic-table/ovic-table.component';
import { TableLoaderComponent } from 'src/app/templates/table-loader/table-loader.component';
import { InputTextModule } from 'primeng/inputtext';
import {RippleModule} from "primeng/ripple";


@NgModule({
  declarations: [
  ],
    imports: [
        CommonModule,
        BankRoutingModule,
        OvicTableComponent,
        PaginatorModule,
        ButtonModule,
        FormsModule,
        OvicDropdownComponent,
        ReactiveFormsModule,
        TableLoaderComponent,
        OvicDropdownComponent,
        InputTextModule,
        RippleModule
    ]
})
export class BankModule { }
