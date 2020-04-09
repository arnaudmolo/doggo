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
    // const nsp = strapi.io.of(`/${identifiant}`);
    return sanitizeEntity(entity, { model: strapi.models.room });
  },
  async join (ctx) {
    let entity = await strapi.services.room.findOne({identifiant: ctx.params.identifiant});
    console.log(ctx.state);
    const player = ctx.state.session.player ? ctx.state.session.player : await strapi.services.player.create({
      name: `user-${generateUID()}`,
      room: entity.id,
    });
    ctx.state.session.player = player;
    entity = await strapi.services.room.update(
      {id: entity.id},
      {players: [...entity.players, player.id], gamemaster: entity.gamemaster || entity });
    // strapi
    //   .io
    //   .sockets
    //   .in(ctx.params.identifiant)
    //   .emit('message', JSON.stringify({
    //     type: 'NEW_PLAYER', payload: ctx.state.session.player
    //   }));
    return sanitizeEntity(entity, { model: strapi.models.room });
  }
};
