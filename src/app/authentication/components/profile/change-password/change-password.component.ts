import { Component, OnInit, Input } from '@angular/core';
import { IChangePasswordComponent } from './change-password.interface';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from 'src/app/shareds/services/alert.service';
import { validatorsService } from 'src/app/shareds/services/validators.service';
import { AccountService } from 'src/app/shareds/services/account.service';
import { AuthenService } from 'src/app/services/authen.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements IChangePasswordComponent {
  constructor(
    private builder: FormBuilder,
    private alert: AlertService,
    private validators: validatorsService,
    private account: AccountService,
    private authen: AuthenService
  ) {
    this.initialFormData();
  }

  @Input('modalRef') modalRef: BsModalRef;
  form: FormGroup;
  onSubmit() {
    if (this.form.invalid) return this.alert.something_wrong();
    this.account
      .onChangPassword(this.authen.getAuthenticated(), this.form.value)
      .then(user => {
        this.alert.notify('เปลี่ยนรหัสผ่านสำเร็จ','success');
        this.modalRef.hide();
      })
      .catch(err => this.alert.notify(err.Message));
  }

  //สร้างฟอร์ม
  private initialFormData() {
    this.form = this.builder.group({
      old_pass: ['', [Validators.required]],
      new_pass: ['', [Validators.required, this.validators.isPassword]],
      cnew_pass: ['', [Validators.required, this.validators.comparePassword('new_pass')]]
    });
  }



}
