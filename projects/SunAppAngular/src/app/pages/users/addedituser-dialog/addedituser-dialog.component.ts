import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { HttpServerService } from 'src/app/services/http-server.service';
import { AppAsyncValidators } from 'src/app/validators/app-async.validator';

@Component({
  selector: 'ngx-addedituser-dialog',
  templateUrl: 'addedituser-dialog.component.html',
  styleUrls: ['addedituser-dialog.component.scss'],
})
export class AddEditUserDialogComponent {

  @Input() title: string;
  user: any;
  userForm: FormGroup;
  submitted = false;
 
  constructor(protected ref: NbDialogRef<AddEditUserDialogComponent>,
    private fb: FormBuilder,
    private httpServer: HttpServerService
  ) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      fullName: [this.user.fullName, Validators.required],
      userName: [this.user.userName, Validators.required, AppAsyncValidators.checkExistedUserName(this.httpServer, this)],
      email: [this.user.email, [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*\\d)(?=.*[$@$!%*#?&])[A-Za-z\\d$@$!%*#?&]{6,20}$')]],
      passwordFormatId: [this.user.passwordFormatId.toString(), Validators.required],
      active: [this.user.active, Validators.required],
      isSystemAccount: [this.user.isSystemAccount, Validators.required],

    });
    if(this.user.id > 0){
      this.userForm.removeControl('password');
      this.userForm.removeControl('passwordFormatId');
    }
  }
  // convenience getter for easy access to form fields
  get f() { return this.userForm.controls; }
  onSubmit() {
    // stop here if form is invalid
    if (this.userForm.invalid) {
      return;
    }
    this.submitted = true;

    // display form values on success
    //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.userForm.value, null, 4));
    
    //1. save user
    this.user.fullName = this.f.fullName.value;
    this.user.userName = this.f.userName.value;
    this.user.email = this.f.email.value;
    this.user.active = this.f.active.value;
    this.user.isSystemAccount = this.f.isSystemAccount.value;
    if(this.user.id===0){
      this.user.password = this.f.password.value;
      this.user.passwordFormatId = +this.f.passwordFormatId.value;
    }
    
    //2. send to http
    this.httpServer.postHttpRequest("api/user/save",this.user).subscribe(data=>
      {
        this.submitted = false;
        //3. return result
        if(this.user.id > 0) //edit
        {
          this.ref.close({isSuccess: true, message: "Edit User successfuly", user: data});
        }
        else //new
        {
          this.ref.close({isSuccess: true, message: "Add New User successfuly", user: data});
        }
      });
  }
  onReset() {
    this.submitted = false;
    this.userForm.reset();
  }
  dismiss() {
    this.ref.close();
  }
}
