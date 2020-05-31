import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ProcessDetails } from 'app/shared/_models/process-details.model';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-incorrect-rows',
  templateUrl: './incorrect-rows.component.html',
  styleUrls: ['./incorrect-rows.component.css']
})
export class IncorrectRowsComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public process_details: ProcessDetails,
              private selectUnit: SelectUnitService) { }
  sub = new Subscription;

  ngOnInit() {
    this.selectUnit.setCountIncorrectRows(this.process_details.count);
    // this.sub.add(this.selectUnit.unitIncorrectRows.subscribe(() => this.fetchItems()));
    this.sub.add(this.selectUnit.unitIncorrectRows.subscribe(() => this.fetchItems()));

  }

  fetchItems(): void {
    alert('aaa');
    // this.selectUnit.countIncorrectRows = this.selectUnit.getCountIncorrectRows();
  }

  setPage(): void {
    const location = 'http://localhost:4200/records';
     window.open(location, '_blank', 'location=yes,scrollbars=yes,status=yes');
   }

}
