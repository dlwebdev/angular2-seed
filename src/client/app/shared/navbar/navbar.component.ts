import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { AuthenticationService } from '../index';

/**
 * This class represents the navigation bar component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.css'],
  directives: [ROUTER_DIRECTIVES]
})
export class NavbarComponent implements OnInit {
  user: any = '';
  loggedIn = false;
  errorMessage: string;

  constructor(private authenticationService: AuthenticationService) { }	

  ngOnInit() {
    this.getUserId(); 
  }

  getUserId() {
	this.authenticationService.getUserId()
	  .subscribe(
	    resp => {
	      this.user = resp;
          if(this.user.userId !== '-1') {
            this.loggedIn = true;
          }	      
	    },
	    error =>  this.errorMessage = <any>error
	  );
  }	
}
