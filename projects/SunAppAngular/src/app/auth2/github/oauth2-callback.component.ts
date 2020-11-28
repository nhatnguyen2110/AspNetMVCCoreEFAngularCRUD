import { Component, OnDestroy } from '@angular/core';
import { NbAuthResult, NbAuthService } from '@nebular/auth';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'ngx-playground-oauth2-callback',
  template: `
    <strong>Authenticating...</strong>
  `,
})
export class GithubOAuth2CallbackComponent implements OnDestroy {

  private destroy$ = new Subject<void>();

  constructor(private authService: NbAuthService, private router: Router) {
    this.authService.authenticate('github')
      .pipe(takeUntil(this.destroy$))
      .subscribe((authResult: NbAuthResult) => {
        console.log('authResult',authResult)
        if (authResult.isSuccess() && authResult.getRedirect()) {
          this.router.navigateByUrl(authResult.getRedirect());
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}