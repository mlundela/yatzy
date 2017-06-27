import inquirer from 'inquirer';
import {Yatzy} from '../Yatzy';
import {ScoreBoard} from '../ScoreBoard';
import CliTable from 'cli-table2';

const toString = value => value.toString();
const toInt = value => parseInt(value);

const game = new Yatzy({numberOfPlayers: 1});

const displayDice = () => {
    const table = new CliTable({
        head: [1,2,3,4,5,6].map(i => `Terning ${i}`)
    });
    table.push(game.state.dice);
    console.log(table.toString());
};

const displayScoreBoard = () => {
    const table = new CliTable({
        head: Object.values(ScoreBoard).map(key => key.toUpperCase())
    });
    table.push(Object.values(game.state.scoreBoards[game.state.player]));
    console.log(table.toString());
};

const promptAction = () => {
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
        displayDice();
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
            displayDice();
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
        displayScoreBoard();
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
        displayScoreBoard();
    })
    .then(promptAction)
    .catch(promptAction);

const play = () =>
{
    promptAction();
};

play();