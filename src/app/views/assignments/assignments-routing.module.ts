import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListTestsComponent } from './list-tests/list-tests.component';
import { SetupTestConfigurationComponent } from './setup-test-configuration/setup-test-configuration.component';
import { TestPreviewComponent } from './test-preview/test-preview.component';
import { TestsComponent } from './tests/tests.component';
import { UpdateTestContentComponent } from './update-test-content/update-test-content.component';

const routes: Routes = [
  {
    path: '',
    component: ListTestsComponent,
  },
  {
    path: 'setupConfig',
    component: SetupTestConfigurationComponent,
  },
  {
    path: 'update-test',
    component: UpdateTestContentComponent,
  },
  {
    path: 'test',
    component: TestsComponent,
  },
  {
    path: 'test-preview',
    component: TestPreviewComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignmentsRoutingModule { }
