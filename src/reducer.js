import {rest, isValidSelection, sum, isBonusAchieved} from './utils';
import {ScoreBoard} from './ScoreBoard';

export const crossReducer = (state, action) => {
  const updateBoard = (board) => {
    return {
      ...board,
      [action.row]: 0
    }
  };

  return {
    ...state,
    player: (state.player + 1) % state.scoreBoards.length,
    rollCount: 0,
    tokens: state
      .tokens
      .map((count, i) => i === state.player ? count + (3 - state.rollCount) : count),
    scoreBoards: state
      .scoreBoards
      .map((board, i) => i === state.player ? updateBoard(board) : board)
  };
};

export const rollReducer = (state, action) => {
  const {dice, selection} = action;
  const {rollCount} = state;

  if (rollCount > 2 && !state.tokens[state.player]) {
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

  const isRowDone = state.scoreBoards[state.player][action.row] !== null;
  const isDiceRolled = state.rollCount > 0;

  if (isRowDone || !isDiceRolled || !isValidSelection(state.dice, row, selection)) {
    throw 'Illegal score';
  }

  const updateBoard = (board) => {
    const updatedBoard = {
      ...board,
      [action.row]: action.row === ScoreBoard.YATZY ? 100 : selection.reduce(sum, 0)
    };
    return {
      ...updatedBoard,
      [ScoreBoard.BONUS]: isBonusAchieved(updatedBoard) ? 100 : 0
    }
  };

  return {
    ...state,
    player: (state.player + 1) % state.scoreBoards.length,
    rollCount: 0,
    tokens: state
      .tokens
      .map((count, i) => i === state.player ? count + (3 - state.rollCount) : count),
    scoreBoards: state
      .scoreBoards
      .map((board, i) => i === state.player ? updateBoard(board) : board)
  };
};

export const reducer = (state, action) => {

  switch (action.type) {

    case 'roll':
      return rollReducer(state, action);

    case 'score':
      return scoreReducer(state, action);

    case 'cross':
      return crossReducer(state, action);

    default:
      throw `Unhandled action type: '${action.type}'`
  }
};
