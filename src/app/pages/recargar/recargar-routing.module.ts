import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageComponent } from './manage/manage.component';
import { RetirarComponent } from './retirar/retirar.component';

const routes: Routes = [
    { path: 'create', component: ManageComponent },
    { path: 'retirar', component: RetirarComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecargarRoutingModule { }
