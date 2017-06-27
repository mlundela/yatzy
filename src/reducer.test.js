import {shuffle} from 'lodash/collection';
import {scoreReducer} from './reducer';
import {ScoreBoard} from './ScoreBoard';
import {createInitialState, RandomDice, sum} from './utils';

function testRow(row, selection) {
    const s0 = {
        ...createInitialState(1),
        dice: shuffle([...selection, ...RandomDice.roll(6 - selection.length)]),
        rollCount: 1
    };
    const s1 = scoreReducer(s0, {row, selection});
    expect(s1.scoreBoards[0]).toHaveProperty(row, selection.reduce(sum, 0));
}

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

test('Bonus should be 100 if SUM ones through sixes >= 84', () => {

    const state = {
        ...createInitialState(1),
        rollCount: 1,
        dice: [5, 5, 5, 5, 5, 5],
        scoreBoards: [{
            [ScoreBoard.ONES]: 4,
            [ScoreBoard.TWOS]: 8,
            [ScoreBoard.THREES]: 12,
            [ScoreBoard.FOURS]: 16,
            [ScoreBoard.FIVES]: null,
            [ScoreBoard.SIXES]: 24,
        }]
    };

    const action = {row: ScoreBoard.FIVES, selection: [5, 5, 5, 5, 5, 5]};

    const newState = scoreReducer(state, action);

    expect(newState.scoreBoards[0])
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

    expect(newState.scoreBoards[0])
        .toHaveProperty(ScoreBoard.YATZY, 100);

});
