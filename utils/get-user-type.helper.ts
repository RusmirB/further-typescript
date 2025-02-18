export function getUserTypeMessageKey(user: string): string {
  return user === 'Myself' ? 'Myself' : 'Others';
}
