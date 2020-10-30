import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AuthNavbarComponent } from './components/auth-navbar/auth-navbar.component';
import { AuthSidebarComponent } from './components/auth-sidebar/auth-sidebar.component';
import { AuthContentComponent } from './components/auth-content/auth-content.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AlertService } from './services/alert.service';
import { AccountService } from './services/account.service';
import { validatorsService } from './services/validators.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SharedService } from './services/shared.service';
import { from } from 'rxjs';

//thai lanquaqe for Datepicker
import { defineLocale } from 'ngx-bootstrap/chronos';
import { thLocale } from 'ngx-bootstrap/locale';
defineLocale('th', thLocale);


@NgModule({
  declarations: [
    AuthNavbarComponent,
    AuthSidebarComponent,
    AuthContentComponent

  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    BsDatepickerModule.forRoot()
  ],
  exports: [
    AuthNavbarComponent,
    AuthSidebarComponent,
    AuthContentComponent,
    ReactiveFormsModule,
    FormsModule,
    BsDropdownModule,
    ModalModule,
    PaginationModule,
    BsDatepickerModule
  ],
  providers: [
    AlertService,
    SharedService,
    // AccountService,
    validatorsService
  ]
})
export class SharedsModule { }
