import {containsAll, isValidSelection, Yatzy, ScoreBoard} from './yatzy';

const createFakeRoller = rolls => {
  let n = 0;
  return {
    roll: () => rolls[n++]
  }
};

test('isValidSelection', () => {
  expect(isValidSelection([1, 1, 2, 3, 4, 5], 'pair', [1, 1])).toBeTruthy();
  expect(isValidSelection([1, 1, 1, 2, 3, 4], 'pair', [1, 1, 1])).toBeFalsy();
  expect(isValidSelection([1, 2, 3, 4, 5, 6], 'pair', [1, 2])).toBeFalsy();
});

test('containsAll', () => {
  expect(containsAll([1, 2, 3, 4, 5, 6], [1, 1])).toBeFalsy();
  expect(containsAll([1, 2, 3, 4, 6, 6], [6, 6])).toBeTruthy();
});

test('Roll returns 6 dice', () => {
  const roller = createFakeRoller([[1, 2, 3, 4, 5, 6]]);
  const yatzy = new Yatzy({numberOfPlayers: 2}, roller);
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
  const roller = createFakeRoller([[1, 2, 3, 4, 5, 6]]);
  const yatzy = new Yatzy({numberOfPlayers: 2}, roller);
  yatzy.roll();
  yatzy.score('ones', [1]);
  expect(yatzy.getScore(0)).toEqual(1);
});

test('Place score on twos should give second player 4 points', () => {
  const roller = createFakeRoller([
    [1, 2, 3, 4, 5, 6],
    [1, 2, 2, 4, 5, 6]
  ]);
  const yatzy = new Yatzy({numberOfPlayers: 2}, roller);
  yatzy.roll();
  yatzy.score('ones', [1]);
  yatzy.roll();
  yatzy.score('twos', [2, 2]);
  expect(yatzy.getScore(1)).toEqual(4);
});

test('Place score on threes should give player1 15 points', () => {
  const roller = createFakeRoller([[3, 3, 3, 3, 3, 6]]);
  const yatzy = new Yatzy({numberOfPlayers: 2}, roller);
  yatzy.roll();
  yatzy.score('threes', [3, 3, 3, 3, 3]);
  expect(yatzy.getScore(0)).toEqual(15);
});

test('Place score on onePair (threes) should give player1 6 points', () => {
  const roller = createFakeRoller([[1, 1, 3, 3, 5, 6]]);
  const yatzy = new Yatzy({numberOfPlayers: 2}, roller);
  yatzy.roll();
  yatzy.score('onePair', [3, 3]);
  expect(yatzy.getScore(0)).toEqual(6);
});

test('Place score on twoPairs (ones and threes) should give player1 8 points', () => {
  const roller = createFakeRoller([[1, 1, 3, 3, 3, 6]]);
  const yatzy = new Yatzy({numberOfPlayers: 2}, roller);
  yatzy.roll();
  yatzy.score('twoPairs', [1, 1, 3, 3]);
  expect(yatzy.getScore(0)).toEqual(8);
});

test('Legal move - three pairs', () => {
  const roller = createFakeRoller([[1, 1, 3, 3, 6, 6]]);
  const yatzy = new Yatzy({numberOfPlayers: 2}, roller);
  yatzy.roll();
  yatzy.score(ScoreBoard.THREE_PAIRS, [1, 1, 3, 3, 6, 6]);
  expect(yatzy.getScore(0)).toEqual(20);
});

test('Place illegal score - one pair', () => {
  const roller = createFakeRoller([[1, 1, 3, 3, 3, 6]]);
  const yatzy = new Yatzy({numberOfPlayers: 2}, roller);
  yatzy.roll();
  expect(() => yatzy.score('onePair', [6, 6])).toThrow('Illegal score');
});

test('Place illegal score - two pairs', () => {
  const roller = createFakeRoller([[1, 1, 3, 3, 3, 6]]);
  const yatzy = new Yatzy({numberOfPlayers: 2}, roller);
  yatzy.roll();
  expect(() => yatzy.score('twoPairs', [1, 1, 6, 6])).toThrow('Illegal score');
});

test('Place illegal score - wrong selection (one pair)', () => {
  const roller = createFakeRoller([[1, 1, 1, 3, 3, 6]]);
  const yatzy = new Yatzy({numberOfPlayers: 2}, roller);
  yatzy.roll();
  expect(() => yatzy.score('pair', [1, 1, 1])).toThrow('Illegal score');
});

test('Place illegal score - wrong selection (two pairs)', () => {
  const roller = createFakeRoller([[1, 1, 1, 3, 3, 3]]);
  const yatzy = new Yatzy({numberOfPlayers: 2}, roller);
  yatzy.roll();
  expect(() => yatzy.score('twoPairs', [1, 1, 3, 3, 3])).toThrow('Illegal score');
});

test('Roll three times, then score', () => {
  const roller = createFakeRoller([
    [1, 2, 3, 4, 5, 6],
    [1, 2, 3, 4, 5],
    [1, 2, 3, 4]
  ]);

  const yatzy = new Yatzy({numberOfPlayers: 2}, roller);

  // Velger 1 kvar gang
  yatzy.roll();
  yatzy.roll([2, 3, 4, 5, 6]);
  yatzy.roll([2, 3, 4, 5]);
  yatzy.score('ones', [1, 1, 1]);

  expect(yatzy.getScore(0)).toEqual(3);
});

test('Maximum 3 rolls per turn', () => {

  const roller = {roll: () => [1, 2, 3, 4, 5, 6]};
  const yatzy = new Yatzy({numberOfPlayers: 2}, roller);

  yatzy.roll();
  yatzy.roll();
  yatzy.roll();

  expect(() => yatzy.roll()).toThrow('Max three rolls per turn');
});

