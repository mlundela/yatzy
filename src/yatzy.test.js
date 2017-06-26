import {
  containsAll,
  isValidSelection,
  Yatzy,
  ScoreBoard,
  scoreReducer,
  RandomDice,
  createInitialState,
  sum
} from './yatzy';
import {shuffle} from 'lodash/collection';

const createFakedice = rolls => {
  let n = 0;
  return {
    roll: () => rolls[n++]
  }
};

function testRow(row, selection) {
  const s0 = {
    ...createInitialState(1),
    dice: shuffle([...selection, ...RandomDice.roll(6 - selection.length)]),
    rollCount: 1
  };
  const s1 = scoreReducer(s0, {row, selection});
  expect(s1.scoreBoard[0]).toHaveProperty(row, selection.reduce(sum, 0));
}


test('isValidSelection', () => {
  expect(isValidSelection([1, 1, 2, 3, 4, 5], 'onePair', [1, 1])).toBeTruthy();
  expect(isValidSelection([1, 1, 1, 2, 3, 4], 'onePair', [1, 1, 1])).toBeFalsy();
  expect(isValidSelection([1, 2, 3, 4, 5, 6], 'onePair', [1, 2])).toBeFalsy();
});

test('containsAll', () => {
  expect(containsAll([1, 2, 3, 4, 5, 6], [1, 1])).toBeFalsy();
  expect(containsAll([1, 2, 3, 4, 6, 6], [6, 6])).toBeTruthy();
});

test('Roll returns 6 dice', () => {
  const dice = createFakedice([[1, 2, 3, 4, 5, 6]]);
  const yatzy = new Yatzy({numberOfPlayers: 2}, dice);
  expect(yatzy.roll().length).toEqual(6);
});

test('Initial score should be 0', () => {
  const yatzy = new Yatzy({numberOfPlayers: 2});
  expect(yatzy.getScore(0)).toEqual(0);
});

test('Initial score should have length equal to number of players', () => {
  const yatzy = new Yatzy({numberOfPlayers: 2});
  expect(yatzy.getScoreBoard().length).toEqual(2);
});

test('Place score on ones should give first player 1 point', () => {
  const dice = createFakedice([[1, 2, 3, 4, 5, 6]]);
  const yatzy = new Yatzy({numberOfPlayers: 2}, dice);
  yatzy.roll();
  yatzy.score('ones', [1]);
  expect(yatzy.getScore(0)).toEqual(1);
});

test('Place score on twos should give second player 4 points', () => {
  const dice = createFakedice([
    [1, 2, 3, 4, 5, 6],
    [1, 2, 2, 4, 5, 6]
  ]);
  const yatzy = new Yatzy({numberOfPlayers: 2}, dice);
  yatzy.roll();
  yatzy.score('ones', [1]);
  yatzy.roll();
  yatzy.score('twos', [2, 2]);
  expect(yatzy.getScore(1)).toEqual(4);
});

test('Place score on threes should give player1 15 points', () => {
  const dice = createFakedice([[3, 3, 3, 3, 3, 6]]);
  const yatzy = new Yatzy({numberOfPlayers: 2}, dice);
  yatzy.roll();
  yatzy.score('threes', [3, 3, 3, 3, 3]);
  expect(yatzy.getScore(0)).toEqual(15);
});

test('Place score on onePair (threes) should give player1 6 points', () => {
  const dice = createFakedice([[1, 1, 3, 3, 5, 6]]);
  const yatzy = new Yatzy({numberOfPlayers: 2}, dice);
  yatzy.roll();
  yatzy.score('onePair', [3, 3]);
  expect(yatzy.getScore(0)).toEqual(6);
});

test('Place score on twoPairs (ones and threes) should give player1 8 points', () => {
  const dice = createFakedice([[1, 1, 3, 3, 3, 6]]);
  const yatzy = new Yatzy({numberOfPlayers: 2}, dice);
  yatzy.roll();
  yatzy.score('twoPairs', [1, 1, 3, 3]);
  expect(yatzy.getScore(0)).toEqual(8);
});

test(`Legal score - ${ScoreBoard.ONE_PAIR}`, () => {
  testRow(ScoreBoard.ONE_PAIR, [1, 1]);
});

test(`Legal score - ${ScoreBoard.TWO_PAIRS}`, () => {
  testRow(ScoreBoard.TWO_PAIRS, [1, 2, 1, 2]);
});

