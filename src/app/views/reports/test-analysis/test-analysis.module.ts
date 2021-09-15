import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestAnalysisComponent } from './test-analysis.component';
import { Routes, RouterModule } from '@angular/router';
import { VegaMaterialModule } from 'src/app/core/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonComponentModule } from '../../common-component/common-component.module';
import { TestAnalysisGridComponent } from './test-analysis-grid/test-analysis-grid.component';
import { TestAnalysisQuestionPreviewComponent } from './test-analysis-question-preview/test-analysis-question-preview.component';



const routes: Routes = [
  {
    path: '',
    component: TestAnalysisComponent,
    children:[
      {
        path: 'selected-test/:test_id/:test_name/:assignment_id',
        component: TestAnalysisGridComponent,
        runGuardsAndResolvers: 'always',
      },
    ]
  },
];


@NgModule({
  declarations: [
    TestAnalysisComponent,
    TestAnalysisGridComponent,
    TestAnalysisQuestionPreviewComponent
  ],
  imports: [
    CommonModule,
    VegaMaterialModule,
    SharedModule,
    RouterModule,
    CommonComponentModule,
    RouterModule.forChild(routes),
  ],
  exports:[RouterModule]
})
export class TestAnalysisModule { }
