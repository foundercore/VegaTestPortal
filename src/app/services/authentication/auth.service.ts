
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { BaseService } from '../base.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService extends BaseService {

    constructor(private http: HttpClient) {
        super();
    }

    loggedIn() {
        // TODO - add user validation
        return true;
    }
}
