import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentReportComponent } from './student-report/student-report.component';
import { ReportsComponent } from './reports.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { VegaMaterialModule } from 'src/app/core/material.module';
import { StudentAssignmentStatsChartsComponent } from './student-assignment-stats-charts/student-assignment-stats-charts.component';
import { SolutionRightPanelComponent } from './solution-right-panel/solution-right-panel.component';
import { FilterComponent } from './filter/filter.component';

@NgModule({
  declarations: [
    StudentReportComponent,
    ReportsComponent,
    StudentAssignmentStatsChartsComponent,
    SolutionRightPanelComponent,
    FilterComponent,
  ],
  imports: [CommonModule, VegaMaterialModule, SharedModule],
})
export class ReportsModule {}
