import { Component } from '@angular/core';
import { NbAuthOAuth2Token, NbAuthService } from '@nebular/auth';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserInfo } from '../models/UserInfo';
import { CommonService } from '../services/common.service';
import { HttpServerService } from '../services/http-server.service';

import { MENU_ITEMS } from './pages-menu';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent {

  menu = MENU_ITEMS;
  private destroy$ = new Subject<void>();
  constructor(
    private authService: NbAuthService,
    private commonService: CommonService,
    private serverHttp: HttpServerService){

  }
  ngOnInit() {
    if(!this.commonService.userInfo){
      this.authService.onTokenChange()
      .pipe(takeUntil(this.destroy$))
      .subscribe((token: NbAuthOAuth2Token) => {
        console.log('token',token);
        if (token && token.isValid()) {
          let _tkLoad = token.getPayload();
          if(token.getOwnerStrategyName() == "email"){
            let user =  {
              name: _tkLoad.givename,
              picture: _tkLoad.website
            } as UserInfo;
            this.commonService.setUserInfo(user);
          }
          else if(token.getOwnerStrategyName() == "facebook"){
            this.serverHttp.getPureHttpRequest("https://graph.facebook.com/me",
            {
              fields:"id,name,picture,email", 
              access_token: _tkLoad.access_token
            }
            ,null).subscribe(data=>{
              let user =  {
                name: data.name,
                picture: data.picture?.data.url
              } as UserInfo;
              this.commonService.setUserInfo(user);
            });
          }
          else if(token.getOwnerStrategyName() == "google"){
            this.serverHttp.getPureHttpRequest("https://www.googleapis.com/oauth2/v3/userinfo",
            {access_token: _tkLoad.access_token}
            ,null
          ).subscribe(data=>{
            let user =  {
              name: data.name,
              picture: data.picture
            } as UserInfo;
            this.commonService.setUserInfo(user);
          })
          }
        }
      });
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

