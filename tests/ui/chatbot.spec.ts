import test from '../../fixtures/pages';
import chatbotMessages from '../../test-data/chatbot-messages.json';

test.describe('Chatbot', () => {
  test('Schedule a tour flow', async ({ chatbotPage, tryItPage }) => {
    const inquiryType = 'Schedule A Tour';

    // Navigate to the app and check for chatbot
    await tryItPage.goTo();
    await chatbotPage.checkIfChatbotIsOpened();
    await chatbotPage.validateCurrentChatbotMessage(chatbotMessages.common.initialMessage);

    // Schedule a tour flow
    await chatbotPage.scheduleATourSteps(inquiryType);
    const userType = await chatbotPage.whoIsInterestedScheduleTourSteps();
    await chatbotPage.selectTourScheduleSteps(userType);
    await chatbotPage.selectTimeline(userType, inquiryType);
    await chatbotPage.selectActivityAndConfirmSelection(userType);
    await chatbotPage.fillPersonalInfo(inquiryType);
    await chatbotPage.validateCurrentChatbotMessage(chatbotMessages.scheduleTourFlow.finalMessages);

    // Close chatbot
    await chatbotPage.closeChat();
  });

  test('Pricing flow', async ({ chatbotPage, tryItPage }) => {
    const inquiryType = 'Pricing';

    // Navigate to app and check for chatbot
    await tryItPage.goTo();
    await chatbotPage.checkIfChatbotIsOpened();
    await chatbotPage.validateCurrentChatbotMessage(chatbotMessages.common.initialMessage);

    // Pricing flow
    await chatbotPage.selectPricingSteps(inquiryType);
    await chatbotPage.selectLevelOfCareSteps();
    const userType = await chatbotPage.whoIsInterestedPricingSteps();
    await chatbotPage.selectTimeline(userType, inquiryType);
    await chatbotPage.validateCurrentChatbotMessage(chatbotMessages.common.whatIsYourNameMessage);
    await chatbotPage.fillPersonalInfo(inquiryType);

    // Validate pricing information and options
    await chatbotPage.validatePricingWindow();
  });

  test('User Revisit - Remembering Data', async ({ chatbotPage, tryItPage }) => {
    const inquiryType = 'Schedule A Tour';

    // Navigate to app and check for chatbot
    await tryItPage.goTo();
    await chatbotPage.checkIfChatbotIsOpened();
    await chatbotPage.validateCurrentChatbotMessage(chatbotMessages.common.initialMessage);

    // Schedule a tour flow
    await chatbotPage.scheduleATourSteps(inquiryType);
    const userType = await chatbotPage.whoIsInterestedScheduleTourSteps();
    await chatbotPage.selectTourScheduleSteps(userType);
    await chatbotPage.selectTimeline(userType, inquiryType);
    await chatbotPage.selectActivityAndConfirmSelection(userType);
    const { fullName, email, phoneNumber, firstName } = await chatbotPage.fillPersonalInfo(inquiryType);
    await chatbotPage.validateCurrentChatbotMessage(chatbotMessages.scheduleTourFlow.finalMessages);

    // Refresh the page
    await tryItPage.goTo();
    await chatbotPage.checkIfChatbotIsOpened();

    // Validate name is remembered in Welcome back message
    await chatbotPage.validateCurrentChatbotMessage(chatbotMessages.common.welcomeBackMessage + firstName + '?');

    // Schedule a tour again
    await chatbotPage.selectOption(inquiryType);
    await chatbotPage.whoIsInterestedScheduleTourSteps();
    await chatbotPage.selectTourScheduleSteps(userType);
    await chatbotPage.selectTimeline(userType, inquiryType);
    await chatbotPage.selectActivityAndConfirmSelection(userType);

    // Validate name is remembered
    await chatbotPage.validatePrepopulatedInput(fullName);
    await chatbotPage.submitChatInput();

    // Validate email is remembered
    await chatbotPage.validatePrepopulatedInput(email);
    await chatbotPage.submitChatInput();

    // Validate phone number is remembered
    await chatbotPage.validatePrepopulatedInput(phoneNumber);
    await chatbotPage.submitChatInput();
    await chatbotPage.validateCurrentChatbotMessage(chatbotMessages.scheduleTourFlow.finalMessages);

    // Close chatbot
    await chatbotPage.closeChat();
  });
});
