import { Component } from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES } from '@angular/forms';

import { AuthenticationService, User } from '../shared/index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
  directives: [REACTIVE_FORM_DIRECTIVES]
})
export class LoginComponent {
  /**
   * Creates an instance of the HomeComponent with the injected
   * NameListService.
   *
   * @param {NameListService} nameListService - The injected NameListService.
  */

  public user = new User('','');
  public errorMsg = '';
  
  constructor(private _service: AuthenticationService) { }

  login() {
      if(!this._service.login(this.user)) {
        this.errorMsg = 'Failed to login';
      }
  }

  twitterLogin() {
      if(!this._service.twitterLogin(this.user)) {
        this.errorMsg = 'Failed to login';
      }
  }  

}
