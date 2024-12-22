import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApuestasRoutingModule } from './apuestas-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageComponent } from './manage/manage.component';


@NgModule({
  declarations: [
    ManageComponent
  ],
  imports: [
    CommonModule,
    ApuestasRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
  ]
})
export class ApuestasModule { }
