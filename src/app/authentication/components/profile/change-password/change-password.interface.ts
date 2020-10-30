import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup } from '@angular/forms';

export interface IChangePasswordComponent {
  modalRef: BsModalRef;
  form: FormGroup;

  onSubmit();
}

export interface IChangePassword {
  old_pass: string;
  new_pass: string;
}
