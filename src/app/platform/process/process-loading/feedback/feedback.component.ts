import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ProcessDataService } from 'app/shared/_services/process-data-service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css', './../../process-loading/process-loading.component.css'],
})
export class FeedbackComponent implements OnInit {

  activeUrl = 'files';


  headers = [
    {label: 'מעקב ברמת קובץ',    url: 'files'  },
    {label: 'מעקב ברמת עובד',   url: 'employees' },
  ];


  constructor(private router: Router,
              public processDataService: ProcessDataService,
              private selectUnit: SelectUnitService) { }

  ngOnInit() {
    if (this.processDataService.activeProcess === undefined) {
      this.processDataService = this.selectUnit.getProcessData();
    }
    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        this.setActiveUrl(event.url);
      }
    });
  }

  private setActiveUrl(url: string): void {
    this.activeUrl = url.indexOf('employees') === -1 ? 'files' : 'employees';
  }

}
