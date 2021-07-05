import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentReportComponent } from './student-report/student-report.component';
import { ReportsComponent } from './reports.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { VegaMaterialModule } from 'src/app/core/material.module';



@NgModule({
  declarations: [
    StudentReportComponent,
    ReportsComponent
  ],
  imports: [
    CommonModule,
    VegaMaterialModule,
    SharedModule
  ]
})
export class ReportsModule { }
