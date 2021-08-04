import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowResultComponent } from './show-result/show-result.component';
import { TestsComponent } from './tests/tests.component';
import { UpdateTestContentComponent } from './update-test-content/update-test-content.component';
import { ViewAssignmentComponent } from './view-assignment/view-assignment.component';

const routes: Routes = [
  {
    path: 'view',
    component: TestsComponent,
  },
  {
    path: 'update-test/:id',
    component: UpdateTestContentComponent,
    data: {
      breadcrumb: 'Update Test',
    },
  },
  {
    path: 'update-test/:id/view-assignment',
    component: ViewAssignmentComponent,
    data: {
      breadcrumb: 'View Test',
    },
  },
  {
    path: 'show-result/:id',
    component: ShowResultComponent,
    data: { breadcrumb: 'Show Result' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssignmentsRoutingModule {}
