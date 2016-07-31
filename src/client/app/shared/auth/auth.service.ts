// webpack/js/PollService.js
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
//import { Http, Response, Headers } from '@angular/http';
//import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

export class User {
  constructor(
    public email: string,
    public password: string) { }
}
 
var users = [
  new User('admin@admin.com','adm9'),
  new User('user1@gmail.com','a23')
];

@Injectable()
export class AuthenticationService {
  
  /**
   * Creates a new PollService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
  */  
  constructor(private _router: Router) { }

  logout() {
    localStorage.removeItem('user'); 
    this._router.navigate(['Login']);
  } 
  
  login(user: User) {    
    console.log('User passed to login: ', user);

    var authenticatedUser = users.find(u => u.email === user.email);
    
    console.log('Authenticated User: ', authenticatedUser);

    if (authenticatedUser && authenticatedUser.password === user.password) {
      localStorage.setItem('user', JSON.stringify(authenticatedUser));
      this._router.navigate(['polls']);      
      return true;
    }

    return false;
  }   

  checkCredentials() {
    if (localStorage.getItem('user') === null) {
        this._router.navigate(['login']);
    }
  }

}
