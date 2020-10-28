import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-remarks',
  templateUrl: './remarks.component.html',
  styleUrls: ['./remarks.component.css']
})
export class RemarksComponent implements OnInit {
  @ViewChild(RemarksComponent) doughnut: RemarksComponent;

  constructor() { }

  ngOnInit() {
  }

}
