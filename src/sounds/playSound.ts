const shuffle_cards = require("./cards/shuffle_cards.mp3");
const deal_card = require("./cards/deal_card.mp3");
const play_card = require("./cards/play_card.mp3");

export const playShuffleSound = () => {
    var audio = new Audio(shuffle_cards);
    audio.volume = .25;
    audio.play();
}

export const playDealSound = () => {
    var audio = new Audio(deal_card);
    audio.volume = .25;
    audio.play();
}

export const playCardSound = () => {
    var audio = new Audio(play_card);
    audio.play();
}

export const Repeat = (action: () => void, count: number, interval: number) => {
    if (count > 0) {
        action();
        setTimeout(() => {
            Repeat(action, count - 1, interval);
        }, interval);
    }
}

const score_1 = require("./scores/Score1.wav");
const score_2 = require("./scores/Score2.wav");
const score_3 = require("./scores/Score3.wav");
const score_4 = require("./scores/Score4.wav");
const score_5 = require("./scores/Score5.wav");

export const playScoreSound = (score: number) => {
    var audio = null;
    switch (score) {
        case 1:
            audio = new Audio(score_1);
            break;
        case 2:
            audio = new Audio(score_2);
            break;
        case 3:
            audio = new Audio(score_3);
            break;
        case 4:
            audio = new Audio(score_4);
            break;
        case 5:
            audio = new Audio(score_5);
            break;
    }
    if (audio) audio.volume = .25;

    audio?.play();
}

const knock = require("./misc/knock.wav");
export const playKnockSound = () => {
    var audio = new Audio(knock);
    audio.play();
}

const check = require("./misc/check.wav");
export const playCheckSound = () => {
    var audio = new Audio(check);
    audio.play();
}

const tap = require("./misc/tap.wav");
export const playTapSound = () => {
    var audio = new Audio(tap);
    audio.volume = .5;
    audio.play();
}