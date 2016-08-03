import { Component, OnInit, OnDestroy } from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES } from '@angular/forms';
import { Router, ActivatedRoute, ROUTER_DIRECTIVES } from '@angular/router';
import 'd3';
import 'nvd3';

import { nvD3 } from 'ng2-nvd3';
declare let d3: any;

import { AuthenticationService } from '../shared/index';
import { PollService } from '../shared/index';

/**
 * This class represents the lazy loaded PollsComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-polls',
  templateUrl: 'poll-detail.component.html',
  styleUrls: ['poll-detail.component.css'],
  directives: [REACTIVE_FORM_DIRECTIVES, ROUTER_DIRECTIVES, nvD3]
})
export class PollDetailComponent implements OnInit, OnDestroy {

  newName: string = '';
  showVotingContainer: boolean = true;
  errorMessage: string;
  sub: any;
  navigated = false; // true if navigated here
  poll: any;
  pollId: string;
  user: any = '';
  options: any;
  data: any;
  data2: any;  
  currentVote: any;
  addingPollOption: boolean = false;
  voted: boolean = false;
  new_option: string = '';
  twitter_text: string = 'https://twitter.com/intent/tweet?text=';

  /**
   * Creates an instance of the PollsComponent with the injected
   * PollService.
   *
   * @param {PollService} pollService - The injected PollService.
   */
  constructor(
    private pollService: PollService, 
    private authenticationService: AuthenticationService, 
    private route: ActivatedRoute, 
    private router: Router
  ) { }

  /**
   * Get the names OnInit
   */
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

    this.getUserId(); 
 
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }  

  getUserId() {
    this.authenticationService.getUserId()
      .subscribe(
        resp => {
          this.user = resp;
        },
        error =>  this.errorMessage = <any>error
      );
  }  

  setChart() {
    this.options = {
      chart: {
        type: 'discreteBarChart',
        height: 450,
        margin : {
          top: 20,
          right: 20,
          bottom: 50,
          left: 55
        },
        x: function(d:any){return d.text;},
        y: function(d:any){return d.val;},
        showValues: true,
        valueFormat: function(d:any){
          return d3.format(',.0f')(d);
        },
        duration: 500,
        xAxis: {
          axisLabel: ''
        },
        yAxis: {
          axisLabel: 'Votes',
          axisLabelDistance: -10
        }
      }
    };

    this.data = [
      {
        key: 'Vote Total',
        values: this.poll.options
      }
    ];

  }

  addPollOption() {
    this.addingPollOption = true;
    this.showVotingContainer = false;
  }

  saveOptionandCastVote() {
    this.poll.options.push({'text': this.new_option, 'val': 1});

    this.savePoll();
    this.setChart(); 
    this.addingPollOption = false;
    this.showVotingContainer = false;    
  }

  cancelNewOption() {
    this.addingPollOption = false;
    this.showVotingContainer = true;    
  }

  castVote() {
    this.showVotingContainer = false;
    this.poll.options[this.currentVote].val++;

    this.savePoll();
    this.setChart();
  }

  cancel() {
    //console.log('Cancelling. Send back to polls page.');

    let link = ['/'];
    this.router.navigate(link);     
  }  

  setCurrentVote(i:any) {
    //console.log('Increment count for option at index: ', i);
    this.currentVote = i;
  }

  savePoll() {
    // Vote on an option in this poll. Update the poll to persist vote

    //console.log('Incrementing Vote for poll id of: ', this.pollId);

    this.pollService.updatePoll(this.pollId, this.poll)
      .subscribe(
        poll => {
          //this.poll = poll;
          //console.log('Poll returned: ', poll);
        },
        error =>  this.errorMessage = <any>error
      );   

    this.voted = true; 
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
