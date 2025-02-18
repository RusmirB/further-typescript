import { test as baseTest } from '@playwright/test';
import ChatbotPage from '../pages/chatbot.page';
import TryItPage from '../pages/try-it.page';

/* Declare the types of your fixtures */
type MyFixtures = {
  chatbotPage: ChatbotPage;
  tryItPage: TryItPage;
};

const test = baseTest.extend<MyFixtures>({
  chatbotPage: async ({ page }, use) => {
    await use(new ChatbotPage(page));
  },
  tryItPage: async ({ page }, use) => {
    await use(new TryItPage(page));
  },
});

export default test;
export { expect } from '@playwright/test';
