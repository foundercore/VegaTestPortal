import { CommonModule } from "@angular/common";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { CountdownModule } from "ngx-countdown";
import { NgScrollbarModule } from 'ngx-scrollbar';
import { VegaMaterialModule } from "src/app/core/material.module";
import { SharedModule } from "src/app/shared/shared.module";
import { AssignmentsRoutingModule } from "../assignments/assignments-routing.module";
import { LiveTestInstructionComponent } from "./live-test-instruction/live-test-instruction.component";
import { LiveTestWindowComponent } from "./live-test-window/live-test-window.component";
import { LiveTestComponent } from "./live-test/live-test.component";

@NgModule({
  declarations: [
    LiveTestInstructionComponent,
    LiveTestComponent,
    LiveTestWindowComponent
  ],
  imports: [
    CommonModule,
    AssignmentsRoutingModule,
    VegaMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CountdownModule,
    AngularEditorModule,
    NgScrollbarModule,
    SharedModule
  ],
  schemas:[NO_ERRORS_SCHEMA]

 })
export class TestManagementModule { }