test(`Legal score - ${ScoreBoard.THREE_ALIKE}`, () => {
  testRow(ScoreBoard.THREE_ALIKE, [1, 1, 1]);
});

test(`Legal score - ${ScoreBoard.FOUR_ALIKE}`, () => {
  testRow(ScoreBoard.FOUR_ALIKE, [2, 2, 2, 2]);
});

test(`Legal score - ${ScoreBoard.FIVE_ALIKE}`, () => {
  testRow(ScoreBoard.FIVE_ALIKE, [3, 3, 3, 3, 3]);
});

test(`Legal score - ${ScoreBoard.CABIN}`, () => {
  testRow(ScoreBoard.CABIN, [5, 5, 6, 6, 6]);
  testRow(ScoreBoard.CABIN, [5, 5, 3, 3, 3]);
});

test(`Legal score - ${ScoreBoard.HOUSE}`, () => {
  testRow(ScoreBoard.HOUSE, [1, 2, 1, 2, 1, 2]);
  testRow(ScoreBoard.HOUSE, [5, 5, 5, 3, 3, 3]);
});

test(`Legal score - ${ScoreBoard.TOWER}`, () => {
  testRow(ScoreBoard.TOWER, [6, 6, 5, 6, 6, 5]);
});

test(`Legal score - ${ScoreBoard.SMALL_STREET}`, () => {
  testRow(ScoreBoard.SMALL_STREET, [1, 2, 3, 4, 5]);
  testRow(ScoreBoard.SMALL_STREET, [5, 4, 2, 3, 1]);
});

test(`Legal score - ${ScoreBoard.LARGE_STREET}`, () => {
  testRow(ScoreBoard.LARGE_STREET, [2, 3, 4, 5, 6]);
  testRow(ScoreBoard.LARGE_STREET, [6, 3, 4, 5, 2]);
});

test(`Legal score - ${ScoreBoard.FULL_STREET}`, () => {
  testRow(ScoreBoard.FULL_STREET, [1, 2, 3, 4, 5, 6]);
});

test(`${ScoreBoard.CHANCE} takes six values`, () => {
  const dice = createFakedice([
    [1, 1, 2, 3, 4, 5],
  ]);
  const yatzy = new Yatzy({numberOfPlayers: 1}, dice);
  yatzy.roll();
  expect(() => yatzy.score(ScoreBoard.CHANCE, [1])).toThrow('Illegal score');
});

test('Place illegal score - one pair', () => {
  const dice = createFakedice([[1, 1, 3, 3, 3, 6]]);
  const yatzy = new Yatzy({numberOfPlayers: 2}, dice);
  yatzy.roll();
  expect(() => yatzy.score('onePair', [6, 6])).toThrow('Illegal score');
});

test('Place illegal score - two pairs', () => {
  const dice = createFakedice([[1, 1, 3, 3, 3, 6]]);
  const yatzy = new Yatzy({numberOfPlayers: 2}, dice);
  yatzy.roll();
  expect(() => yatzy.score('twoPairs', [1, 1, 6, 6])).toThrow('Illegal score');
});

test('Place illegal score - wrong selection (one pair)', () => {
  const dice = createFakedice([[1, 1, 1, 3, 3, 6]]);
  const yatzy = new Yatzy({numberOfPlayers: 2}, dice);
  yatzy.roll();
  expect(() => yatzy.score('pair', [1, 1, 1])).toThrow('Illegal score');
});

test('Place illegal score - wrong selection (two pairs)', () => {
  const dice = createFakedice([[1, 1, 1, 3, 3, 3]]);
  const yatzy = new Yatzy({numberOfPlayers: 2}, dice);
  yatzy.roll();
  expect(() => yatzy.score('twoPairs', [1, 1, 3, 3, 3])).toThrow('Illegal score');
});

test('Roll three times, then score', () => {
  const dice = createFakedice([
    [1, 2, 3, 4, 5, 6],
    [1, 2, 3, 4, 5],
    [1, 2, 3, 4]
  ]);

  const yatzy = new Yatzy({numberOfPlayers: 2}, dice);

  // Velger 1 kvar gang
  yatzy.roll();
  yatzy.roll([2, 3, 4, 5, 6]);
  yatzy.roll([2, 3, 4, 5]);
  yatzy.score('ones', [1, 1, 1]);

  expect(yatzy.getScore(0)).toEqual(3);
});

