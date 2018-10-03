import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { ProcessService } from '../../../../shared/_services/http/process.service';

@Component({
  selector: 'app-payment-prompt',
  templateUrl: './payment-prompt.component.html',
  styleUrls: ['./../process-upload.component.css'],
  providers: [ProcessService]
})
export class PaymentPromptComponent {

  constructor(private dialogRef: MatDialogRef<PaymentPromptComponent>) {}

  choosePayment(isPaid: boolean): void {
    this.dialogRef.close(isPaid);
  }
}
