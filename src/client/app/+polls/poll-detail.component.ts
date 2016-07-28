import { Component, OnInit } from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { PollService } from '../shared/index';

/**
 * This class represents the lazy loaded PollsComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-polls',
  templateUrl: 'poll-detail.component.html',
  styleUrls: ['poll-detail.component.css'],
  directives: [REACTIVE_FORM_DIRECTIVES]
})
export class PollDetailComponent implements OnInit {

  newName: string = '';
  errorMessage: string;
  sub: any;
  navigated = false; // true if navigated here
  poll: any;
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
  constructor(private pollService: PollService, private route: ActivatedRoute) { }

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      if (params['id'] !== undefined) {
        let id = params['id'];
        console.log('ID Detected: ', id);

        this.navigated = true;
        this.getPollData(id);
      } else {
        console.log('No id detected.');

        this.navigated = false;
        this.poll = {
          name: '',
          creatorId: '',
          options: [
            {text: 'Option 1', val: 0},
            {text: 'Option 2', val: 0}
          ],
          dateAdded: ''
        };
      }
    });
    
  }

  createPoll() {
    console.log('Poll Data: ', this.pollData);

    this.pollService.postNewPoll(this.pollData)
      .subscribe(
        //polls => this.polls.push(polls),
        error =>  this.errorMessage = <any>error
      );
  }

  getPollData(id:any) {
    console.log('Getting poll data for id of: ', id);

    this.pollService.getPoll(id)
      .subscribe(
        poll => this.poll = poll,
        error =>  this.errorMessage = <any>error
      );
  }

}
