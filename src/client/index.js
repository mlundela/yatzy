import inquirer from 'inquirer';
import {Yatzy} from '../Yatzy';
import {ScoreBoard} from '../ScoreBoard';

const toString = value => value.toString();
const toInt = value => parseInt(value);

const game = new Yatzy({numberOfPlayers: 1});

const promptAction = () => {
    console.info(game.state.dice);
    console.info(`You have ${3 - game.state.rollCount} rolls left and ${game.getTokens(game.state.player)} tokens`);
    inquirer.prompt([{
        type: "list",
        name: "action",
        message: "Choose your action",
        choices: [
            "Roll",
            "Score",
            "Cross"
        ]
    }]).then(({action}) => {
        if (action === "Roll") {
            promptRoll();
        }
        else if (action === "Score") {
            promptScore();
        }
        else if (action === "Cross") {
            promptCross();
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
        .then(promptAction)
        .catch(promptAction);
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
    ])
    .then(({ row, selection }) => {
        game.score(row, selection.map(toInt));
        console.info(game.state.scoreBoards);
    })
    .then(promptAction)
    .catch(promptAction);

const promptCross = () =>
    inquirer.prompt([
        {
            type: "list",
            name: "row",
            message: "Which row do you want to cross?",
            choices: Object.values(ScoreBoard)
        },
        {
            type: "confirm",
            name: "confirmed",
            message: "Are you sure?"
        }
    ])
    .then(({ row, confirmed }) => {
        if(confirmed) {
            game.cross(row);
        }
        console.info(game.state.scoreBoards);
    })
    .then(promptAction)
    .catch(promptAction);

const play = () =>
{
    promptAction();
};

play();