import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ROUTER_DIRECTIVES } from '@angular/router';

import 'd3';
import 'nvd3';

import { nvD3 } from 'ng2-nvd3';
declare let d3: any;

import { PollService } from '../shared/index';

/**
 * This class represents the lazy loaded PollsComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-polls',
  templateUrl: 'manage.component.html',
  styleUrls: ['manage.component.css'],
  directives: [ROUTER_DIRECTIVES, nvD3]
})
export class ManagePollComponent implements OnInit, OnDestroy { 

  newName: string = '';
  showVotingContainer: boolean = true;
  errorMessage: string;
  sub: any;
  navigated = false; // true if navigated here
  poll: any;
  pollId: string;

  options: any;
  data: any;
  data2: any;  
  currentVote: any;

  /**
   * Creates an instance of the PollsComponent with the injected
   * PollService.
   *
   * @param {PollService} pollService - The injected PollService.
   */
  constructor(private pollService: PollService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      if (params['id'] !== undefined) {
        let id = params['id'];
        this.pollId = id;
        //console.log('ID Detected: ', id);

        this.navigated = true;
        this.getPollData(id);
      } else {
        //console.log('No id detected.');

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

  ngOnDestroy() {
    this.sub.unsubscribe();
  } 

  getPollData(id:any) {
    //console.log('Getting poll data for id of: ', id);

    this.pollService.getPoll(id)
      .subscribe(
        poll => {
          this.poll = poll;
          //console.log('Poll returned: ', poll);
        },
        error =>  this.errorMessage = <any>error
      );
  }  
}
