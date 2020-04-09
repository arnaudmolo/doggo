'use strict';

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/3.0.0-beta.x/concepts/configurations.html#bootstrap
 */

module.exports = () => {
  const io = require('socket.io')(strapi.server);
  io.on('connect', socket => {
    // listen for user diconnect
    socket.on('room', (room) => {
      socket.join(room);
    });
  });
  strapi.io = io; // register socket io inside strapi main object to use it globally anywhere
};
