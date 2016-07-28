describe('Polls', () => {

  beforeEach( () => {
    browser.get('/');
  });

  it('should have an input', () => {
    expect(element(by.css('sd-polls form input')).isPresent()).toEqual(true);
  });

  it('should have a list of polls', () => {
    expect(element(by.css('sd-polls ul')).getText())
      .toEqual('');
  });

});
