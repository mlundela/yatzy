import inquirer from 'inquirer';
import {Yatzy} from '../Yatzy';
import {ScoreBoard} from '../ScoreBoard';

const game = new Yatzy({numberOfPlayers: 1});

const toString = value => value.toString();

const toInt = value => parseInt(value);

const promptAction = (selection = null) => {
    console.log('Dice:', game.state.dice);
    inquirer.prompt([{
        type: "list",
        name: "action",
        message: "Choose your action",
        choices: [
            "Roll",
            "Score"
        ]
    }]).then(({action}) => {
        if (action === "Roll") {
            promptRoll();
        }
        else if (action === "Score") {
            promptScore();
        }
    });
};

const promptRoll = () => {
    if(game.state.rollCount === 0) {
        game.roll(null);
        promptAction();
    } else {
        inquirer.prompt([{
            type: "checkbox",
            name: "selection",
            message: "Which dice do you want to roll",
            choices: game.state.dice.map(toString)
        }])
        .then(({selection}) => {
            game.roll(selection.map(toInt));
        })
        .then(promptAction);
    }
};

const promptScore = () =>
    inquirer.prompt([
    {
        type: "checkbox",
        name: "selection",
        message: "Select the dice you want to score",
        choices: game.state.dice.map(toString)
    },
    {
        type: "list",
        name: "row",
        message: "Where do you want to place your score?",
        choices: Object.values(ScoreBoard)
    }
    ]).then(({ row, selection }) => {
        game.score(row, selection.map(toInt));
        console.log(game.state.scoreBoards);
    })

promptAction();