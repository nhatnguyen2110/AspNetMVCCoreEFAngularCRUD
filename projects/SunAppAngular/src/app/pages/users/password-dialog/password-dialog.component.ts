import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NbComponentStatus, NbDialogRef, NbToastrService } from '@nebular/theme';
import { HttpServerService } from 'src/app/services/http-server.service';
import { AppCustomValidators } from 'src/app/validators/app-custom.validator';

@Component({
    selector: 'ngx-password-dialog',
    templateUrl: 'password-dialog.component.html',
    styleUrls: ['password-dialog.component.scss'],
})
export class PasswordDialogComponent {

    @Input() title: string;
    userPass: any;
    passwordForm: FormGroup;
    submitted = false;

    constructor(protected ref: NbDialogRef<PasswordDialogComponent>,
        private fb: FormBuilder,
        private httpServer: HttpServerService,
        private toastrService: NbToastrService,
        private customValidator: AppCustomValidators
    ) { }

    ngOnInit(): void {
        this.passwordForm = this.fb.group({
            currentPassword: ['', [Validators.required]],
            newPassword: ['', [Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*\\d)(?=.*[$@$!%*#?&])[A-Za-z\\d$@$!%*#?&]{6,20}$')]],
            retypePassword: ['', Validators.required],
        },
            {
                validator: this.customValidator.MatchPassword('newPassword', 'retypePassword'),
            }
        );

    }
    // convenience getter for easy access to form fields
    get f() { return this.passwordForm.controls; }
    onSubmit() {
        // stop here if form is invalid
        if (this.passwordForm.invalid) {
            return;
        }
        this.submitted = true;

        // display form values on success
        //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.userForm.value, null, 4));

        //1. save
        this.userPass.currentPassword = this.f.currentPassword.value;
        this.userPass.newPassword = this.f.newPassword.value;
        //2. send to http
        this.httpServer.postHttpRequest("api/user/changepassword/save", this.userPass).subscribe(data => {
            this.submitted = false;
            //3. return result
            if (data.isSuccess) {
                this.ref.close({ isSuccess: true, message: data.message });
            }
            else {
                this.showToast("danger", "Error", data.message);
            }
        });
    }
    onReset() {
        this.submitted = false;
        this.passwordForm.reset();
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

