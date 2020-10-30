import { Injectable } from "@angular/core";
import { AbstractControl } from '@angular/forms';

@Injectable()
export class validatorsService {

  //สร้าง validate โดยเช็ค รหัสผ่านและยืนยันรหัสผ่านให้เหมือนกัน
  comparePassword(passwordfield: string) {
    return function (confirm_password: AbstractControl) {
      if (!confirm_password.parent) return;
      const password = confirm_password.parent.get(passwordfield);
      const passSubscribe = password.valueChanges.subscribe(() => {
        confirm_password.updateValueAndValidity();
        passSubscribe.unsubscribe();
      });
      if (confirm_password.value === password.value) return;

      return { compare: true };
    }
  }

  //ตรวจสอบ password pattern เป็น A-z 0-9, 6-15ตัว
  isPassword(password: AbstractControl) {
    if (password.value == '') return;
    if (/^[A-z0-9]{6,15}$/.test(password.value)) return;
    return { password: true };

  }

}
