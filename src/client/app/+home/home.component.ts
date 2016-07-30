import { Component, OnInit } from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES } from '@angular/forms';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';

//import { AuthenticationService, User } from '../shared/index';
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

  /**
   * Creates an instance of the PollsComponent with the injected
   * PollService.
   *
   * @param {PollService} pollService - The injected PollService.
   */

  constructor(
    private router: Router,
    private pollService: PollService) { }

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.getPolls();
  }

  showPollDetail(id: string) {
    //console.log('Will send to poll detail with poll of: ', id);
    let link = ['/poll-detail', id];
    this.router.navigate(link);    
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

}
