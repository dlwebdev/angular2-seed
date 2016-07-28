import { Component, OnInit } from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES } from '@angular/forms';

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
  errorMessage: string;

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
  constructor(public pollService: PollService, private authenticationService: AuthenticationService) {
    this.resetPollData();
  }

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.authenticationService.checkCredentials();
    this.getPolls();
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

  createPoll() {
    console.log('Poll Data: ', this.pollData);

    this.pollService.postNewPoll(this.pollData)
      .subscribe(
        //polls => this.polls.push(polls),
        error =>  this.errorMessage = <any>error
      );

    this.resetPollData();
    this.getPolls();
  }

  resetPollData() {
    this.pollData = {
      name: '',
      creatorId: '',
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
  getPolls() {
    this.pollService.getPolls()
      .subscribe(
        polls => this.polls = polls,
        error =>  this.errorMessage = <any>error
      );
  }

  logout() {
      this.authenticationService.logout();
  }  

}
