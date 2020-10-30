import { Component, OnInit } from '@angular/core';
import { AppURL } from 'src/app/app.url';
import { ILoginComponent } from './login.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from 'src/app/shareds/services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthURL } from 'src/app/authentication/authentication.url';
import { AccountService } from 'src/app/shareds/services/account.service';
import { AuthenService } from 'src/app/services/authen.service';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements ILoginComponent {

  constructor(
    private builder: FormBuilder,
    private alert: AlertService,
    private router: Router,
    private account: AccountService,
    private authen: AuthenService,
    private activatedRoute: ActivatedRoute
  ) {
    //เก็บค่า return url เพื่อ redirect หลังจาก login
    this.activatedRoute.params.forEach(params => {
      this.returnURL = params.returnURL || `/${AppURL.Authen}/${AuthURL.Dashboard}`;
    })
    this.initialCreateFormData();
  }

  Url = AppURL;
  returnURL: string;
  form: FormGroup;

  //เข้าสู่ระบบ
  onSubmit(): void {
    if (this.form.invalid)
      return this.alert.something_wrong();

    this.account
      .onLogin(this.form.value)
      .then(res => {
        //เก็บ session
        this.authen.setAuthenticated(res.accessToken);
        //redirect page
        this.alert.notify('เข้าสู่ระบบสำเร็จ', 'info');
        this.router.navigateByUrl(this.returnURL);
      })
      .catch(err => this.alert.notify(err.Message));
  }

  //create form
  private initialCreateFormData() {
    this.form = this.builder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      remember: [true]
    });
  }
}
