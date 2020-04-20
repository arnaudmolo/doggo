import Card from './Card';

interface Player {
  readonly id: number;
  readonly name: string;
  readonly color?: string;
  readonly cards?: {
    hand: Card[];
    gift: {
      card: Card;
      from: Player;
    };
  }
}

export default Player;
