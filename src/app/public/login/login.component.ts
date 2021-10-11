// import { Component, OnInit } from '@angular/core';
//
// import { ActivatedRoute, Router } from '@angular/router';
//
// import { MatDialog } from '@angular/material';
// import { NgForm } from '@angular/forms';
//
//
// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css'],
//
// })
// export class LoginComponent implements OnInit {
//
//   hasServerError: boolean;
//   isSubmitting: boolean;
//   hide  = true;
//   massage =  false;
//
//   constructor(private router: Router,
//               private route: ActivatedRoute,
//
//               private dialog: MatDialog,
//               ) {}
//
//   ngOnInit() {
//   }
//
//   login(form: NgForm): void {
//     if (form.valid) {
//       this.hasServerError = false;
//       this.isSubmitting = true;
//       this.appHttp.login(form.value.email, form.value.password).then(response => {
//         if (response.token) {
//           this.userSession.login({username: form.value.email, token: response['token']});
//           this.userSession.setRole(response['role']);
//           this.userSession.setUserModules(response['module']);
//           this.userSession.setUserProjectGroups(response['project_groups']);
//           if (response['role'] !== 'employer') {
//             this.router.navigate(['/platform']);
//           } else {
//             console.log('I am employer');
//           }
//         } else {
//           this.hasServerError = true;
//         }
//         this.isSubmitting = false;
//       });
//     }
//   }
//
//   forgotPassword(form: NgForm): void {
//     this.helpers.setPageSpinner(true);
//     this.appHttp.forgotPassword(form.value.email).then(
//       response => {
//         this.helpers.setPageSpinner(false);
//         const message = response['message'];
//         if (message === 'No User Found' || message !== 'Message_Sent') {
//           this.notificationService.error(
//             message === 'No User Found' ?
//               'השם משתמש או המייל שגויים' : 'קימת בעיה בשליחת המייל');
//         }else {
//           this.massage = true;
//         }
//       });
//   }
// }
