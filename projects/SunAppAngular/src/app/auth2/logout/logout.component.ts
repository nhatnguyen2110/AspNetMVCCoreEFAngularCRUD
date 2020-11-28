import { Component, OnInit } from '@angular/core';
import { NbLogoutComponent } from '@nebular/auth';

@Component({
  selector: 'ngx-logout',
  template: '<div>Logging out, please wait...</div>'
})
export class NgxLogoutComponent extends NbLogoutComponent implements OnInit {

  ngOnInit(){
    localStorage.removeItem('auth_app_token');

    this.router.navigateByUrl('/auth2/login');
  }

}