import Card from './Card';

interface Player {
  readonly id: number;
  readonly name: string;
  readonly cards: Card[];
}

export default Player;
