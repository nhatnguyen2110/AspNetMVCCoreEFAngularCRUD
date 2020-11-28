import { Injectable, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbAuthJWTToken, NbAuthModule, NbAuthOAuth2Token, NbAuthSimpleToken, NbAuthStrategyClass, NbDummyAuthStrategy, NbOAuth2AuthStrategy, NbOAuth2AuthStrategyOptions, NbOAuth2ResponseType, NbPasswordAuthStrategy } from '@nebular/auth';
import { NbSecurityModule, NbRoleProvider } from '@nebular/security';
import { of as observableOf } from 'rxjs';

import { throwIfAlreadyLoaded } from './module-import-guard';
import {
  AnalyticsService,
  LayoutService,
  PlayerService,
  SeoService,
  StateService,
} from './utils';
import { UserData } from './data/users';
import { ElectricityData } from './data/electricity';
import { SmartTableData } from './data/smart-table';
import { UserActivityData } from './data/user-activity';
import { OrdersChartData } from './data/orders-chart';
import { ProfitChartData } from './data/profit-chart';
import { TrafficListData } from './data/traffic-list';
import { EarningData } from './data/earning';
import { OrdersProfitChartData } from './data/orders-profit-chart';
import { TrafficBarData } from './data/traffic-bar';
import { ProfitBarAnimationChartData } from './data/profit-bar-animation-chart';
import { TemperatureHumidityData } from './data/temperature-humidity';
import { SolarData } from './data/solar';
import { TrafficChartData } from './data/traffic-chart';
import { StatsBarData } from './data/stats-bar';
import { CountryOrderData } from './data/country-order';
import { StatsProgressBarData } from './data/stats-progress-bar';
import { VisitorsAnalyticsData } from './data/visitors-analytics';
import { SecurityCamerasData } from './data/security-cameras';

import { UserService } from './mock/users.service';
import { ElectricityService } from './mock/electricity.service';
import { SmartTableService } from './mock/smart-table.service';
import { UserActivityService } from './mock/user-activity.service';
import { OrdersChartService } from './mock/orders-chart.service';
import { ProfitChartService } from './mock/profit-chart.service';
import { TrafficListService } from './mock/traffic-list.service';
import { EarningService } from './mock/earning.service';
import { OrdersProfitChartService } from './mock/orders-profit-chart.service';
import { TrafficBarService } from './mock/traffic-bar.service';
import { ProfitBarAnimationChartService } from './mock/profit-bar-animation-chart.service';
import { TemperatureHumidityService } from './mock/temperature-humidity.service';
import { SolarService } from './mock/solar.service';
import { TrafficChartService } from './mock/traffic-chart.service';
import { StatsBarService } from './mock/stats-bar.service';
import { CountryOrderService } from './mock/country-order.service';
import { StatsProgressBarService } from './mock/stats-progress-bar.service';
import { VisitorsAnalyticsService } from './mock/visitors-analytics.service';
import { SecurityCamerasService } from './mock/security-cameras.service';
import { MockDataModule } from './mock/mock-data.module';

const socialLinks = [
  // {
  //   url: '/auth2/github/login',
  //   target: '',
  //   icon: 'github',
  // },
  {
    url: '/auth2/facebook/login',
    target: '',
    icon: 'facebook',
  },
  {
    url: '/auth2/google/login',
    target: '',
    icon: 'google',
  },
];

const DATA_SERVICES = [
  { provide: UserData, useClass: UserService },
  { provide: ElectricityData, useClass: ElectricityService },
  { provide: SmartTableData, useClass: SmartTableService },
  { provide: UserActivityData, useClass: UserActivityService },
  { provide: OrdersChartData, useClass: OrdersChartService },
  { provide: ProfitChartData, useClass: ProfitChartService },
  { provide: TrafficListData, useClass: TrafficListService },
  { provide: EarningData, useClass: EarningService },
  { provide: OrdersProfitChartData, useClass: OrdersProfitChartService },
  { provide: TrafficBarData, useClass: TrafficBarService },
  { provide: ProfitBarAnimationChartData, useClass: ProfitBarAnimationChartService },
  { provide: TemperatureHumidityData, useClass: TemperatureHumidityService },
  { provide: SolarData, useClass: SolarService },
  { provide: TrafficChartData, useClass: TrafficChartService },
  { provide: StatsBarData, useClass: StatsBarService },
  { provide: CountryOrderData, useClass: CountryOrderService },
  { provide: StatsProgressBarData, useClass: StatsProgressBarService },
  { provide: VisitorsAnalyticsData, useClass: VisitorsAnalyticsService },
  { provide: SecurityCamerasData, useClass: SecurityCamerasService },
];

