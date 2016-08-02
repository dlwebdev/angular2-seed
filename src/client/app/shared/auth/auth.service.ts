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
   * Creates a new PollService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
  */  
  constructor(private _router: Router, private http: Http) { }

  logout() {
    localStorage.removeItem('user'); 
    this._router.navigate(['Login']);
  } 
  
  login(user: User) {    
    console.log('User passed to login: ', user);
    console.log('Users: ', this.users);
    /*
    var authenticatedUser = this.users.find(u => u.email === user.email);
    
    console.log('Authenticated User: ', authenticatedUser);

    if (authenticatedUser && authenticatedUser.password === user.password) {
      localStorage.setItem('user', JSON.stringify(authenticatedUser));
      this._router.navigate(['polls']);      
      return true;
    }

    return false;
    */
  }   

  doCheck(resp:any) {
    //console.log('Authenticated: ', resp.authenticated);

    if(!resp.authenticated) {
      // Allow to proceed
      this._router.navigate(['Login']);
    }
  }

  checkCredentials() {
    this.http.get('/user/authenticated')
      .subscribe( resp => this.doCheck(resp.json()));
  }

  checkAuthenticated(): Observable<string[]> {
    return this.http.get('/user/authenticated')
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }  

  private handleError (error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }   

}
