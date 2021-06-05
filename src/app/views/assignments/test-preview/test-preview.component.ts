import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { CalculatorComponent } from '../popups/calculator/calculator.component';
import { TestConfigService } from '../services/test-config-service';

@Component({
  selector: 'app-test-preview',
  templateUrl: './test-preview.component.html',
  styleUrls: ['./test-preview.component.css']
  
})
export class TestPreviewComponent implements OnInit {
  timeSeconds : number = 30;
  testid : string ="";
  testdata : any;
  sectionsWithPapers =[];
  question : any;
  constructor(public dialog : MatDialog ,  private route: ActivatedRoute,private testConfigService : TestConfigService,public toastrService : ToastrService) { }

  ngOnInit(): void {
    this.testid = this.route.snapshot.paramMap.get('id');
    this.getQuestionPaperbyId();
  }

calculate(){
  const dialogRef = this.dialog.open(CalculatorComponent, {
    maxWidth: '500px',
    width: '100%',
    height: 'auto'
  });
}

getQuestionPaperbyId(){
  this.testConfigService
  .getQuestionPaper(this.testid)
  .pipe(
    finalize(() => {
    })
  )
  .subscribe(
    (res: any) => {
      this.testdata = res;
      this.GetQuestionPapers();
    //  if (res.isSuccess) {
        console.log("this.testdata==",res);
     // }
    },
    (error) => {
      this.toastrService.error(error?.error?.message ? error?.error?.message : error?.message, 'Error');
    }
  )
}


GetQuestionPapers(){
  if(this.testdata?.sections.length > 0){
    var sections = this.testdata?.sections;
    if(sections != null){
      sections.forEach(element => {
        if(element != null &&  element.questions != null){
          element.questions.forEach(element2 => {
            if(element2 != null){
              var checkdata = this.sectionsWithPapers.find((x)=> x.id.questionId == element2.id);
              if(checkdata == null){
                this.testConfigService
                .getQuestionbyQestionId(element2?.id).subscribe(
                  (res: any) => {
                  res.sectionId = element.id;
                  res.iscolorActive = false;
                  res.ismarked = false;
                  this.sections.push(res);
                  this.sections[0].iscolorActive = true;
                  this.selectSection(this.sections[0].sectionId);
                  this.question = this.sections[0];
                  console.log("this.sections==",this.sections);
                  },
                  (error) => {
                    this.toastrService.error(error?.error?.message ? error?.error?.message : error?.message, 'Error');
                  }
                )
              }
            }
          });
        }
      });
    }
   
  }
}

getQuestion(ques : any){
this.question = this.sectionsWithPapers.find((x)=> x.id.questionId == ques.id.questionId && x.sectionId == ques.sectionId);
this.sectionsWithPapers.forEach(element => {
  if(ques.id.questionId == element.id.questionId){
    element.iscolorActive = true;
  }
  else{
    element.iscolorActive = false;
  }
});
}

getactiveRandomColorStatus(value) {
  if (value == true) {
    return value != "" ? "green" : "green";
  }
  else{
    return value != "" ? "grey" : "grey";
  }
  // debugger;
  // if (value == "Not Created") {
  //   return value != "" ? "grey" : "grey";
  // }
  // if (value == "In-Progress") {
  //   return value != "" ? "blue" : "blue";
  // }
  // if (value == "Rejected") {
  //   return value != "" ? "red" : "red";
  // }
  // if (value == true) {
  //   return value != "" ? "green" : "green";
  // }
}

getmarkedRandomColorStatus(value = true) {
  if (value === true) {
    return value ? "blue" : "blue";
  }
  else{
    return value ? "blue" : "blue";
  }
  // debugger;
  // if (value == "Not Created") {
  //   return value != "" ? "grey" : "grey";
  // }
  // if (value == "In-Progress") {
  //   return value != "" ? "blue" : "blue";
  // }
  // if (value == "Rejected") {
  //   return value != "" ? "red" : "red";
  // }
  // if (value == true) {
  //   return value != "" ? "green" : "green";
  // }
}


sections=[];

selectSection(id : string = ""){
  debugger;
  this.sectionsWithPapers = this.sections.filter((x)=>x.sectionId == id);
}





}
