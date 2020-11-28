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
export class GoogleOAuth2CallbackComponent implements OnDestroy {

  private destroy$ = new Subject<void>();

  constructor(
    private authService: NbAuthService,
    private router: Router,
    private serverHttp: HttpServerService) {
    this.authService.authenticate('google')
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
          const loadToken = token.getPayload(); // here we receive a payload from the token and assigns it to our `user` variable                          
          console.log("access token", loadToken.access_token);

          this.serverHttp.getPureHttpRequest("https://www.googleapis.com/oauth2/v3/userinfo?access_token=" + loadToken.access_token, null, null
          ).subscribe(data => {
            console.log('google response', data);
          });
        }

      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}