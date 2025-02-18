import { DateTime } from 'luxon';

export function getNextWorkingDayEST(): { fullDate: string; day: string } {
  let date = DateTime.now().setZone('America/New_York').plus({ days: 1 });

  // Skip weekends
  while (date.weekday === 6 || date.weekday === 7) {
    date = date.plus({ days: 1 });
  }

  return {
    fullDate: date.toFormat('M/d/yyyy'), // "3/4/2025"
    day: date.toFormat('d'), // "4"
  };
}
