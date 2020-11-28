import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbComponentStatus, NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { HttpServerService } from 'src/app/services/http-server.service';
import { AddEditUserDialogComponent } from '../addedituser-dialog/addedituser-dialog.component';
import { ChangeAvatarDialogComponent } from '../changeavatar-dialog/changeavatar-dialog.component';
import { PasswordDialogComponent } from '../password-dialog/password-dialog.component';

@Component({
  selector: 'ngx-user-detail',
  templateUrl: 'user-detail.component.html',
  styleUrls: ['user-detail.component.scss'],
})
export class UserDetailComponent {
  user: any;
  public id: number;
  constructor(
    private serverHttp: HttpServerService,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }
  ngOnInit(): void {
    this.id = +this.route.snapshot.paramMap.get('id');
    if (this.id > 0) {
      this.loadData(this.id);
    }
  }
  private loadData(id) {
    this.serverHttp.getHttpRequest("api/user/detail/" + id, null).subscribe(data => {
      this.user = data;
    });
  }
  onEdit() {
    this.dialogService.open(AddEditUserDialogComponent,
      {
        hasScroll: true,
        context: {
          title: 'Edit User',
          user: this.user
        },
      })
      .onClose.subscribe(res => {
        if (res) {
          if (res.isSuccess)
            this.showToast("success", "Success", res.message);
          else
            this.showToast("danger", "Error", res.message);
        }
      });
  }
  onChangePassword() {
    this.serverHttp.getHttpRequest("api/user/changepassword/new/" + this.user.id, null).subscribe(data => {
      this.dialogService.open(PasswordDialogComponent,
        {
          hasScroll: true,
          context: {
            userPass: data
          },
        })
        .onClose.subscribe(res => {
          if (res) {
            if (res.isSuccess)
              this.showToast("success", "Success", res.message);
            else
              this.showToast("danger", "Error", res.message);
          }
        });
    });
  }
  onChangeAvatar() {
    this.dialogService.open(ChangeAvatarDialogComponent,
      {
        hasScroll: true,
        context: {
          userId: this.user.id
        },
      })
      .onClose.subscribe(res => {
        if (res) {
          if (res.isSuccess){
            this.user.pictureId = res.pictureId;
            this.user.imageUrl = res.imageUrl;
            this.showToast("success", "Success", res.message);
          }
          else
            this.showToast("danger", "Error", res.message);
        }
      });
  }
  private showToast(type: NbComponentStatus, title: string, body: string) {
    const config = {
      status: type,
    };
    this.toastrService.show(
      body,
      title,
      config);
  }
}