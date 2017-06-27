import {groupBy} from 'lodash/collection';
import {intersection} from 'lodash/array';
import {range} from 'lodash/util';

import {ScoreBoard} from './ScoreBoard';

export const isBonusAchieved = board =>
    board[ScoreBoard.ONES] +
    board[ScoreBoard.TWOS] +
    board[ScoreBoard.THREES] +
    board[ScoreBoard.FOURS] +
    board[ScoreBoard.FIVES] +
    board[ScoreBoard.SIXES] >= 84;

export const sum = (acc, curr) => acc + curr;

export const rest = (superset, subset) => {
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
        case ScoreBoard.CHANCE:
            return selection.length === 6;
        case ScoreBoard.YATZY:
            return isGroupOf(6);
        default:
            return true;
    }
};

export const createScoreBoard = () => Object
    .values(ScoreBoard)
    .reduce((obj, row) => ({...obj, [row]: null}), {});

export const getTotalScore = scoreBoard => scoreBoard
  .map(b => Object
    .values(b)
    .reduce(sum, 0));

export const createInitialState = numberOfPlayers => ({
    dice: [],
    rollCount: 0,
    player: 0,
    tokens: range(0, numberOfPlayers).map(() => 0),
    scoreBoards: range(0, numberOfPlayers).map(createScoreBoard)
});

export const RandomDice = {
    roll: n => range(0, n)
        .map(() => Math.floor((Math.random() * 6) + 1))
};
