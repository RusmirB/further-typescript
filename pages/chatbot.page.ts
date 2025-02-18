import { Page, Locator, expect } from '@playwright/test';
import { formatText } from '../utils/text.helper';
import { getRandomOption } from '../utils/get-random-option.helper';
import {
  ACTIVITY_SELECTIONS,
  AVAILABLE_TIME_SLOTS,
  LEVEL_OF_CARE_OPTIONS,
  MOVE_TIMELINE_OPTIONS,
  USER_TYPE_OPTIONS,
} from '../test-data/chatbot-options';
import chatbotMessages from '../test-data/chatbot-messages.json';
import { faker } from '@faker-js/faker';
import { getNextWorkingDayEST } from '../utils/date.helper';
import { getUserTypeMessageKey } from '../utils/get-user-type.helper';

class ChatbotPage {
  readonly page: Page;
  readonly openedChatbotContainer: Locator;
  readonly currentMessage: Locator;
  readonly historicalMessages: Locator;
  readonly currentContainer: Locator;
  readonly historicalContainer: Locator;
  readonly nextButton: Locator;
  readonly selectedOptionLocator: Locator;
  readonly selectedDateTimeLocator: Locator;
  readonly optionsLocator: Locator;
  readonly confirmSelectionsButton: Locator;
  readonly chatInput: Locator;
  readonly chatSubmitButton: Locator;
  readonly pricingWindow: Locator;
  readonly inputError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.openedChatbotContainer = this.page.locator('.Bubble.half-open').first();
    this.currentMessage = this.page.locator('.CurrentStep.loaded .MessageBubble.light');
    this.historicalMessages = this.page.locator('.historical-steps .MessageBubble.light');
    this.currentContainer = this.page.locator('.CurrentStep.loaded');
    this.historicalContainer = this.page.locator('.historical-steps');
    this.nextButton = this.page.locator('button.vsa-button.SubmitButton.floating', { hasText: 'Next' });
    this.selectedOptionLocator = this.historicalContainer.locator('.option-button.primary.selected');
    this.selectedDateTimeLocator = this.page.locator('.historical-steps .MessageBubble.light.user');
    this.optionsLocator = this.currentContainer.locator('.option-button');
    this.confirmSelectionsButton = this.page.locator('button.vsa-button.SubmitButton.floating', {
      hasText: 'Confirm selections',
    });
    this.chatInput = this.page.locator('.UserInput.floating.light input');
    this.chatSubmitButton = this.page.locator('.send-icon');
    this.pricingWindow = this.page.locator('.Pricing.V4.floating.light');
    this.inputError = this.page.locator('.UserInput.floating.light.error');
  }

  async checkIfChatbotIsOpened() {
    await this.openedChatbotContainer.waitFor();
  }

  async selectOption(option: string) {
    const optionLocator = this.optionsLocator.filter({ hasText: option });

    await optionLocator.click();
    await expect(optionLocator).toBeHidden();
  }

  async validateCurrentChatbotMessage(expectedMessage: string | string[]) {
    await this.currentMessage.waitFor();
    const actualMessage = await this.currentMessage.textContent();
    const formattedActualMessage = formatText(actualMessage);

    // Check if the expected message is an array than match any of the messages
    if (Array.isArray(expectedMessage)) {
      const isMatch = expectedMessage.some((msg) => formattedActualMessage.includes(msg));
      expect(isMatch).toBeTruthy(); // Ensure at least one match
    } else {
      expect(formattedActualMessage).toContain(expectedMessage);
    }
  }

  async validateHistoricalChatbotMessage(expectedMessage: string) {
    const historicalMessage = await this.historicalMessages.last().textContent();
    expect(formatText(historicalMessage)).toContain(expectedMessage);
  }

  async validateSelectedHistoricalOption(option: string) {
    const selectedOption = this.selectedOptionLocator.filter({ hasText: option }).last();
    await expect(selectedOption).toBeVisible();
  }

  async selectDateAndTime(date: string, time: string) {
    await this.page.locator(`.date`).filter({ hasText: date }).click();
    await this.page.locator(`.time-wrapper .time`).filter({ hasText: time }).click();
  }

  async validateSelectedDateTime(expectedDateTime: string) {
    await expect(this.selectedDateTimeLocator.last()).toHaveText(expectedDateTime);
  }

  async clickNextButton() {
    await this.nextButton.click();
  }

  async selectActivityBasedOnUserType(userType: string) {
    const availableOptions = ACTIVITY_SELECTIONS[userType === 'Myself' ? 'Myself' : 'Others'];

    const selectedActivity = getRandomOption(availableOptions);
    const optionLocator = this.optionsLocator.filter({ hasText: selectedActivity });
    await optionLocator.click();
  }

  async selectActivityAndConfirmSelection(userType: string) {
    await this.selectActivityBasedOnUserType(userType);
    await this.confirmSelectionsButton.click();
    await this.validateCurrentChatbotMessage(chatbotMessages.common.whatIsYourNameMessage);
  }

  async selectTimeline(userType: string, inquiryType: string) {
    // Determine which timeline options to use
    const timelineOptions =
      inquiryType === 'Pricing' ? MOVE_TIMELINE_OPTIONS.pricing : MOVE_TIMELINE_OPTIONS.scheduleTour;

    // Only execute if it's "Schedule A Tour" (for Myself) or "Pricing" (for any user)
    if ((inquiryType === 'Schedule A Tour' && userType === 'Myself') || inquiryType === 'Pricing') {
      const selectedTimeline = getRandomOption(timelineOptions);
      await this.selectOption(selectedTimeline);
      await this.validateSelectedHistoricalOption(selectedTimeline);
    }
  }

  async closeChat() {
    const notRightNowButton = this.optionsLocator.filter({ hasText: 'Not right now' });
    const closeChatButton = this.optionsLocator.filter({ hasText: 'Close chat' });

    // Close chat if "Not right now" button is visible, otherwise click "Close chat"
    if (await notRightNowButton.isVisible()) {
      await notRightNowButton.click();
    } else {
      await closeChatButton.click();
    }
  }

  async enterAnswerAndSubmit(name: string) {
    await this.chatInput.fill(name);
    await this.chatSubmitButton.click();
  }

  async submitChatInput() {
    await this.chatSubmitButton.click();
  }

  async validatePrepopulatedInput(expectedValue: string) {
    await this.chatInput.waitFor();
    const actualValue = this.chatInput;
    await expect(actualValue).toHaveValue(expectedValue);
  }

  async validatePricingWindow() {
    await expect(this.pricingWindow).toBeVisible();

    // Validate that there are pricing rows
    const pricingRows = this.pricingWindow.locator('.pricing-row');
    const rowCount = await pricingRows.count();
    expect(rowCount).toBeGreaterThan(0);

    // Validate pricing options exist
    await expect(this.pricingWindow.getByText('Assisted Living')).toBeVisible();
    await expect(this.pricingWindow.getByText('Independent Living')).toBeVisible();
    await expect(this.pricingWindow.getByText('Memory Care')).toBeVisible();

    // Validate expected buttons are visible
    const scheduleAVisitButton = this.optionsLocator.filter({ hasText: 'Schedule A Visit' });
    const askAQuestionButton = this.optionsLocator.filter({ hasText: 'Ask A Question' });
    const outOfMyBudgetButton = this.optionsLocator.filter({ hasText: 'Out Of My Budget' });

    await expect(scheduleAVisitButton).toBeVisible();
    await expect(askAQuestionButton).toBeVisible();
    await expect(outOfMyBudgetButton).toBeVisible();
  }

  async validateInputError(expectedMessage: string) {
    const errorMessage = await this.inputError.textContent();
    expect(errorMessage).toContain(expectedMessage);
  }

  async validateEmailValidationMessage(expectedMessage: string) {
    await this.chatInput.waitFor();

    // Capture browser validation message
    const validationMessage = await this.chatInput.evaluate((el) => {
      // eslint-disable-next-line no-undef
      return (el as HTMLInputElement).validationMessage;
    });

    expect(validationMessage).toContain(expectedMessage);
  }

  async fillPersonalInfo(inquiryType: string) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const fullName = `${firstName} ${lastName}`;
    const email = faker.internet.email({ provider: 'example.com' });
    const phoneNumber = faker.phone.number({ style: 'international' });

    await this.validateCurrentChatbotMessage(chatbotMessages.common.whatIsYourNameMessage);
    await this.enterAnswerAndSubmit(fullName);

    if (inquiryType === 'Pricing') {
      // Pricing flow: Name → Phone → Email
      await this.validateCurrentChatbotMessage(chatbotMessages.common.whatIsYourPhoneNumberMessages);
      await this.enterAnswerAndSubmit(phoneNumber);

      await this.validateCurrentChatbotMessage(chatbotMessages.common.whatIsYourEmailMessage);
      await this.enterAnswerAndSubmit(email);
    } else {
      // Schedule a Tour flow: Name → Email → Phone
      await this.validateCurrentChatbotMessage(chatbotMessages.common.whatIsYourEmailMessage);
      await this.enterAnswerAndSubmit(email);

      await this.validateCurrentChatbotMessage(chatbotMessages.common.whatIsYourPhoneNumberMessages);
      await this.enterAnswerAndSubmit(phoneNumber);
    }

    return { fullName, email, phoneNumber, firstName };
  }

  async scheduleATourSteps(inquiryType: string) {
    await this.selectOption(inquiryType);
    await this.validateCurrentChatbotMessage(chatbotMessages.scheduleTourFlow.whoIsInterestedMessage);
    await this.validateHistoricalChatbotMessage(chatbotMessages.common.initialMessage);
    await this.validateSelectedHistoricalOption(inquiryType);
  }

  async whoIsInterestedScheduleTourSteps() {
    // Get random user type
    const userType = getRandomOption(USER_TYPE_OPTIONS.scheduleTour);
    // Select user type and validate messages
    await this.selectOption(userType);
    await this.validateCurrentChatbotMessage(chatbotMessages.scheduleTourFlow.whenMessage);
    await this.validateHistoricalChatbotMessage(chatbotMessages.scheduleTourFlow.whoIsInterestedMessage);
    await this.validateSelectedHistoricalOption(userType);

    return userType;
  }

  async whoIsInterestedPricingSteps() {
    // Get random user type
    const userType = getRandomOption(USER_TYPE_OPTIONS.pricing);
    // Select user type and validate messages
    await this.selectOption(userType);
    await this.validateCurrentChatbotMessage(chatbotMessages.pricingFlow.whatIsYourTimelineMessage);
    await this.validateHistoricalChatbotMessage(chatbotMessages.pricingFlow.whoIsThisForMessage);
    await this.validateSelectedHistoricalOption(userType);

    return userType;
  }
  async selectTourScheduleSteps(userType: string) {
    // Get next working day and random time
    const { fullDate, day } = getNextWorkingDayEST();
    const timeToSelect = getRandomOption(AVAILABLE_TIME_SLOTS);
    const userMessageType = getUserTypeMessageKey(userType);

    await this.selectDateAndTime(day, timeToSelect);
    await this.clickNextButton();
    await this.validateSelectedDateTime(`${fullDate} at ${timeToSelect}`);
    await this.validateCurrentChatbotMessage(chatbotMessages.scheduleTourFlow.userTypeMessages[userMessageType]);

    return { fullDate, day };
  }

  async selectPricingSteps(inquiryType: string) {
    await this.selectOption(inquiryType);
    await this.validateCurrentChatbotMessage(chatbotMessages.pricingFlow.whatLevelOfCareMessage);
    await this.validateHistoricalChatbotMessage(chatbotMessages.common.initialMessage);
    await this.validateSelectedHistoricalOption(inquiryType);
  }

  async selectLevelOfCareSteps() {
    // Get random level of care
    const levelOfCare = getRandomOption(LEVEL_OF_CARE_OPTIONS);
    // Select level of care and validate messages
    await this.selectOption(levelOfCare);
    await this.validateCurrentChatbotMessage(chatbotMessages.pricingFlow.whoIsThisForMessage);
    await this.validateHistoricalChatbotMessage(chatbotMessages.pricingFlow.whatLevelOfCareMessage);
    await this.validateSelectedHistoricalOption(levelOfCare);
  }
}

export default ChatbotPage;
