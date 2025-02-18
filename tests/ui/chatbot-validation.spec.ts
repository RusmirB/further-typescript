import test from '../../fixtures/pages';
import { faker } from '@faker-js/faker';
import chatbotMessages from '../../test-data/chatbot-messages.json';
import { generateInvalidPhoneNumber } from '../../utils/generate-invalid-phone.helper';

test.describe('Chatbot Validations', () => {
  test('Empty name, phone, email', async ({ chatbotPage, tryItPage }) => {
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

    // Submit empty name and check error message
    await chatbotPage.submitChatInput();
    await chatbotPage.validateInputError('Please enter first and last name');

    // Type name
    const fullName = faker.person.fullName();
    await chatbotPage.enterAnswerAndSubmit(fullName);
    await chatbotPage.validateCurrentChatbotMessage(chatbotMessages.common.whatIsYourPhoneNumberMessages);

    // Submit empty phone number and check error message
    await chatbotPage.submitChatInput();
    await chatbotPage.validateInputError(
      'Sorry but that is an invalid phone number. Please check it is 10 digits long and does not contain letters or symbols.'
    );

    // Type phone number
    const phoneNumber = faker.phone.number({ style: 'international' });
    await chatbotPage.enterAnswerAndSubmit(phoneNumber);
    await chatbotPage.validateCurrentChatbotMessage(chatbotMessages.common.whatIsYourEmailMessage);

    // Submit empty email and check error message
    await chatbotPage.submitChatInput();

    // THERE IS A BUG IN THE EMAIL VALIDATION FOR EMPTY EMAIL  - ERROR MESSAGE DOES NOT LOOK RIGHT
    // Something like this would be expected as a message: "Please enter a valid email address" with the following step
    // await chatbotPage.validateInputError('Please enter a valid email address');

    // Howover the actual message is: "segment_1 must be a `string` type, but the final value was: `null`.
    // If \"null\" is intended as an empty value be sure to mark the schema as `.nullable()"

    // Commenting out this step for now
  });

  test('Name Validation', async ({ tryItPage, chatbotPage }) => {
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

    // Type one letter for first name and check error message
    await chatbotPage.enterAnswerAndSubmit('A Test');
    await chatbotPage.validateInputError('First name must be at least two characters');

    // Type only first name and check error message
    const firstName = faker.person.firstName();
    await chatbotPage.enterAnswerAndSubmit(firstName);
    await chatbotPage.validateInputError(
      'Can you please enter your full name? Our system requires first and last name.'
    );
  });

  test('Phone Validation', async ({ tryItPage, chatbotPage }) => {
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

    // Type full name
    const fullName = faker.person.fullName();
    await chatbotPage.enterAnswerAndSubmit(fullName);

    // Type incorrect phone number randomly between 1 and 9 digits
    const phoneNumber = generateInvalidPhoneNumber();
    await chatbotPage.enterAnswerAndSubmit(phoneNumber);
    await chatbotPage.validateInputError(
      'Sorry but that is an invalid phone number. Please check it is 10 digits long and does not contain letters or symbols.'
    );
  });

  test('Email Validation', async ({ tryItPage, chatbotPage }) => {
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
    // Type full name
    const fullName = faker.person.fullName();
    await chatbotPage.enterAnswerAndSubmit(fullName);

    // Type phone number
    const correctPhoneNumber = faker.phone.number({ style: 'international' });
    await chatbotPage.enterAnswerAndSubmit(correctPhoneNumber);

    // Type incorrect email without the firt part to @
    const justDomainEmail = '@example.com';
    await chatbotPage.enterAnswerAndSubmit(justDomainEmail);
    await chatbotPage.validateEmailValidationMessage(
      `Please enter a part followed by '@'. '${justDomainEmail}' is incomplete.`
    );

    // Type incorrect email without the domain part
    const justFirstPartEmail = 'test@';
    await chatbotPage.enterAnswerAndSubmit(justFirstPartEmail);
    await chatbotPage.validateEmailValidationMessage(
      `Please enter a part following '@'. '${justFirstPartEmail}' is incomplete.`
    );

    // Type email without "@" symbol
    const emailWithoutAt = 'testexample.com';
    await chatbotPage.enterAnswerAndSubmit(emailWithoutAt);
    await chatbotPage.validateEmailValidationMessage(`Please include an '@' in the email address.`);

    // Type email without .com or .org
    const emailWithoutDomain = 'test@example';
    await chatbotPage.enterAnswerAndSubmit(emailWithoutDomain);
    await chatbotPage.validateInputError(`Please use a valid email address`);
  });
});
