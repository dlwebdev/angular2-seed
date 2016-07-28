import { Component, provide } from '@angular/core';
import { TestComponentBuilder } from '@angular/compiler/testing';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import {
  async,
  inject
} from '@angular/core/testing';
import {
  BaseRequestOptions,
  ConnectionBackend,
  Http,
  HTTP_PROVIDERS
} from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { getDOM } from '@angular/platform-browser/src/dom/dom_adapter';

import { NameListService } from '../shared/index';
import { PollsComponent } from './polls.component';

export function main() {
  describe('Polls component', () => {
    // Disable old forms
    let providerArr: any[];

    beforeEach(() => { providerArr = [disableDeprecatedForms(), provideForms()]; });

    it('should work',
      async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        tcb.overrideProviders(TestComponent, providerArr)
          .createAsync(TestComponent)
          .then((rootTC: any) => {

            rootTC.detectChanges();

            let pollsInstance = rootTC.debugElement.children[0].componentInstance;
            let pollsDOMEl = rootTC.debugElement.children[0].nativeElement;

            expect(pollsInstance.nameListService).toEqual(jasmine.any(NameListService));
            expect(getDOM().querySelectorAll(pollsDOMEl, 'li').length).toEqual(0);

            pollsInstance.newName = 'Minko';
            pollsInstance.addName();

            rootTC.detectChanges();

            expect(getDOM().querySelectorAll(pollsDOMEl, 'li').length).toEqual(1);
            expect(getDOM().querySelectorAll(pollsDOMEl, 'li')[0].textContent).toEqual('Minko');
          });
      })));
  });
}

@Component({
  providers: [
    HTTP_PROVIDERS,
    NameListService,
    BaseRequestOptions,
    MockBackend,
    provide(Http, {
      useFactory: function(backend: ConnectionBackend, defaultOptions: BaseRequestOptions) {
        return new Http(backend, defaultOptions);
      },
      deps: [MockBackend, BaseRequestOptions]
    }),
  ],
  selector: 'test-cmp',
  template: '<sd-polls></sd-polls>',
  directives: [PollsComponent]
})
class TestComponent {}
