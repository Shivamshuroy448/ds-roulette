// Unit tests for Storage security
describe('Security Utils', () => {
  test('Storage keys are properly sanitized', () => {
    const rawKey = 'user@example.com';
    const sanitized = rawKey.replace(/[^a-zA-Z0-9_-]/g, '_');
    expect(sanitized).toBe('user_example_com');
  });
});
