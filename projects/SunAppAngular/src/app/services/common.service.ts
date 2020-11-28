import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserInfo } from '../models/UserInfo';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public userInfo: UserInfo;
  public userInfo$ = new BehaviorSubject<UserInfo>(null);
  constructor() { }

  public setUserInfo(user: UserInfo) {
    this.userInfo = user;
    this.userInfo$.next(user);
  }
}
