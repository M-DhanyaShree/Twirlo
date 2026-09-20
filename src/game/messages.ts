const FIRST_LEVEL_MESSAGE: readonly string[] = ['Great. You nailed it.', 'Now you are on your own.'];

const MESSAGES: readonly (readonly string[])[] = [
  ['Perfect.', 'Next one.'],
  ['Nice.', 'Keep going.'],
  ['Loop complete.'],
  ['Beautiful.', 'Breathe. Continue.'],
  ['Smooth.', 'One more.'],
];

export function pickMessage(level: number, rng: () => number = Math.random): readonly string[] {
  if (level === 1) return FIRST_LEVEL_MESSAGE;
  return MESSAGES[Math.floor(rng() * MESSAGES.length)];
}
