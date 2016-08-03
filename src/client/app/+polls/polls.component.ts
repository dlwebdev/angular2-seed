import { Component, OnInit } from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES } from '@angular/forms';
import { Router } from '@angular/router';

import { PollService } from '../shared/index';
import { AuthenticationService } from '../shared/index';

/**
 * This class represents the lazy loaded PollsComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-polls',
  templateUrl: 'polls.component.html',
  styleUrls: ['polls.component.css'],
  directives: [REACTIVE_FORM_DIRECTIVES]
})
export class PollsComponent implements OnInit {

  newName: string = '';
  errorMessage: string = '';
  user: any = '';

  polls: any[] = [];

  pollData = {
    name: '',
    creatorId: '',
    options: [
      {text: 'Option 1', val: 0},
      {text: 'Option 2', val: 0}
    ],
    dateAdded: ''
  };  

  /**
   * Creates an instance of the PollsComponent with the injected
   * PollService.
   *
   * @param {PollService} pollService - The injected PollService.
   */
  constructor(public pollService: PollService, private authenticationService: AuthenticationService, private router: Router) {
    this.resetPollData();
  }

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    // Check credentials. Will send to login screen if they are not logged in.
    this.authenticationService.checkCredentials();
    this.getUserId();    
  }

  getUserId() {
    this.authenticationService.getUserId()
      .subscribe(
        resp => {
          this.user = resp;
          this.getUserPolls();
        },
        error =>  this.errorMessage = <any>error
      );
  }  

  addPollOption() {
    this.pollData.options.push({text: '', val: 0});
  }

  deletePoll(id:number) {
    this.pollService.deletePoll(id)
      .subscribe(
        polls => this.polls = polls,
        error =>  this.errorMessage = <any>error
      );
  }

  viewPoll(id:number) {
    let link = ['/manage', id];
    this.router.navigate(link);
  }  

  createPoll() {
    this.pollData.creatorId = this.user.userId;

    this.pollService.postNewPoll(this.pollData)
      .subscribe(
        //polls => this.polls.push(polls),
        error =>  this.errorMessage = <any>error
      );

    this.resetPollData();
    this.getUserPolls();
  }

  resetPollData() {
    this.pollData = {
      name: '',
      creatorId: this.user.userId,
      options: [
        {text: 'Option 1', val: 0},
        {text: 'Option 2', val: 0}
      ],
      dateAdded: ''
    };     
  }

  /**
   * Handle the pollService observable
   */
  getUserPolls() {
    this.pollService.getUserPolls()
      .subscribe(
        polls => this.polls = polls,
        error =>  this.errorMessage = <any>error
      );
  }

  logout() {
      this.authenticationService.logout();
  }  

}
