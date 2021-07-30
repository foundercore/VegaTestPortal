import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
 import { GroupVerticalBarChartComponent } from './charts/group-vertical-bar-chart/group-vertical-bar-chart.component';
import { SingleLayerGaugeComponent } from './charts/single-layer-gauge/single-layer-gauge.component';
import { VerticalBarChartComponent } from './charts/vertical-bar-chart/vertical-bar-chart.component';
import { CustomDialogConfirmationComponent } from './components/custom-dialog-confirmation/custom-dialog-confirmation.component';
import { DialogConformationComponent } from './components/dialog-conformation/dialog-conformation.component';
import { FilterPipePipe } from './pipe/filterPipe.pipe';
import { MinuteSecondsPipe } from './pipe/MinuteSecondsPipe';
import { PieChartComponent } from './charts/pie-chart/pie-chart.component';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../app.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { StackedVerticalBarChartComponent } from './charts/stacked-vertical-bar-chart/stacked-vertical-bar-chart.component';
import { MathDirective } from './directives/math/math.directive';



@NgModule({
  declarations: [
    PieChartComponent,
    VerticalBarChartComponent,
    GroupVerticalBarChartComponent,
    StackedVerticalBarChartComponent,
    SingleLayerGaugeComponent,
    CustomDialogConfirmationComponent,
    DialogConformationComponent,
    MinuteSecondsPipe,
    FilterPipePipe,
    MathDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxChartsModule,
    ReactiveFormsModule,
    AngularEditorModule,

  ],
  exports: [
    //Export Shared Component
    PieChartComponent,
    VerticalBarChartComponent,
    GroupVerticalBarChartComponent,
    StackedVerticalBarChartComponent,
    SingleLayerGaugeComponent,
    CustomDialogConfirmationComponent,
    DialogConformationComponent,
    MinuteSecondsPipe,
    FilterPipePipe,
    MathDirective,
    //Export module
    FormsModule,
    ReactiveFormsModule,
    AngularEditorModule,
  ],
})
export class SharedModule { }
