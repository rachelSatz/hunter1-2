import {Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.css']
})
export class ProcessComponent implements OnInit, OnDestroy {

  activeStep: number;
  sub = new Subscription;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.activeStep = this.route.snapshot.firstChild.data['step'];
    this.sub.add(this.route.url.subscribe(() => {
      this.activeStep = this.route.snapshot.firstChild.data['step'];
    }));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
