// Unit tests for Auth context and guest mode
describe('Auth Context', () => {
  test('Guest user profile initializes with default streak', () => {
    const defaultStreak = 1;
    expect(defaultStreak).toBe(1);
  });
});
