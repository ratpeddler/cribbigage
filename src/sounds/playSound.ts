const shuffle_cards = require("./shuffle_cards.mp3");
const deal_card = require("./deal_card.mp3");
const play_card = require("./play_card.mp3");

export const playShuffleSound = () => {
    var audio = new Audio(shuffle_cards);
    audio.play();
}

export const playDealSound = () => {
    var audio = new Audio(deal_card);
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