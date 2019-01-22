// init project
const express = require('express');
const app = express();

const port = 9900;

app.use(express.static('public'));

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/public/src/index.html');
});

const listener = app.listen(port, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
