import { Component, OnInit, TemplateRef } from '@angular/core';
import { IProfileComponent } from './profile.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from 'src/app/shareds/services/account.service';
import { AuthenService } from 'src/app/services/authen.service';
import { AlertService } from 'src/app/shareds/services/alert.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SharedService } from 'src/app/shareds/services/shared.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements IProfileComponent {

  constructor(
    private builder: FormBuilder,
    private account: AccountService,
    private authen: AuthenService,
    private alert: AlertService,
    private modalService: BsModalService,
    private shared: SharedService
  ) {
    this.initialCreateFormDate();
    this.initialLoadUpdateFormData();
    //เพิ่มตำแหน่ง
    this.positionItems = this.shared.positionItems;
  }

  form: FormGroup;
  modalRef: BsModalRef;
  positionItems: any[] = [];

  //บันทึกข้อมูล
  onSubmit(): void {
    if (this.form.invalid) return this.alert.something_wrong();
    this.account
      .onUpdateProfile(this.authen.getAuthenticated(), this.form.value)
      .then(() => this.alert.notify('แก้ไขข้อมูลสำเร็จ', 'success'))
      .catch(err => this.alert.notify(err.Message));
  }

  //แปลงไฟล์รูปภาพ เป็น base64
  onConvertImage(input: HTMLInputElement) {
    const imageControl = this.form.controls['image'];
    this.shared
      .onConvertImage(input)
      .then(base64 => imageControl.setValue(base64))
      .catch(err => {
        input.value = null;
        imageControl.setValue(null);
        this.alert.notify(err.Message);
      });
  }

  //สร้างฟอร์ม
  private initialCreateFormDate() {
    this.form = this.builder.group({
      email: [],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      position: ['', Validators.required],
      image: [null]
    });
    this.form.get('email').disable();
  }

  //เปิด modal dialog
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  private initialLoadUpdateFormData() {
    this.account
      .getUserLogin(this.authen.getAuthenticated())
      .then(user => {
        this.form.controls['email'].setValue(user.email);
        this.form.controls['firstname'].setValue(user.firstname);
        this.form.controls['lastname'].setValue(user.lastname);
        this.form.controls['position'].setValue(user.position);
        this.form.controls['image'].setValue(user.image);
      })
      .catch(err => this.alert.notify(err.Message));
  }

}
