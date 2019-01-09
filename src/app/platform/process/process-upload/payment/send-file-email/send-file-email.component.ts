import { Component, OnInit } from '@angular/core';
import { ProcessService } from 'app/shared/_services/http/process.service';

@Component({
  selector: 'app-send-file-email',
  templateUrl: './send-file-email.component.html'
})
export class SendFileEmailComponent implements OnInit {

  constructor(public  processService: ProcessService) { }

  ngOnInit() {
  }
}
