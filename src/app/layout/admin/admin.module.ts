import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// project import
import { AdminComponent } from './admin.component';

import { SharedModule } from '@sharedModule';
import { VerticalMenuModule } from '@theme/layouts/menu/vertical-menu';
import { BreadcrumbComponent } from '@theme/layouts/breadcrumb/breadcrumb.component';
import { FooterComponent } from '@theme/layouts/footer/footer.component';
import { NavBarModule } from '@theme/layouts/toolbar/toolbar.module';
import { UserCardComponent } from '@theme/layouts/user-card/user-card.component';

@NgModule( {
	declarations : [ AdminComponent ] ,
	imports      : [ CommonModule , NavBarModule , SharedModule , RouterModule , VerticalMenuModule , BreadcrumbComponent , FooterComponent , UserCardComponent]
} )
export class AdminModule {}
