/**
 * events controller.
 * @module controllers/events
 */

const {v4: uuidv4} = require('uuid');
const controller = require("./index");
const {Contact} = require("../../db/models");

const eventState = {
  clients: [],
  updates: [],
};

const eventsHandler = (request, response, next) => {
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  response.writeHead(200, headers);

  const data = `data: ${JSON.stringify(eventState.updates)}\n\n`;

  response.write(data);

  const clientId = uuidv4();

  const newClient = {
    id: clientId,
    response
  };

  eventState.clients.push(newClient);

  request.on('close', () => {
    console.log(`${clientId} Connection closed`);
    eventState.clients = eventState.clients.filter(client => client.id !== clientId);
  });
}

const sendEventsToAll = (newData) => {
  eventState.clients.forEach(client => client.response.write(`data: ${JSON.stringify(newData)}\n\n`))
}
/*!
* @api {PUT} /contact/:id Updates contact info with real time events
* @apiVersion 0.0.1
* @apiName addUpdate
*
*/
const addUpdate = async(req, res, next) => {
  const newUpdate = req.body;
  Contact.update(newUpdate, {
    where: {id: req.params.id},
    returning: true,
    individualHooks: true,
  })
    .then(results => {
      const updatedContact = results[1][0];
      eventState.updates.push(newUpdate);
      res.json({
        message: 'Updated contact with id ' + updatedContact.id,
        contact: updatedContact
      })
      return sendEventsToAll(newUpdate);
    })
    .catch(next);

}
/*!
* @api {GET} /events Gets event status
* @apiVersion 0.0.1
* @apiName addUpdate
*
*/
const getStatus = (request, respsonse) => {
  return respsonse.json({clients: eventState.clients.length})
}

module.exports = {
  addUpdate,
  sendEventsToAll,
  eventsHandler,
  getStatus,
  eventState,
}