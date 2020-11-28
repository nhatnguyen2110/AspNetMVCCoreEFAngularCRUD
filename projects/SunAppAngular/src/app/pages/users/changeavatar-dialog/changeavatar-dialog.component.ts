import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NbComponentStatus, NbDialogRef, NbToastrService } from '@nebular/theme';
import { HttpServerService } from 'src/app/services/http-server.service';
import { FineUploader, UIOptions } from 'fine-uploader';


@Component({
    selector: 'ngx-changeavatar-dialog',
    templateUrl: 'changeavatar-dialog.component.html',
    styleUrls: ['changeavatar-dialog.component.scss'],
})
export class ChangeAvatarDialogComponent {
    userId: number;
    public uploader: any;
    pictureId: number = 0;
    imageUrl: string;

    constructor(protected ref: NbDialogRef<ChangeAvatarDialogComponent>,
        private httpServer: HttpServerService,
        private toastrService: NbToastrService,
    ) {

    }
    ngAfterViewInit() {
        const componentInstance = this;
        this.uploader = new FineUploader({
            element: document.getElementById('fine-uploader-gallery'),
            debug: false,
            autoUpload: true,
            multiple: false,
            template: 'qq-template-gallery',
            request: {
                endpoint: this.httpServer.REST_API_SERVER + "/picture/AsyncUpload"
            },
            deleteFile: {
                enabled: true,
                endpoint: this.httpServer.REST_API_SERVER + "/picture/AsyncDelete"
            },
            validation: {
                allowedExtensions: ['jpeg', 'jpg', 'png', 'gif', 'svg'],
                sizeLimit: 10000000 // 50 kB = 50 * 1024 bytes
            },
            callbacks: {
                onSubmit: function (id, fileName) {

                },
                onComplete: function (id, name, responseJSON, maybeXhr) {
                    //console.log('complete', responseJSON);
                    if (responseJSON.success) {
                        componentInstance.pictureId = responseJSON.pictureId;
                        componentInstance.imageUrl = responseJSON.imageUrl;
                    }
                    else {
                        componentInstance.showToast('danger', 'Error', responseJSON.message);
                    }
                },
                onDeleteComplete: function (id, xhr, isError) {
                    if (!isError) {
                        componentInstance.pictureId = 0;
                        componentInstance.imageUrl = "";
                    }
                },
                onError: function (id, name, reason, maybeXhrOrXdr) {
                    componentInstance.showToast('danger', 'Error', reason);
                }
            }
        });
    }
    onSaveAvatar() {
        if (this.pictureId > 0) {
            this.httpServer.postHttpRequest("api/user/updateavatar", { userid: this.userId, pictureid: this.pictureId }).subscribe(data => {
                //console.log('updated avata', data);
                if (data.isSuccess) {
                    this.ref.close({ isSuccess: true, message: data.message, pictureId: this.pictureId, imageUrl: this.imageUrl });
                }
                else {
                    this.showToast("danger", "Error", data.message);
                }
            });

        }
    }
    dismiss() {
        this.ref.close();
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