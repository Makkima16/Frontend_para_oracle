import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartidosRoutingModule } from './partidos-routing.module';
import { ManageComponent } from './manage/manage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EquiposRoutingModule } from '../equipos/equipos-routing.module';
import { ListComponent } from './list/list.component';


@NgModule({
  declarations: [
    ManageComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    PartidosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
  ]
})
export class PartidosModule { }
