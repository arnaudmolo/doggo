const { sanitizeEntity } = require('strapi-utils');
const { range } = require('ramda');

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

module.exports = {
  async create () {
    const identifiant = generateUID();
    const entity = await strapi.services.room.create({
      identifiant,
      cards: {
        deck: shuffleArray(['Hearts', 'Tiles', 'Clovers', 'Pikes'].reduce(
          (deck, family) => [...deck, ...range(1, 14).map(value => ({value, family}))]
          , []
        )),
        cemetery: [],
      }
    });
    return sanitizeEntity(entity, { model: strapi.models.room });
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
      player = await strapi.services.player.update({id: player.id}, {room: room.id});
    } else if (player.room.id !== room.id) {
      // TODO: remove ce load inutile en fait ptn
      const wrongRoom = await strapi.services.room.findOne({id: player.room.id});
      console.log(wrongRoom);
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
    console.log('ici', room);
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
