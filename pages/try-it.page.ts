import { type Page } from '@playwright/test';

class TryItPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goTo() {
    await this.page.goto('/try-it');
  }
}

export default TryItPage;
