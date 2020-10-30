import { IRoleAccount } from 'src/app/shareds/services/account.service';
import { FormGroup } from '@angular/forms';

export interface IMemberCreateComponent {
  positionItems: string[];
  roleItems: IRoleAccount[];
  form: FormGroup;
  memId: any;

  onSummit(): void;
  getRoleName(role: IRoleAccount): string;
  onConvertImage(input: HTMLInputElement);
}
