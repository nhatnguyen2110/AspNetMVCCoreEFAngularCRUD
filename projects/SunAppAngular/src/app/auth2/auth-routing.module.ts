import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NbAuthComponent } from '@nebular/auth';
import { FacebookOAuth2CallbackComponent } from './facebook/oauth2-callback.component';
import { FacebookOAuth2LoginComponent } from './facebook/oauth2-login.component';
import { GithubOAuth2CallbackComponent } from './github/oauth2-callback.component';
import { GithubOAuth2LoginComponent } from './github/oauth2-login.component';
import { GoogleOAuth2CallbackComponent } from './google/oauth2-callback.component';
import { GoogleOAuth2LoginComponent } from './google/oauth2-login.component';
import { NgxLoginComponent } from './login/login.component';
import { NgxLogoutComponent } from './logout/logout.component';

export const routes: Routes = [
  // .. here goes our components routes
  {
    path: '',
    component: NbAuthComponent,  
    children: [
      {
        path: 'login',
        component: NgxLoginComponent, 
      },
      {
        path: 'logout',
        component: NgxLogoutComponent, 
      },
      {
        path: 'google/login',
        component: GoogleOAuth2LoginComponent, 
      },
      {
        path: 'google/callback',
        component: GoogleOAuth2CallbackComponent, 
      },
      {
        path: 'facebook/login',
        component: FacebookOAuth2LoginComponent, 
      },
      {
        path: 'facebook/callback',
        component: FacebookOAuth2CallbackComponent, 
      },
      {
        path: 'github/login',
        component: GithubOAuth2LoginComponent, 
      },
      {
        path: 'github/callback',
        component: GithubOAuth2CallbackComponent, 
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NgxAuthRoutingModule {
}