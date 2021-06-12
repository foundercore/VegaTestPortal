import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowResultComponent } from './show-result/show-result.component';
import { TestsComponent } from './tests/tests.component';
import { UpdateTestContentComponent } from './update-test-content/update-test-content.component';
import { ViewAssignmentComponent } from './view-assignment/view-assignment.component';


const routes: Routes = [
  {
    path: '',
    component: TestsComponent,
  },
  {
    path: 'update-test/:id',
    component: UpdateTestContentComponent,
  },
  {
    path: 'update-test/:id/view-assignment',
    component: ViewAssignmentComponent,
  },
  {
    path: 'show-result/:id',
    component: ShowResultComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignmentsRoutingModule { }
