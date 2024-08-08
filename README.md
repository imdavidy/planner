# Planner

## Contacts
On root page, it has a link *contact* at the middle of the page, under the title "Planner".
Initially it was designed to house two different features but the second was not included.


This app contains basic structure for a single page application for storing and updating contacts.
It also receives events for any update on contact being updated while on the same contact page.
- The backend implementation of the event store is in memory due to lack of time to implement on a dedicated service.
- Client side can subscribe on terminal via `curl -H Accept:text/event-stream http://localhost:3000/api/events; ` command
- Currently on the UI only displays the triggered events as a console.log as it was not determined if not being on the browser to trigger the event may be causing the UI not to render.

After having Postgresql installed, please run db-init.sh to create DB for testing.
- run `npm i` for modules.
- run `npm run build && npm run dev` for client side app.
- run `node server/index.js` for db and backend.

ps. some structures were left inplace for possible future use;
No testing and documentations was included due to time limitations;