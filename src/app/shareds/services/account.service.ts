import { Injectable } from "@angular/core";
import { IRegister } from 'src/app/components/register/register.interface';
import { promise } from 'protractor';
import { resolve } from 'dns';
import { rejects } from 'assert';
import { ILogin } from 'src/app/components/login/login.interface';
import { IProfile } from 'src/app/authentication/components/profile/profile.interface';
import { IChangePassword } from 'src/app/authentication/components/profile/change-password/change-password.interface';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root'  //Service นี้ตั้งเป็น Global ไว้ก่อน
})
export class AccountService {
  constructor(
    private http: HttpService
  ) { }

  public mockUserItem: IAccount[] = [
    {
      id: 1,
      firstname: 'Anusorn',
      lastname: 'Kunkaew',
      email: 'mega.nueng98@gmail.com',
      password: '111111',
      position: 'Full Stack',
      image: "assets/images/brown.png",
      role: IRoleAccount.Admin,
      created: new Date(),
      updated: new Date()
    },
    {
      id: 2,
      firstname: 'Leo',
      lastname: 'Omega',
      email: 'mega@gmail.com',
      password: '111111',
      position: 'Backend Developer',
      image: null,
      role: IRoleAccount.Employee,
      created: new Date(),
      updated: new Date()
    }
  ];

  //เปลี่ยนรหัสผ่าน
  onChangPassword(accessToken: string, model: IChangePassword) {
    return new Promise((resolve, rejects) => {
      const userProfile = this.mockUserItem.find(x => x.id == accessToken);
      if (!userProfile) return rejects({ Message: 'ไม่มีข้อมูลผู้ใช้นี้' });
      if (userProfile.password !== model.old_pass) return rejects({ Message: 'รหัสผ่านเดิมไม่ถูกต้อง' });
      userProfile.password = model.new_pass;
      userProfile.updated = new Date();
      resolve(userProfile);
    });
  }

  //แก้ไขข้อมูลส่วนตัว Update Profile
  onUpdateProfile(accessToken: string, model: IProfile) {
    return new Promise((resolve, rejects) => {
      const userProfile = this.mockUserItem.find(x => x.id == accessToken);
      if (!userProfile) return rejects({ Message: 'ไม่มีผู้ใช้นี้ในระบบ' });
      userProfile.firstname = model.firstname;
      userProfile.lastname = model.lastname;
      userProfile.position = model.position;
      userProfile.image = model.image;
      userProfile.updated = new Date();
      resolve(userProfile);
    });
  }

  //ดึงข้อมูลผู้ที่เข้าสุ่ระบบ จาก Token
  getUserLogin(accessToken: string) {
    return new Promise<IAccount>((resolve, rejects) => {
      const userLogin = this.mockUserItem.find(x => x.id == accessToken);
      if (!userLogin) return rejects({ Message: 'accessToken ไม่ถูกต้อง' });
      resolve(userLogin);
    });
  }

  //login
  onLogin(model: ILogin) {
    return new Promise<{ accessToken: string }>((resolve, rejects) => {
      const userLogin = this.mockUserItem.find(x => x.email == model.email && x.password == model.password);
      if (!userLogin) return rejects({ Message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });

      resolve({
        accessToken: userLogin.id
      });
    });
  }

  //register
  onRegister(model: IRegister) {
    return new Promise((resolve, rejects) => {
      const _model: IAccount = model;
      _model.id = Math.random();
      _model.image = null;
      _model.position = '';
      _model.role = IRoleAccount.Member;
      _model.created = new Date();
      _model.updated = new Date();
      this.mockUserItem.push(model);
      resolve(model);
    });
  }
}

export interface IAccount {
  firstname: string;
  lastname: string;
  email: string;
  password: string;

  id?: any;
  position?: string;
  image?: string;
  role?: IRoleAccount;
  created?: Date;
  updated?: Date;
}

export enum IRoleAccount {
  Member = 1,
  Admin,
  Employee
}
