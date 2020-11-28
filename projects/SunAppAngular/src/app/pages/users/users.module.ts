
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { routing } from './users.routing';
import { UsersComponent } from './users.component';
import { NbActionsModule, NbButtonModule, NbCardModule, NbCheckboxModule, NbDatepickerModule, NbDialogModule, NbIconModule, NbInputModule, NbPopoverModule, NbRadioModule, NbSelectModule, NbTabsetModule, NbTooltipModule, NbUserModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { AddEditUserDialogComponent } from './addedituser-dialog/addedituser-dialog.component';
import { FormsRoutingModule } from '../forms/forms-routing.module';
import { FormsModule as ngFormsModule } from '@angular/forms';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { PasswordDialogComponent } from './password-dialog/password-dialog.component';
import { ChangeAvatarDialogComponent } from './changeavatar-dialog/changeavatar-dialog.component';

const COMPONENTS = [
  UsersComponent,
  AddEditUserDialogComponent,
  UserDetailComponent,
  PasswordDialogComponent,
  ChangeAvatarDialogComponent
];
const ENTRY_COMPONENTS = [
  
];
const MODULES = [
  CommonModule,
  FormsModule,
  routing,
  Ng2SmartTableModule,
  NbDialogModule.forChild(),
  NbCheckboxModule,
  NbTabsetModule,
  NbPopoverModule,
  NbButtonModule,
  NbInputModule,
  NbSelectModule,
  NbTooltipModule,
  NbRadioModule,
  NbDatepickerModule,
  NbIconModule,
  NbCardModule,

  ThemeModule,
  ngFormsModule,
  ReactiveFormsModule,
];
const SERVICES = [
];
@NgModule({
  imports: [
    ...MODULES,
  ],
  declarations: [
    ...COMPONENTS,
  ],
  providers: [
    ...SERVICES,
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS,
  ],
})
export class UsersModule { }