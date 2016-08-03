// webpack/js/PollService.js
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

export class User {
  constructor(
    public email: string,
    public password: string) { }
}

@Injectable()
export class AuthenticationService {
  users: any[] = [];

  /**
   * Creates a new AuthenticationService with the injected Http.
   * @param {Http} _http - The injected Http.
   * @param {Router} _router - The injected _router.
   * @constructor
  */  
  constructor(private _router: Router, private _http: Http) { }

  logout() {
    localStorage.removeItem('user'); 
    this._router.navigate(['Login']);
  }   

  doCheck(resp:any) {
    if(!resp.authenticated) {
      // Allow to proceed
      this._router.navigate(['login']);
    }
  }

  getUserId(): Observable<string[]> {
    return this._http.get('/user/get-id-of-logged-in')
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }   

  checkCredentials() {
    this._http.get('/user/authenticated')
      .subscribe( resp => this.doCheck(resp.json()));
  }

  /**
    * Handle HTTP error
  */
  private handleError (error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }      

}
