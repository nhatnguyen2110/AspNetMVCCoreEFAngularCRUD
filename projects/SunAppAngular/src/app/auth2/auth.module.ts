import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgxAuthRoutingModule } from './auth-routing.module';
import { NbAuthModule } from '@nebular/auth';
import { 
  NbAlertModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbIconModule,
  NbInputModule
} from '@nebular/theme';
import { NgxLoginComponent } from './login/login.component';
import { NgxLogoutComponent } from './logout/logout.component';
import { GoogleOAuth2LoginComponent } from './google/oauth2-login.component';
import { GoogleOAuth2CallbackComponent } from './google/oauth2-callback.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NbAlertModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
    NgxAuthRoutingModule,

    NbAuthModule,
    NbIconModule,
    NbCardModule,
  ],
  declarations: [
    // ... here goes our new components
    NgxLoginComponent,
    NgxLogoutComponent,
    GoogleOAuth2LoginComponent,
    GoogleOAuth2CallbackComponent

  ],
})
export class NgxAuthModule {
}