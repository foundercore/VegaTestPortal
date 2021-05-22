import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { QuestionModel } from 'src/app/models/questions/question-model';
import { questionsVM } from '../../models/questionsVM';
import { SearchQuestionPaperVM } from '../../models/searchQuestionVM';
import { TestConfigService } from '../../services/test-config-service';
import { AssessmentEditorComponent } from '../assessment-editor/assessment-editor.component';

@Component({
  selector: 'app-questions-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.css']
 
})
export class QuestionslistComponent implements OnInit {
  panelOpenState: boolean = false;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  //dataSource: any;
  questions: QuestionModel[];
  questions2: QuestionModel[];
  quesmodel = [];
  displayedColumns: string[] = ['select', 'quesName', 'negativeMark', 'positiveMark', 'skipMark'];
  dataSource = new MatTableDataSource<QuestionModel>();
  selection = new SelectionModel<QuestionModel>(true, []);
  //selection = new SelectionModel<QuestionModel>(true, []);

  constructor(@Inject(MAT_DIALOG_DATA) public _data: any, public dialogRef: MatDialogRef<QuestionslistComponent>,
    public dialog: MatDialog, private testConfigService: TestConfigService, private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.getQuestions();
    //this.questions.push({"testId" : "fc94065f-b544-4fa0-adfa-dd159da4fd87","testName" : "hello Test","minimumDurationInMinutes" : 45, "totalDurationInMinutes": 50});

  }


  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
    console.log("this.dataSource.data", this.dataSource.data);
  }


  // add section dialog ts here
  addSection() {
    const dialogRef = this.dialog.open(AssessmentEditorComponent, {
      maxWidth: '500px',
      width: '100%',
      height: 'auto'
    });
  }

  checkList(event : MatCheckboxChange,row){
    debugger;
    let isChecked = event.checked;
    if(!isChecked){
     // if(this.selection?.selected?.length > 0){
        let index = this.selection?.selected.findIndex(x=> x.passageId == row.passageId);
        if (index != -1) {
          this.selection?.selected.splice(index, 1);
        }
      //}
    }
  }





  getQuestions() {
    let model = new SearchQuestionPaperVM()
    this.testConfigService
      .getQuestionList(model)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(
        (res: any) => {
          if (res?.questions.length > 0) {
            this.questions = res?.questions;
            this.questions2 = res?.questions;
            this.dataSource = new MatTableDataSource(this.questions);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            console.log("this.queslist==", res);
          }
        },
        (error) => {
          this.toastrService.error(error?.error?.message ? error?.error?.message : error?.message, 'Error');
        }
      )
  }


  saveQuestions() {
    debugger;
    this.quesmodel=[];
    // let model = new Section();
    // model.durationInMinutes = this._data.section.durationInMinutes;
    // model.name = this._data.section.name;
    if (this.selection?.selected?.length == 0) {
      this.toastrService.error("Please select atleast 1 question");
      return;
    }
    else {
      if (this.selection != null && this._data.testId != null && this._data.section != null) {
        this.selection?.selected?.forEach(element => {
          let model = new questionsVM();
          model.id = element?.id?.questionId;
          model.negativeMark = element.negativeMark;
          model.positiveMark = element.positiveMark;
          model.skipMark = element.skipMark;
          this.quesmodel.push(model);
        });
        //model.questions = this.quesmodel;
        this.testConfigService
          .updateQuestionPaperSectionMeta(this.quesmodel,this._data.section.id,this._data.testId)
          .subscribe((res: any) => {
            console.log("this.resss==", res);
            this.toastrService.success("Question updated successfully");
            this.close();
          },
          (error) => {
            if(error.status == 400){
              this.toastrService.error("Please check selected question it's already exists");
            }
            else{
              this.toastrService.error(error?.error?.message ? error?.error?.message : error?.message, 'Error');
            }
          }
          )
      }
    }
  }

  searchText : string = "";
  searchtest(){
    if(this.searchText != "" && this.searchText != null && this.searchText != undefined){
      this.questions = this.questions.filter((x)=> x.name.includes(this.searchText));
      this.dataSource = new MatTableDataSource(this.questions);
      this.dataSource.sort = this.sort;   
      this.dataSource.paginator = this.paginator;
    }
    else{
        this.questions = this.questions2;
        this.dataSource = new MatTableDataSource(this.questions);
        this.dataSource.sort = this.sort;   
        this.dataSource.paginator = this.paginator;
    }
  }








  close() {
    this.dialogRef.close();
  }




}

