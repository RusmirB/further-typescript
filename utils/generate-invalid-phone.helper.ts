export function generateInvalidPhoneNumber(): string {
  // Generate a random length between 1 and 9
  const length = Math.floor(Math.random() * 9) + 1;

  let invalidPhoneNumber = '';
  for (let i = 0; i < length; i++) {
    invalidPhoneNumber += Math.floor(Math.random() * 10).toString();
  }

  return invalidPhoneNumber;
}
