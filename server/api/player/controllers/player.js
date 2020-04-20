const { sanitizeEntity, parseMultipartData } = require('strapi-utils');

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
  async findOneOrCreate (ctx, room) {
    let player = ctx.session.player;
    if (player) {
      player = await strapi.services.player.findOne({id: player.id});
    } else {
      player = await strapi.services.player.create({
        name: `user-${generateUID()}`,
        room: room && room.id
      });
    }
    ctx.session.player = player;
    return player;
  },
  async me (ctx) {
    const player = await this.findOneOrCreate(ctx);
    return sanitizeEntity(player, { model: strapi.models.player });
  },
  async update(ctx) {
    let player;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      player = await strapi.services.player.update(ctx.params, data, {
        files,
      });
    } else {
      player = await strapi.services.player.update(
        ctx.params,
        ctx.request.body
      );
    }

    const room = await strapi.services.room.findOne({id: player.room.id});
    const updateToSend = {
      type: 'ROOM_UPDATE',
      payload: sanitizeEntity(room, { model: strapi.models.room })
    };
    strapi.io.sockets.in(room.identifiant).emit('message', JSON.stringify(updateToSend));

    return sanitizeEntity(player, { model: strapi.models.player });
  },
};
