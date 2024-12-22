import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { AuthGuard } from '../../guards/auth.guard';

const routes: Routes = [
  {
    path:'list',
    component:ListComponent
  },
  { path: 'admin-create', component: ManageComponent,
    canActivate:[AuthGuard]
   }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EquiposRoutingModule { }
