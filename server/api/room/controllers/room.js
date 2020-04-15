const { sanitizeEntity } = require('strapi-utils');
const { range, flatten, splitAt } = require('ramda');

function generateUID () {
  // I generate the UID from two parts here
  // to ensure the random number provide enough bits.
  var firstPart = (Math.random() * 46656) | 0;
  var secondPart = (Math.random() * 46656) | 0;
  firstPart = ('000' + firstPart.toString(36)).slice(-3);
  secondPart = ('000' + secondPart.toString(36)).slice(-3);
  return firstPart + secondPart;
}

function shuffleArray (array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
const generateDeck = (deckId) => {
  return ['Hearts', 'Tiles', 'Clovers', 'Pikes'].reduce(
    (deck, family) => [
      ...deck,
      ...range(1, 14).map(value => ({value, family, id: generateUID()})),
    ]
    , [
      {value: 14, family: 'black', id: generateUID()},
      {value: 14, family: 'red', id: generateUID()}
    ]
  );
};

const COLORS = ['blue', 'green', 'white', 'yellow', 'red', 'black'];
const points = flatten(COLORS.map((color, i) => range(i * 4, (i * 4) + 4).map(index => ({position: 96 + index, color: color}))));
module.exports = {
  async create () {
    const identifiant = generateUID();
    const entity = await strapi.services.room.create({
      identifiant,
      cards: {
        deck: shuffleArray([...generateDeck(1), ...generateDeck(2)]),
        cemetery: [],
      },
      pawns: {
        value: points
      }
    });
    return sanitizeEntity(entity, { model: strapi.models.room });
  },
  async draw (ctx) {
    console.log('huuuu', ctx.params.id);
    let room = await strapi.services.room.findOne(
      {id: ctx.params.id}
    );
    // console.log('et bien', room);
    let deck = room.cards.deck;
    const updatedPlayers = await Promise.all(room.players.map(
      async (player) => {
        const [start, end] = splitAt(ctx.params.nb, deck);
        deck = end;
        if (player.socket) {
          const socket = strapi.io.sockets.connected[player.socket];
          if (socket) {
            console.log('oui');
            socket.emit(
              'message',
              JSON.stringify({type: 'UPDATE_PLAYER', payload: start})
            );
          }
        }
        // Si ca plante il fautre mettre cards.value
        return await strapi.services.player.update({
          id: player.id
        }, {
          cards: { 
            hand: start,
            gift: null,
          }
        });
      }
    ));
    // var clients = strapi.io.sockets.clients(room.identifiant); // all users from room `room`
    console.log('draw', updatedPlayers, room.players);
    const newRoom = await strapi.services.room.update({id: room.id}, {
      cards: {
        ...room.cards,
        deck: deck,
      }
    });
    return sanitizeEntity(newRoom, { model: strapi.models.room });
  },
  async join (ctx) {
    let room = await strapi.services.room.findOne(
      {identifiant: ctx.params.identifiant}
    );
    if (!room) {
      ctx.notFound('no room with this id');
      return;
    }
    let player = await strapi.controllers.player.findOneOrCreate(ctx, room);
    if (!player.room) {
      player = await strapi.services.player.update({id: player.id}, {room: room.id, cards: {hand: [], gift: null}});
    } else if (player.room.id !== room.id) {
      // TODO: remove ce load inutile en fait ptn
      const wrongRoom = await strapi.services.room.findOne({id: player.room.id});
      player = await strapi.services.player.update({id: player.id}, {room: room.id, cards: {hand: [], gift: null}});
      await strapi.services.room.update(
        {id: wrongRoom.id},
        {
          players: wrongRoom.players.filter(
            otherPlayer => otherPlayer.id !== player.id
          )
        }
      );
    }
    // const previousRoom = player.room.id
    room = await strapi.services.room.update(
      {id: room.id},
      {
        players: [...room.players, player.id],
        gamemaster: (room.gamemaster && room.gamemaster.id) || player.id
      }
    );
    return sanitizeEntity(room, { model: strapi.models.room });
  },
};
