const express = require('express');

const app = express();

require('./startup/dependencies')(app);
require('./startup/routes')(app);
require('./startup/database-connection');

const port = process.env.PORT || 9090;

app.listen(port, () => console.log(`Listening to port ${port}...`));