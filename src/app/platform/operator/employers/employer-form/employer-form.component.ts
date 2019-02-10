import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectUnitService } from '../../../../shared/_services/select-unit.service';

@Component({
  selector: 'app-employer-form',
  templateUrl: './employer-form.component.html',
  styleUrls: ['./employer-form.component.css']
})
export class EmployerFormComponent implements OnInit {

  headers = [
    {label: 'הערות',    link: 'comments'},
    {label: 'מחלקות',   link: 'departments'},
    {label: 'מסמכים',   link: 'documents'},
    {label: 'אנשי קשר', link: 'contacts'},
    {label: 'סליקה',    link: 'defrayal'},
    {label: 'פיננסי',   link: 'finance'},
    {label: 'משימות',   link: 'tasks'},
    {label: 'דוחות',    link: 'reports'},
  ];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private selectUnit: SelectUnitService) { }

  ngOnInit() {
    this.selectUnit.currentEmployerID = this.route.snapshot.params.id;
  }

  // route() {
  //   this.router.navigate(['/', 'platform', 'operator', 'employers', 'form', 1, 'comments']).then();
  // }
}
