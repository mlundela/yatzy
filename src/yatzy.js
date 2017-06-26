import {reducer} from './reducer';
import {createInitialState, RandomDice, getTotalScore} from './utils';

export class Yatzy {

  constructor({numberOfPlayers}, dice = RandomDice) {
    this.state = createInitialState(numberOfPlayers);
    this.dice = dice;
  }

  score(row, selection) {
    this.state = reducer(this.state, {type: 'score', row, selection});
  }

  cross(row) {
    this.state = reducer(this.state, {type: 'cross', row});
  }

  getScoreBoard() {
    return this.state.scoreBoards;
  }

  getScore(playerIndex) {
    return getTotalScore(this.state.scoreBoards)[playerIndex];
  }

  getTokens(playerIndex) {
    return this.state.tokens[playerIndex];
  }

  roll(selection = []) {
    const n = selection ? selection.length : 6;
    const dice = this.dice.roll(n);
    this.state = reducer(this.state, {type: 'roll', dice, selection});
    return dice;
  }
}
