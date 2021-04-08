import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class BaseService {
  public BASE_SERVICE_URL = '';

  constructor() {
  }

  getLocalDateTimeFromDateObject(ServerDate: Date) {
    var obj = null;
    if (ServerDate != null && ServerDate != undefined) {
      try {
        obj = new Date(this.convertDatedStringDate(ServerDate) + ' UTC');
      }
      catch (e) {
        console.log(e);
      }
    }
    return obj;
  }

  convertDatedStringDate(selectedDate: Date) {

    try {
      var date = selectedDate.getDate();
      var month = selectedDate.getMonth() + 1;
      var year = selectedDate.getFullYear();

      var hours = selectedDate.getHours();
      var minuts = selectedDate.getMinutes();
      var seconds = selectedDate.getSeconds();

      return year.toString() + '-'
       + month.toString() + '-'
       + date.toString() + ' '
       + hours.toString() + ':'
       + minuts.toString() + ':'
       + seconds.toString();
    }
    catch (e) {
      var dateNew = new Date(selectedDate);
      var datedd = dateNew.getDate();
      var monthmm = dateNew.getMonth() + 1;
      var yearyy = dateNew.getFullYear();

      var hourshh = dateNew.getHours();
      var minutsmm = dateNew.getMinutes();
      var secondsss = dateNew.getSeconds();

      return yearyy.toString() + '-' + monthmm.toString() + '-' + datedd.toString() + ' ' + hourshh.toString() + ':' + minutsmm.toString() + ':' + secondsss.toString();


    }


  }

}
