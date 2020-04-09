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
  async me (ctx) {
    const player = ctx.state.session.player ? ctx.state.session.player : await strapi.services.player.create({
      name: `user-${generateUID()}`
    });
    return sanitizeEntity(player, { model: strapi.models.player });
  }
};
