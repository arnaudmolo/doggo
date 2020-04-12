const { sanitizeEntity } = require('strapi-utils');

function generateUID () {
  // I generate the UID from two parts here
  // to ensure the random number provide enough bits.
  var firstPart = (Math.random() * 46656) | 0;
  var secondPart = (Math.random() * 46656) | 0;
  firstPart = ('000' + firstPart.toString(36)).slice(-3);
  secondPart = ('000' + secondPart.toString(36)).slice(-3);
  return firstPart + secondPart;
}

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async create () {
    const identifiant = generateUID();
    const entity = await strapi.services.room.create({identifiant});
    return sanitizeEntity(entity, { model: strapi.models.room });
  },
  async join (ctx) {
    let room = await strapi.services.room.findOne(
      {identifiant: ctx.params.identifiant}
    );
    let player = await strapi.controllers.player.findOneOrCreate(ctx, room);
    if (!player.room) {
      player = await strapi.services.player.update({id: player.id}, {room: room.id});
    } else if (player.room.id !== room.id) {
      // TODO: remove ce load inutile en fait ptn
      const wrongRoom = await strapi.services.room.findOne({id: player.room.id});
      await strapi.services.room.update(
        wrongRoom, {
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
