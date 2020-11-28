
import { Routes, RouterModule } from '@angular/router';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UsersComponent } from './users.component';


const routes: Routes = [
  {
    path:'user-detail/:id', 
    component: UserDetailComponent
  },
  {
    path: '',
    component: UsersComponent,
    children: [
      
    ]
  },
  
];

export const routing = RouterModule.forChild(routes);