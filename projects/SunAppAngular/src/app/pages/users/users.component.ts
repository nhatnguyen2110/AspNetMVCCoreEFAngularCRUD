import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NullTemplateVisitor } from '@angular/compiler';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbComponentStatus, NbDialogService, NbToastrService } from '@nebular/theme';

import { HttpServerService } from 'src/app/services/http-server.service';
import { AddEditUserDialogComponent } from './addedituser-dialog/addedituser-dialog.component';
import { CustomServerDataSource } from './customServerDataSource';

@Component({
  selector: 'users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  settings = {
    mode: 'external',
    add: {
      addButtonContent: '<i class="nb-plus"></i>'
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>'
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>'
    },
    columns: {
      imageUrl: {
        title: 'Avatar',
        type: 'html',
        filter: false,
        sort: false,
        valuePrepareFunction: (imageUrl: string) => { return `<img src="${imageUrl}" alt="" />`; }
      },
      userName: {
        title: 'User Name',
      },
      fullName: {
        title: 'Full Name',
      },
      email: {
        title: 'Email',
      },
      active: {
        title: 'Active',
        type: 'html',
        valuePrepareFunction: (active: boolean) => {
          if (active)
            return `<span class="lead text-success"><i class="fa fa-check"></i></span>`;
          else
            return `<span class="lead text-danger"><i class="fa fa-times"></i></span>`;

        },
        filter: {
          type: 'checkbox',
          config: {
            true: 'true',
            false: 'false',
            resetText: 'clear',
          }
        }
      },
      isSystemAccount: {
        title: 'Admin?',
        type: 'html',
        valuePrepareFunction: (active: boolean) => {
          if (active)
            return `<span class="lead text-success"><i class="fa fa-check"></i></span>`;
          else
            return `<span class="lead text-danger"><i class="fa fa-times"></i></span>`;

        },
        filter: {
          type: 'checkbox',
          config: {
            true: 'true',
            false: 'false',
            resetText: 'clear',
          }
        }
      },
    },
  };

  //source: ServerDataSource;
  source: CustomServerDataSource;
  constructor(
    private http: HttpClient,
    private serverHttp: HttpServerService,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    //this.source = new CustomServerDataSource(http);

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Authorization', `Bearer xxxTokenxxx`);
    this.source = new CustomServerDataSource(http, headers, {
      endPoint: this.serverHttp.REST_API_SERVER + "/api/user/getlist?",
      totalKey: 'recordsTotal',
      dataKey: 'data',
    });
  }

  onCreate(event) {
    this.serverHttp.getHttpRequest("api/user/new", null).subscribe(data => {
      this.dialogService.open(AddEditUserDialogComponent,
        {
          hasScroll: true,
          context: {
            title: 'Add New User',
            user: data
          },
        })
        .onClose.subscribe(res => {
          if (res) {
            this.source.append(res.user);
            if (res.isSuccess)
              this.showToast("success", "Success", res.message);
            else
              this.showToast("danger", "Error", res.message);
          }
        });
    });

  }
  onEdit(event) {
    this.router.navigate(['../user-detail', event.data.id], { relativeTo: this.route });
  }
  onDelete(event) {
    if (event.data.isSystemAccount) {
      this.showToast("warning", "Warning", "Cannot delete admin account");
    }
    else if (window.confirm('Are you sure you want to delete?')) {
      this.serverHttp.postHttpRequest("api/user/delete/" + event.data.id, null).subscribe(data => {
        this.source.remove(event.data);
        this.showToast("success", "Success", "Delete successfully");
      });
    }

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
