import { Component, OnInit, ViewChild } from '@angular/core';
import {PlatformComponent} from '../../platform.component';

@Component({
  selector: 'app-employers-id-display',
  templateUrl: './employers-id-display.component.html',
  styleUrls: ['./employers-id-display.component.css']
})
export class EmployersIdDisplayComponent implements OnInit {

  constructor(private PlatformComponent: PlatformComponent) { }

  ngOnInit() {
  }

}
