// Randomly selects an option from a list of options
export function getRandomOption(options: string[]): string {
  if (!options.length) {
    throw new Error('No options provided for random selection.');
  }
  return options[Math.floor(Math.random() * options.length)];
}
