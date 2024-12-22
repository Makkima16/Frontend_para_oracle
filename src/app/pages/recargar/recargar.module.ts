import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecargarRoutingModule } from './recargar-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ManageComponent } from './manage/manage.component';
import { RetirarComponent } from './retirar/retirar.component';


@NgModule({
  declarations: [
    ManageComponent,
    RetirarComponent
  ],
  imports: [
    CommonModule,
    RecargarRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
  ]
})
export class RecargarModule { }
