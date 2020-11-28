import { Component, OnDestroy } from '@angular/core';
import { NbAuthJWTToken, NbAuthResult, NbAuthService } from '@nebular/auth';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpServerService } from 'src/app/services/http-server.service';

@Component({
  selector: 'ngx-playground-oauth2-callback',
  template: `
  <strong>Authenticating...</strong><br/>
  `,
})
export class FacebookOAuth2CallbackComponent implements OnDestroy {

  private destroy$ = new Subject<void>();

  constructor(private authService: NbAuthService, private router: Router, private serverHttp: HttpServerService) {
    this.authService.authenticate('facebook')
      .pipe(takeUntil(this.destroy$))
      .subscribe((authResult: NbAuthResult) => {
        if (authResult.isSuccess() && authResult.getRedirect()) {
          this.router.navigateByUrl(authResult.getRedirect());
        }
      });
  }
  getUserInfo() {
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          const _token = token.getPayload(); // here we receive a payload from the token and assigns it to our `user` variable                          
          console.log("access token", _token.access_token);

          this.serverHttp.getPureHttpRequest("https://graph.facebook.com/me",
            { fields: "id,name,picture,email", access_token: _token.access_token }
            , null
          ).subscribe(data => {
            console.log('facebook response', data);
          })
        }

      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}