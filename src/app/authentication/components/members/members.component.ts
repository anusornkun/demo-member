import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MemberService } from '../../Services/member.service';
import { IMembersComponent, IMemberSearchKey, IMemberSearch, IMember } from './members.interface';
import { IAccount, IRoleAccount } from 'src/app/shareds/services/account.service';
import { AlertService } from 'src/app/shareds/services/alert.service';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Console } from 'console';
import { Router } from '@angular/router';
import { AppURL } from 'src/app/app.url';
import { AuthURL } from '../../authentication.url';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
  providers: [MemberService]
})
export class MembersComponent implements IMembersComponent {

  constructor(
    private member: MemberService,
    private alert: AlertService,
    private datect: ChangeDetectorRef,
    private router: Router,
    private localeService: BsLocaleService
  ) {
    //use datepicker thai lanquaqe
    this.localeService.use('th');
    //โหลดข้อมูลสมาชิก
    this.initialLoadMember({
      startPage: this.startPage,
      limitPage: this.limitPage
    });
    //กำหนดค่าเริ่มต้นให้กับ searchType
    this.searchType = this.searchTypeItems[0];
  }

  //ตัวแปร pagination
  startPage: number = 1;
  limitPage: number = 5;

  onPageChanged(page: PageChangedEvent) {
    this.initialLoadMember({
      searchText: this.getSearchText,
      searchType: this.searchType.key,
      startPage: page.page,
      limitPage: page.itemsPerPage
    });
  }

  //ค้นหาข้อมูล
  onSearchItem(): void {
    console.log(this.getSearchText)
    // this.startPage = 1;
    // this.initialLoadMember({
    //   searchText: this.getSearchText,
    //   searchType: this.searchType.key,
    //   startPage: this.startPage,
    //   limitPage: this.limitPage
    // });
    // this.datect.detectChanges();
  }

  items: IMember;
  searchText: string = '';
  searchType: IMemberSearchKey;
  searchTypeItems: IMemberSearchKey[] = [
    { key: 'email', value: 'ค้นหาจากอีเมล' },
    { key: 'firstname', value: 'ค้นหาจากชื่อ' },
    { key: 'lastname', value: 'ค้นหาจากนามสกุล' },
    { key: 'position', value: 'ค้นหาจากตำแหน่ง' },
    { key: 'role', value: 'ค้นหาจากสิทธิ์' },
    { key: 'updated', value: 'ค้นหาจากวันที่' }
  ];

  //โหลดข้อมูลสมาชิก
  private initialLoadMember(options?: IMemberSearch) {
    this.member
      .getMembers(options)
      .then(items => this.items = items)
      .catch(err => this.alert.notify(err.Message));
  }

  //แสดงชื่อสิทธิ์ผู้ใช้งาน
  getRoleName(role: IRoleAccount) {
    return IRoleAccount[role];
  }

  onDeleteMember(item: IAccount) {
    this.alert.confirm().then(res => {
      if (!res) return;
      this.member
        .deleteMember(item.id)
        .then(() => {
          //โหลดข้อมูล member ใหม่
          this.initialLoadMember({
            searchText: this.getSearchText,
            searchType: this.searchType.key,
            startPage: this.startPage,
            limitPage: this.limitPage
          });
          this.alert.notify('ลบข้อมูลสำเร็จ', 'success');
        })
        .catch(err => this.alert.notify(err.Message));
    });
  }

  onUpdateMember(item: IAccount) {
    this.router.navigate(['',
      AppURL.Authen,
      AuthURL.MemberCreate,
      item.id
    ]);
  }

  //ตรวจสอบและ return search text
  private get getSearchText() {
    let responseSearch = null;
    switch (this.searchType.key) {
      case 'role':
        responseSearch = IRoleAccount[this.searchText] || '';
        break;
      case 'updated':
        responseSearch = { from: this.searchText[0], to: this.searchText[1] };
        break;
      default:
        responseSearch = this.searchText;
        break;
    }
    return responseSearch;
    // return this.searchType.key == 'role' ? IRoleAccount[this.searchText] || '' : this.searchText;
  }



}
