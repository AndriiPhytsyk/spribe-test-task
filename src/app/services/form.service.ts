import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {IUser} from "../models/user.model";
import {Observable} from "rxjs";
import {IResponse} from "../models/response.model";

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(private http: HttpClient) { }

  submitForm(users: IUser[]): Observable<IResponse> {
    return this.http.post<IResponse>('/api/submitForm', users);
  }

  checkUsernameAvailability(username: string): Observable<{isAvailable: boolean}> {
    return this.http.post<{isAvailable: boolean}>('/api/checkUsername', {username})
  }
}
