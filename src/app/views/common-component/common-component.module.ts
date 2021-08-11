import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { VegaMaterialModule } from "src/app/core/material.module";
import { SharedModule } from "src/app/shared/shared.module";
import { ReportsComponent } from "../reports/reports.component";
import { SolutionFilterComponent } from "./solution-filter/solution-filter.component";
import { SolutionFilterPipe } from "./solution-filter/solution-filter.pipe";
import { SolutionRightPanelComponent } from "./solution-right-panel/solution-right-panel.component";
import { StudentAssignmentStatsChartsComponent } from "./student-assignment-stats-charts/student-assignment-stats-charts.component";
import { StudentReportComponent } from "./view-student-assignment-result/student-report.component";

@NgModule({
  declarations: [
    StudentReportComponent,
    StudentAssignmentStatsChartsComponent,
    SolutionRightPanelComponent,
    SolutionFilterComponent,
    SolutionFilterPipe,
  ],
  imports: [
    CommonModule,
    VegaMaterialModule,
    SharedModule,
  ],
})
export class CommonComponentModule { }
