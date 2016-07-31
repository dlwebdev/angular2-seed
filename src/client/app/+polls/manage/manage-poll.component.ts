import { Component, OnInit, OnDestroy } from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES } from '@angular/forms';
import { Router, ActivatedRoute, ROUTER_DIRECTIVES } from '@angular/router';
import 'd3';
import 'nvd3';

import { nvD3 } from 'ng2-nvd3';
declare let d3: any;

import { PollService } from '../../shared/index';

/**
 * This class represents the lazy loaded PollsComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-polls',
  templateUrl: 'manage-poll.component.html',
  styleUrls: ['manage-poll.component.css'],
  directives: [REACTIVE_FORM_DIRECTIVES, ROUTER_DIRECTIVES, nvD3]
})
export class ManagePollComponent implements OnInit, OnDestroy {
  //errorMessage: string;
  //poll: any;
  //pollId: string;
  sub: any;
  //navigated: any;
  //options: any;
  //data: any;  

  /**
   * Creates an instance of the PollsComponent with the injected
   * PollService.
   *
   * @param {PollService} pollService - The injected PollService.
   */
  constructor(private pollService: PollService, private route: ActivatedRoute, private router: Router) { }

  /**
   * Get the names OnInit
   */
  ngOnInit() {
   console.log('Init');
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }    

  /* 
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

  cancel() {
    //console.log('Cancelling. Send back to polls page.');

    let link = ['/'];
    this.router.navigate(link);     
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

  */

}
