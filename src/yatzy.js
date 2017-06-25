import {groupBy} from 'lodash/collection';
import {range} from 'lodash/util';
import {intersection} from 'lodash/array';

export const ScoreBoard = {
  ONES: 'ones',
  TWOS: 'twos',
  THREES: 'threes',
  FOURS: 'fours',
  FIVES: 'fives',
  SIXES: 'sixes',
  BONUS: 'bonus',
  ONE_PAIR: 'pair',
  TWO_PAIRS: 'twoPairs',
  THREE_PAIRS: 'threePairs',
  THREE_ALIKE: 'threeAlike',
  FOUR_ALIKE: 'fourAlike',
  FIVE_ALIKE: 'fiveAlike',
  CABIN: 'cabin',
  HOUSE: 'house',
  TOWER: 'tower',
  SMALL_STREET: 'smallStreet',
  LARGE_STREET: 'largeStreet',
  FULL_STREET: 'fullStreet',
  CHANCE: 'chance',
  YATZY: 'yatzy',
};

const sum = (acc, curr) => acc + curr;

const rest = (superset, subset) => {
  let rest = [...superset];
  for (const value of subset) {
    if (rest.find(x => x == value)) {
      rest.splice(rest.indexOf(value), 1);
    }
  }
  return rest;
};

export const containsAll = (superset, subset) => {
  return rest(superset, subset).length == superset.length - subset.length;
};

export const isValidSelection = (dice, row, selection) => {

  if (!containsAll(dice, selection)) {
    return false;
  }

  const isGroupOf = (...args) => {
    const foo = Object.values(groupBy(selection)).sort((a, b) => a.length > b.length);
    return foo.length === args.length && foo.every((f, i) => f.length === args[i]);
  };

  const isEqualTo = arr => intersection(arr, selection).length === selection.length;

  const isOnly = n => selection.every(val => val === n);

  switch (row) {
    case ScoreBoard.ONES:
      return isOnly(1);
    case ScoreBoard.TWOS:
      return isOnly(2);
    case ScoreBoard.THREES:
      return isOnly(3);
    case ScoreBoard.FOURS:
      return isOnly(4);
    case ScoreBoard.FIVES:
      return isOnly(5);
    case ScoreBoard.SIXES:
      return isOnly(6);
    case ScoreBoard.ONE_PAIR:
      return isGroupOf(2);
    case ScoreBoard.TWO_PAIRS:
      return isGroupOf(2, 2);
    case ScoreBoard.THREE_PAIRS:
      return isGroupOf(2, 2, 2);
    case ScoreBoard.THREE_ALIKE:
      return isGroupOf(3);
    case ScoreBoard.FOUR_ALIKE:
      return isGroupOf(4);
    case ScoreBoard.FIVE_ALIKE:
      return isGroupOf(5);
    case ScoreBoard.CABIN:
      return isGroupOf(2, 3);
    case ScoreBoard.HOUSE:
      return isGroupOf(3, 3);
    case ScoreBoard.TOWER:
      return isGroupOf(2, 4);
    case ScoreBoard.SMALL_STREET:
      return isEqualTo([1, 2, 3, 4, 5]);
    case ScoreBoard.LARGE_STREET:
      return isEqualTo([2, 3, 4, 5, 6]);
    case ScoreBoard.FULL_STREET:
      return isEqualTo([1, 2, 3, 4, 5, 6]);
    case ScoreBoard.YATZY:
      return isGroupOf(6);
    default:
      return true;
  }
};

const createScoreBoard = () => Object
  .values(ScoreBoard)
  .reduce((obj, row) => ({...obj, [row]: 0}), {});

const getTotalScore = scoreBoard => scoreBoard.map(b => Object.values(b).reduce(sum, 0));

const initialState = numberOfPlayers => ({
  dice: [],
  rollCount: 0,
  player: 0,
  scoreBoard: range(0, numberOfPlayers).map(createScoreBoard)
});

export const rollReducer = (state, action) => {
  const {dice, selection} = action;
  const {rollCount} = state;

  if (rollCount > 2) {
    throw 'Max three rolls per turn';
  }

  const activeDice = state.rollCount > 0
    ? [...rest(state.dice, selection), ...dice]
    : dice;

  return {
    ...state,
    dice: activeDice,
    rollCount: state.rollCount + 1
  };
};

export const scoreReducer = (state, action) => {

  const {row, selection} = action;

  if (!isValidSelection(state.dice, row, selection)) {
    throw 'Illegal score';
  }

  const updateBoard = (board) => {

    const bonusAchieved =
      board[ScoreBoard.ONES] +
      board[ScoreBoard.TWOS] +
      board[ScoreBoard.THREES] +
      board[ScoreBoard.FOURS] +
      board[ScoreBoard.FIVES] +
      board[ScoreBoard.SIXES];

    return {
      ...board,
      [action.row]: selection.reduce(sum, 0),
      [ScoreBoard.BONUS]: bonusAchieved ? 100 : 0
    }
  };

  return {
    ...state,
    player: (state.player + 1) % state.scoreBoard.length,
    rollCount: 0,
    scoreBoard: state
      .scoreBoard
      .map((board, i) => i === state.player ? updateBoard(board) : board)
  };
};

const reducer = (state, action) => {

  switch (action.type) {

    case 'roll':
      return rollReducer(state, action);

    case 'score':
      return scoreReducer(state, action);

    default:
      throw `Unhandled action type: '${action.type}'`
  }
};

export class Yatzy {

  constructor({numberOfPlayers}, roller) {
    this.state = initialState(numberOfPlayers);
    this.roller = roller;
  }

  score(row, selection) {
    this.state = reducer(this.state, {type: 'score', row, selection});
  }

  cross(row) {
    // todo
  }

  getScoreBoard() {
    return this.state.scoreBoard;
  }

  getScore(playerIndex) {
    return getTotalScore(this.state.scoreBoard)[playerIndex];
  }

  roll(selection = []) {
    const n = selection ? selection.length : 6;
    const dice = this.roller.roll(n);
    this.state = reducer(this.state, {type: 'roll', dice, selection});
    return dice;
  }
}
