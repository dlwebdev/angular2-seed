// webpack/js/PollService.js
import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class PollService {
  
  /**
   * Creates a new PollService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
  */  
  constructor(private http: Http) {}

  getPolls(): Observable<string[]> {
    return this.http.get('/api/polls')
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }  

  deletePoll(id:number): Observable<string[]> {
    return this.http.delete('/api/polls/' + id)
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }  

  getPoll(id:string): Observable<string[]> {
    return this.http.get('/api/polls/' + id)
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }   

  postNewPoll(data:Object): Observable<string[]> {
    let headers = new Headers({
      'Content-Type': 'application/json'});

    return this.http.post('/api/polls', JSON.stringify(data), {
      headers: headers
    }).map((res) => res.json().data);
  } 

  /**
    * Handle HTTP error
  */
  private handleError (error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }  
}
