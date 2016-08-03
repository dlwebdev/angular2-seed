import { Component, OnInit } from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES } from '@angular/forms';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';

import { AuthenticationService } from '../shared/index';
import { PollService } from '../shared/index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
  directives: [REACTIVE_FORM_DIRECTIVES, ROUTER_DIRECTIVES]
})
export class HomeComponent implements OnInit {
  errorMessage: string;
  polls: any[] = []; 
  user: any = '';

  /**
   * Creates an instance of the HomeComponent with the injected
   * PollService and AuthenticationService.
   *
   * @param {PollService} pollService - The injected PollService.
   * @param {AuthenticationService} authenticationService - The injected AuthenticationService.
   */

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService, 
    private pollService: PollService
  ) { }

  /**
   * Get the names OnInit
  */
  ngOnInit() {
    this.getAllPolls();
    this.getUserId(); 
  }

  /**
   * Get the user id of current user to see if they are logged in
  */
  getUserId() {
    this.authenticationService.getUserId()
      .subscribe(
        resp => {
          this.user = resp;
          if(this.user.userId !== '-1') {
            console.log('This user is logged in. Do not show the log in button', this.user.userId);
          }
        },
        error =>  this.errorMessage = <any>error
      );
  }    

  showPollDetail(id: string) {
    //console.log('Will send to poll detail with poll of: ', id);
    let link = ['/poll-detail', id];
    this.router.navigate(link);    
  }

  getAllPolls() {
    this.pollService.getAllPolls()
      .subscribe(
        polls => {
          this.polls = polls;

          for (let poll of this.polls) {            
            let pollTotalVotes = 0;

            for (let option of (poll as any).options) {
              pollTotalVotes += option.val;
            }     

            (poll as any).totalVotes = pollTotalVotes;
          }
        
        },
        error =>  this.errorMessage = <any>error
      );
  } 

}
