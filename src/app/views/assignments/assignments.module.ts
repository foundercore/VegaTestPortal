import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignmentsRoutingModule } from './assignments-routing.module';
import { TestsComponent } from './tests/tests.component';
import { ListTestsComponent } from './list-tests/list-tests.component';
import { UpdateTestContentComponent } from './update-test-content/update-test-content.component';
import { SetupTestConfigurationComponent } from './setup-test-configuration/setup-test-configuration.component';
import { AssessmentEditorComponent } from './popups/assessment-editor/assessment-editor.component';
import { SectionComponent } from './popups/section/section.component';
import { VegaMaterialModule } from 'src/app/core/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TestPreviewComponent } from './test-preview/test-preview.component';

@NgModule({
  declarations: [
    TestsComponent,
    ListTestsComponent,
    UpdateTestContentComponent,
    SetupTestConfigurationComponent,
    AssessmentEditorComponent,
    SectionComponent,
    TestPreviewComponent
  ],
  imports: [
    CommonModule,
    AssignmentsRoutingModule,
    VegaMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule

  ],
  entryComponents : [
    AssessmentEditorComponent,
    SectionComponent
  ]
})
export class AssignmentsModule { }