export class NbSimpleRoleProvider extends NbRoleProvider {
  getRole() {
    // here you could provide any role based on any auth flow
    return observableOf('guest');
  }
}
@Injectable()
export class NbGoogleOAuth2Strategy extends NbOAuth2AuthStrategy {
  static setup(options: NbOAuth2AuthStrategyOptions): [NbAuthStrategyClass, NbOAuth2AuthStrategyOptions] {
    return [NbGoogleOAuth2Strategy, options]; // HERE we make sure our strategy reutrn correct class reference
  }
}
@Injectable()
export class NbFacebookOAuth2Strategy extends NbOAuth2AuthStrategy {
  static setup(options: NbOAuth2AuthStrategyOptions): [NbAuthStrategyClass, NbOAuth2AuthStrategyOptions] {
    return [NbFacebookOAuth2Strategy, options]; // HERE we make sure our strategy reutrn correct class reference
  }
}
// @Injectable()
// export class NbGithubOAuth2Strategy extends NbOAuth2AuthStrategy {
//   static setup(options: NbOAuth2AuthStrategyOptions): [NbAuthStrategyClass, NbOAuth2AuthStrategyOptions] {
//     return [NbGithubOAuth2Strategy, options]; // HERE we make sure our strategy reutrn correct class reference
//   }
// }

export const NB_CORE_PROVIDERS = [
  ...MockDataModule.forRoot().providers,
  ...DATA_SERVICES,
  ...NbAuthModule.forRoot({

    strategies: [
      // NbDummyAuthStrategy.setup({
      //   name: 'email',
      //   delay: 1000
      // }),
      NbPasswordAuthStrategy.setup({
        name: 'email',
        baseEndpoint: 'http://localhost:57467/',
        login: {
          endpoint: 'api/authenticate',
          method: 'post',
          redirect: {
            success: '/pages/dashboard',

          },
          defaultErrors: ['UserName/Password combination is not correct, please try again.'],
        },
        token: {
          class: NbAuthJWTToken,
          key: 'token'
        },
        errors: {
          getter: (module, res, options) => {
            return res.error ? res.error : options[module].defaultErrors;
          },
        },
      }),
      NbGoogleOAuth2Strategy.setup({
        name: 'google',
          clientId: '888283199761-a4mk5j1kfj66iqfldu73386de3gjnpjk.apps.googleusercontent.com',
          clientSecret: '',
          authorize: {
            endpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
            responseType: NbOAuth2ResponseType.TOKEN,
            scope: 'profile email openid',
            redirectUri: 'http://localhost:4200/auth2/google/callback',
          },
      }),
      NbFacebookOAuth2Strategy.setup({
        name: 'facebook',
          clientId: '3386756934756809',
          clientSecret: '',
          authorize: {
            endpoint: 'https://www.facebook.com/v3.2/dialog/oauth',
            responseType: NbOAuth2ResponseType.TOKEN,
            scope: 'email,public_profile',
            redirectUri: 'http://localhost:4200/auth2/facebook/callback',
          },
      }),
      // NbGithubOAuth2Strategy.setup({
      //   name: 'github',
      //     clientId: '7a6c3e207e244543edee',
      //     clientSecret: '',
      //     authorize: {
      //       endpoint: 'https://github.com/login/oauth/authorize',
      //       responseType: NbOAuth2ResponseType.CODE,
      //       scope: 'read:user',
      //       state: 'abcxyz',
      //       redirectUri: 'http://localhost:4200/auth2/github/callback',
      //     },
      //     token:{
      //       class: NbAuthJWTToken,
      //       endpoint: 'https://github.com/login/oauth/access_token',
      //     }
      // }),
    ],
    forms: {
      login: {
        socialLinks: socialLinks,
      },
      register: {
        socialLinks: socialLinks,
      },
    },
  }).providers,
  NbGoogleOAuth2Strategy,
  NbFacebookOAuth2Strategy,
  // NbGithubOAuth2Strategy,
  NbSecurityModule.forRoot({
    accessControl: {
      guest: {
        view: '*',
      },
      user: {
        parent: 'guest',
        create: '*',
        edit: '*',
        remove: '*',
      },
    },
  }).providers,

  {
    provide: NbRoleProvider, useClass: NbSimpleRoleProvider,
  },
  AnalyticsService,
  LayoutService,
  PlayerService,
  SeoService,
  StateService,
];

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    NbAuthModule,
  ],
  declarations: [],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        ...NB_CORE_PROVIDERS,
      ],
    };
  }
}
