/**
 * events controller.
 * @module controllers/events
 */

const {v4: uuidv4} = require('uuid');

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

const addUpdate = async(request, respsonse, next) => {
  const newUpdate = request.body;
  eventState.updates.push(newUpdate);
  respsonse.json(newUpdate)
  return sendEventsToAll(newUpdate);
}

module.exports = {
  addUpdate,
  sendEventsToAll,
  eventsHandler,
  eventState,
}