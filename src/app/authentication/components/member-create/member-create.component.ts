import { Component, OnInit } from '@angular/core';
import { IMemberCreateComponent } from './member-create.interface';
import { IRoleAccount } from 'src/app/shareds/services/account.service';
import { SharedService } from 'src/app/shareds/services/shared.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from 'src/app/shareds/services/alert.service';
import { invalid } from '@angular/compiler/src/render3/view/util';
import { validatorsService } from 'src/app/shareds/services/validators.service';
import { MemberService } from '../../Services/member.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AppURL } from 'src/app/app.url';
import { AuthURL } from '../../authentication.url';

@Component({
  selector: 'app-member-create',
  templateUrl: './member-create.component.html',
  styleUrls: ['./member-create.component.scss'],
  providers: [MemberService]
})
export class MemberCreateComponent implements IMemberCreateComponent {
  constructor(
    private shared: SharedService,
    private builder: FormBuilder,
    private alert: AlertService,
    private validate: validatorsService,
    private member: MemberService,
    private router: Router,
    private activateRouter: ActivatedRoute

  ) {
    this.activateRouter.params.forEach(params => {
      this.memId = params.id;
    });
    this.initialCreateFormData();
    this.initialUpdateFormData();
    this.positionItems = this.shared.positionItems;
  }


  form: FormGroup;
  memId: any;
  positionItems: string[] = [];
  roleItems: IRoleAccount[] = [
    IRoleAccount.Member,
    IRoleAccount.Admin,
    IRoleAccount.Employee
  ];

  //ปุ่มบันทึกหรือแก้ไขข้อมูล
  onSummit(): void {
    if (this.form.invalid)
      return this.alert.something_wrong();
    //หากเป็นการเพิ่มสมาชิกใหม่
    if (!this.memId) {
      this.member
        .createMember(this.form.value)
        .then(res => {
          this.alert.notify('บันทึกข้อมูลสำเร็จ', 'success');
          this.router.navigate(['/', AppURL.Authen, AuthURL.Member]);
        })
        .catch(err => this.alert.notify(err.Message));
    }
    else { //หากเป็นการแก้ไขสมาชิก
      this.member.updateMember(this.memId, this.form.value)
        .then(res => {
          this.alert.notify('แก้ไขข้อมูลสำเร็จ', 'success');
          this.router.navigate(['/', AppURL.Authen, AuthURL.Member]);
        })
        .catch(err => this.alert.notify(err.Message));
    }
  }

  //แสดงข้อมูลสิทธิ์เป็นตัวหนังสือ
  getRoleName(role: IRoleAccount): string {
    return IRoleAccount[role];
  }

  //สร้างฟอร์ม
  private initialCreateFormData() {
    this.form = this.builder.group({
      image: [],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.validate.isPassword]],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      position: ['', Validators.required],
      role: ['', Validators.required]
    })
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

  //แก้ไขฟอร์ม
  private initialUpdateFormData() {
    if (!this.memId) return;
    this.member
      .getMemberById(this.memId)
      .then(member => {
        //นำข้อมูลใส่ฟอร์ม
        const form = this.form;
        form.controls['image'].setValue(member.image);
        form.controls['email'].setValue(member.email);
        form.controls['firstname'].setValue(member.firstname);
        form.controls['lastname'].setValue(member.lastname);
        form.controls['position'].setValue(member.position);
        form.controls['role'].setValue(member.role);
        form.controls['password'].setValidators(this.validate.isPassword);
      })
      .catch(err => {
        this.alert.notify(err.Message);
        this.router.navigate(['/', AppURL.Authen, AuthURL.Member]);
      });
  }

}
