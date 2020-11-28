import { AbstractControl, ValidatorFn } from '@angular/forms';
import { AddEditUserDialogComponent } from '../pages/users/addedituser-dialog/addedituser-dialog.component';
import { HttpServerService } from '../services/http-server.service';

/**
 * Class for async validations communicating with the REST-API.
 */
export class AppAsyncValidators {
    public static checkExistedUserName(service: HttpServerService, component: AddEditUserDialogComponent): ValidatorFn {
        return (control: AbstractControl) => {
            return new Promise((resolve) => {
                if (control.value) {
                    service.getHttpRequest(
                        "api/user/checkexistedusername",
                        { username: control.value, skipUserId: component.user.id })
                        .subscribe(data => {
                            if (data) {
                                return resolve({ checkExistedUserName: true });
                            }
                            else {
                                return resolve(null);
                            }
                        });
                }
                else {
                    return resolve(null);
                }
            });
        }
    }
}  