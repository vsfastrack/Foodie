import { ChatterAppPage } from './app.po';

describe('chatter-app App', () => {
  let page: ChatterAppPage;

  beforeEach(() => {
    page = new ChatterAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
