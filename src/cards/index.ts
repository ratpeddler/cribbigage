import { clubs } from "./clubs";
import { spades } from "./spades";
import { hearts } from "./hearts";
import { diamonds } from "./diamonds";
import { Suit } from "../game/card";

interface Deck {
  Clubs: ReadonlyArray<string>;
  Spades: ReadonlyArray<string>;
  Diamonds: ReadonlyArray<string>;
  Hearts: ReadonlyArray<string>;
}

export const deck_images: Map<Suit, ReadonlyArray<string>> = new Map([
  ["Clubs", clubs],
  ["Spades", spades],
  ["Diamonds", diamonds],
  ["Hearts", hearts],
]);
