import inquirer from 'inquirer';
import {Yatzy} from '../Yatzy';
import {ScoreBoard} from '../ScoreBoard';

const game = new Yatzy({numberOfPlayers: 1});

const promptAction = (selection = null) =>
    inquirer.prompt([{
        type: "list",
        name: "action",
        message: "Choose your action",
        choices: [
            "Score",
            "Cross",
            "Roll",
            "Show scoreboard"
        ]
    }]).then(({ action }) => {
        if(action === "Roll") {
            game.roll(selection);
            console.log('Dice:', game.state.dice);
            promptAction();
        }
        else if(action === "Score") {
            promptRow();
        }
    });

const promptRow = () =>
    inquirer.prompt([
    {
        type: "checkbox",
        name: "selection",
        message: "Select the dice you want to score",
        choices: game.state.dice.map(value => value.toString())
    },
    {
        type: "list",
        name: "row",
        message: "Where do you want to place your score?",
        choices: Object.values(ScoreBoard)
    }
    ]).then(({ row, selection }) => {
        game.score(row, selection.map(stringValue => parseInt(stringValue)));
        console.log(game.state.scoreBoards);
    })

promptAction();