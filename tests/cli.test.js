const { parseCliArgs } = require('../src/cli');

describe('parseCliArgs', () => {
  test('parses provided arguments', () => {
    const args = ['node', 'script', '-p', '4000', '-s', 'mysub', '-k', 'secret'];
    const result = parseCliArgs(args);
    expect(result).toEqual({ port: 4000, subdomain: 'mysub', secretKey: 'secret' });
  });
});
