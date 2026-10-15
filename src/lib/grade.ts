function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/\b(sri|shri|smt|dr|sir|hon'?ble|the)\b/g, " ")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a: string, b: string) {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const grid = Array.from({ length: rows }, () => new Array<number>(cols).fill(0));

  for (let i = 0; i < rows; i += 1) grid[i][0] = i;
  for (let j = 0; j < cols; j += 1) grid[0][j] = j;

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      grid[i][j] = Math.min(
        grid[i - 1][j] + 1,
        grid[i][j - 1] + 1,
        grid[i - 1][j - 1] + cost,
      );
    }
  }

  return grid[a.length][b.length];
}

export function answersMatch(input: string, accepted: string[]) {
  const typed = normalize(input);
  if (typed.length < 2) return false;

  return accepted.some((answer) => {
    const expected = normalize(answer);
    if (!expected) return false;
    if (typed === expected) return true;

    const shorter = Math.min(typed.length, expected.length);
    const longer = Math.max(typed.length, expected.length);
    const contained = expected.includes(typed) || typed.includes(expected);
    if (contained && shorter >= 4 && shorter / longer >= 0.55) return true;

    if (shorter < 4 || longer > 48) return false;
    const distance = levenshtein(typed, expected);
    return distance / longer <= 0.18;
  });
}
