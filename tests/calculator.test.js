const test = require('node:test');
const assert = require('node:assert/strict');
const { calculateBookingSummary, discountFor } = require('../js/script.js');

const cases = [
  {
    name: 'one R1,500 offering',
    selection: ['ultimate-gamer-pass'],
    expected: { bookingCount: 1, subtotal: 1500, discountRate: 0, discountAmount: 0, total: 1500 }
  },
  {
    name: 'two R1,500 offerings',
    selection: ['ultimate-gamer-pass', 'vip-gaming'],
    expected: { bookingCount: 2, subtotal: 3000, discountRate: 0.05, discountAmount: 150, total: 2850 }
  },
  {
    name: 'three R1,500 offerings',
    selection: ['ultimate-gamer-pass', 'vip-gaming', 'esports-training'],
    expected: { bookingCount: 3, subtotal: 4500, discountRate: 0.10, discountAmount: 450, total: 4050 }
  },
  {
    name: 'four R1,500 offerings',
    selection: ['ultimate-gamer-pass', 'vip-gaming', 'esports-training', 'birthday-party'],
    expected: { bookingCount: 4, subtotal: 6000, discountRate: 0.15, discountAmount: 900, total: 5100 }
  },
  {
    name: 'one R1,500 and two R750 offerings',
    selection: ['ultimate-gamer-pass', 'virtual-reality', 'racing-simulator'],
    expected: { bookingCount: 3, subtotal: 3000, discountRate: 0.10, discountAmount: 300, total: 2700 }
  },
  {
    name: 'one R750 offering',
    selection: ['virtual-reality'],
    expected: { bookingCount: 1, subtotal: 750, discountRate: 0, discountAmount: 0, total: 750 }
  },
  {
    name: 'no offerings selected',
    selection: [],
    expected: { bookingCount: 0, subtotal: 0, discountRate: 0, discountAmount: 0, total: 0 }
  }
];

test('discountFor applies the correct percentage rules', () => {
  assert.equal(discountFor(0), 0);
  assert.equal(discountFor(1), 0);
  assert.equal(discountFor(2), 0.05);
  assert.equal(discountFor(3), 0.10);
  assert.equal(discountFor(4), 0.15);
  assert.equal(discountFor(5), 0.15);
});

for (const testCase of cases) {
  test(`${testCase.name} calculates the expected total`, () => {
    assert.deepEqual(calculateBookingSummary(testCase.selection), testCase.expected);
  });
}