test('Maximum 3 rolls per turn', () => {

  const dice = {roll: () => [1, 2, 3, 4, 5, 6]};
  const yatzy = new Yatzy({numberOfPlayers: 2}, dice);

  yatzy.roll();
  yatzy.roll();
  yatzy.roll();

  expect(() => yatzy.roll()).toThrow('Max three rolls per turn');
});

test('Bonus should be 100 if SUM ones through sixes >= 84', () => {

  const state = {
    player: 0,
    dice: [5, 5, 5, 5, 5, 5],
    scoreBoard: [{
      [ScoreBoard.ONES]: 4,
      [ScoreBoard.TWOS]: 8,
      [ScoreBoard.THREES]: 12,
      [ScoreBoard.FOURS]: 16,
      [ScoreBoard.FIVES]: 0,
      [ScoreBoard.SIXES]: 24,
    }]
  };

  const action = {row: ScoreBoard.FIVES, selection: [5, 5, 5, 5, 5, 5]};

  const newState = scoreReducer(state, action);

  expect(newState.scoreBoard[0])
    .toHaveProperty(ScoreBoard.BONUS, 100);
});

test('YATZY is worth 100 points', () => {

  const state = {
    ...createInitialState(1),
    rollCount: 1,
    dice: [5, 5, 5, 5, 5, 5]
  };

  const action = {row: ScoreBoard.YATZY, selection: [5, 5, 5, 5, 5, 5]};
  const newState = scoreReducer(state, action);

  expect(newState.scoreBoard[0])
    .toHaveProperty(ScoreBoard.YATZY, 100);

});

test('One can not score without rolling first', () => {

  const dice = {roll: () => [1, 2, 3, 4, 5, 6]};
  const yatzy = new Yatzy({numberOfPlayers: 1}, dice);

  yatzy.roll();
  yatzy.score(ScoreBoard.ONES, [1]);

  expect(() => yatzy.score(ScoreBoard.ONES, [1])).toThrow('Illegal score');
});

test('One can not score same row more than once', () => {

  const dice = {roll: () => [1, 2, 3, 4, 5, 6]};
  const yatzy = new Yatzy({numberOfPlayers: 1}, dice);

  yatzy.roll();
  yatzy.score(ScoreBoard.ONES, [1]);

  expect(() => yatzy.score(ScoreBoard.ONES, [1])).toThrow('Illegal score');
});

test('Cross out small street', () => {

  const dice = {roll: () => [1, 2, 3, 4, 5, 6]};
  const yatzy = new Yatzy({numberOfPlayers: 1}, dice);

  yatzy.cross(ScoreBoard.SMALL_STREET);
  yatzy.roll();

  const scoreBoard = yatzy.getScoreBoard()[0];

  expect(scoreBoard).toHaveProperty(ScoreBoard.SMALL_STREET, -1);
  expect(() => yatzy.score(ScoreBoard.SMALL_STREET, [1, 2, 3, 4, 5])).toThrow('Illegal score');
});

test('test default dice', () => {
  expect(RandomDice.roll(6).length).toEqual(6)
});

test('A player receives 1 token', () => {
  const yatzy = new Yatzy({numberOfPlayers: 1});
  yatzy.roll();
  yatzy.roll();
  yatzy.cross(ScoreBoard.SMALL_STREET);
  expect(yatzy.getTokens(0)).toEqual(1);
});

test('A player receives 2 tokens', () => {
  const yatzy = new Yatzy({numberOfPlayers: 1});
  yatzy.roll();
  yatzy.cross(ScoreBoard.SMALL_STREET);
  expect(yatzy.getTokens(0)).toEqual(1);
});

test('A player receives 3 tokens', () => {
  const yatzy = new Yatzy({numberOfPlayers: 1});
  yatzy.cross(ScoreBoard.SMALL_STREET);
  expect(yatzy.getTokens(0)).toEqual(1);
});

test('A player use 1 token to roll 4 times', () => {
  const yatzy = new Yatzy({numberOfPlayers: 1});
  yatzy.roll();
  yatzy.roll();
  yatzy.cross(ScoreBoard.SMALL_STREET);
  yatzy.roll();
  yatzy.roll();
  yatzy.roll();
  yatzy.roll();
  yatzy.cross(ScoreBoard.LARGE_STREET);
  expect(yatzy.getTokens(0)).toEqual(0);
});
