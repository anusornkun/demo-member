import { Component, OnInit } from '@angular/core';
import { AppURL } from 'src/app/app.url';
import { AuthURL } from 'src/app/authentication/authentication.url';
import { Router } from '@angular/router';
import { AuthenService } from 'src/app/services/authen.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-auth-navbar',
  templateUrl: './auth-navbar.component.html',
  styleUrls: ['./auth-navbar.component.scss']
})
export class AuthNavbarComponent implements OnInit {
  constructor(
    private router: Router,
    private authen: AuthenService,
    private alert: AlertService
  ) { }

  ngOnInit(): void {
  }

  AppURL = AppURL;
  AuthURL = AuthURL;

  //ออกจากระบบ
  onLogout() {
    this.authen.clearAuthenticated();
    this.router.navigate(['/', AppURL.Login]);
    this.alert.notify('ออกจากระบบสำเร็จ', 'info');
  }

}
