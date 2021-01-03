import { Component, OnInit } from '@angular/core';
import { SelectUnitService } from '../../../../shared/_services/select-unit.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

  constructor(private selectUnit: SelectUnitService) { }

  ngOnInit() {
  }

}
