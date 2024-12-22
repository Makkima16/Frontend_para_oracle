import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  { path: 'admin-listClients',
    canActivate:[AuthGuard],
    component: ListComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule { }