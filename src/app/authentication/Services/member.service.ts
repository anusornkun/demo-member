import { Injectable } from "@angular/core";
import { AccountService, IAccount, IRoleAccount } from 'src/app/shareds/services/account.service';
import { resolve } from 'dns';
import { rejects } from 'assert';
import { IMemberSearch, IMember } from '../components/members/members.interface';
import { dataURItoBlob } from 'src/assets/js/plugins/dropzone';
import { promise } from 'protractor';

@Injectable()
export class MemberService {

  constructor(private account: AccountService) {
    if (this.account.mockUserItem.length <= 2)
      this.generateMember();
  }

  //ดึงข้อมูลสมาชิกทั้งหมด
  getMembers(options?: IMemberSearch) {
    return new Promise<IMember>((resolve, rejects) => {
      //เรียงลำดับข้อมูล จากวันที่แก้ไขล่าสุด
      let items = this.account.mockUserItem.sort((a1, a2) => {
        return Date.parse(a2.updated.toString()) - Date.parse(a1.updated.toString());
      });
      // เลือก pagination
      const startItem = (options.startPage - 1) * options.limitPage;
      const endItem = options.startPage * options.limitPage;
      //หากมีการค้นหาข้อมูล
      if (options && options.searchText && options.searchType) {
        items = this.account.mockUserItem.filter(x => x[options.searchType].toString().toLowerCase()
          .indexOf(options.searchText.toString().toLowerCase()) >= 0
        );
      }
      resolve({ items: items.slice(startItem, endItem), totalItems: items.length });
    });
  }

  //ดึงข้อมูลสมาชิกแค่คนเดียว by id
  getMemberById(id) {
    return new Promise<IAccount>((resolve, rejects) => {
      const member = this.account.mockUserItem.find(x => x.id == id);
      if (!member) return rejects({ Message: 'ไม่มีสมาชิกนี้ในระบบ' });
      resolve(member);
    });
  }

  createMember(model: IAccount) {
    return new Promise<IAccount>((resolve, rejects) => {
      if (this.account.mockUserItem.find(x => x.email == model.email))
        return rejects({ Message: 'อีเมลนี้มีในระบบแล้ว' });
      model.id = Math.random();
      model.created = new Date();
      model.updated = new Date();
      this.account.mockUserItem.push(model);
      resolve(model);
    });
  }

  //ลบข้อมูล member
  deleteMember(id: any) {
    return new Promise((resolve, rejects) => {
      const findIndex = this.account.mockUserItem.findIndex(x => x.id == id);
      if (findIndex < 0) return rejects({ Message: 'ไม่มีข้อมูลนี้ในระบบ' });
      resolve(this.account.mockUserItem.splice(findIndex, 1));
    });
  }

  //แก้ไขข้อมูลสมาชิก
  updateMember(id: any, model: IAccount) {
    return new Promise<IAccount>((resolve, rejects) => {
      const member = this.account.mockUserItem.find(x => x.id == id);
      if (!member) return rejects({ Message: 'ไม่มีข้อมูลสมาชิกในระบบ' });
      //ตรวจสอบว่าอีเมลนี้มีในระบบหรือยัง
      if (this.account.mockUserItem.find(x => {
        return x.email == model.email && model.email != member.email;
      })) return rejects({ Message: 'มีอีเมลนี้ในระบบแล้ว' });

      member.email = model.email;
      member.image = model.image;
      member.firstname = model.firstname;
      member.lastname = model.lastname;
      member.password = model.password || member.password; //หากไม่ได้กรอกเข้ามา จะใช้ค่าเดิม
      member.position = model.position;
      member.role = model.role;
      member.updated = new Date();
      resolve(member);
    });
  }

  //จำลองข้อมูล
  private generateMember() {
    const positions = ['Frontend Develper', 'Backend Developer', 'Full Stack'];
    const roles = [IRoleAccount.Admin, IRoleAccount.Employee, IRoleAccount.Member];
    for (let i = 3; i <= 248; i++)
      this.account.mockUserItem.push({
        id: i.toString(),
        firstname: `Firstname ${i}`,
        lastname: `Lastname ${i}`,
        email: `mail-${i}@mail.com`,
        password: '123456',
        position: positions[Math.round(Math.random() * 2)],
        role: roles[Math.round(Math.random() * 2)],
        created: new Date(),
        updated: new Date(2020, 7, Math.random() * 24 + 1)
      });
  }
}
