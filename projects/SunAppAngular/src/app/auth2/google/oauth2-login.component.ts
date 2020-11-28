import { Component, OnDestroy } from '@angular/core';
import { NbAuthOAuth2Token, NbAuthResult, NbAuthService } from '@nebular/auth';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'ngx-oauth2-login',
  template: `
      <h3>Redirecting...</h3>
    `,
})
export class GoogleOAuth2LoginComponent implements OnDestroy {
  token: NbAuthOAuth2Token;
  private destroy$ = new Subject<void>();
  constructor(private authService: NbAuthService) {
  }
  ngOnInit(): void {
    this.authService.authenticate('google')
      .pipe(takeUntil(this.destroy$))
      .subscribe((authResult: NbAuthResult) => {
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}