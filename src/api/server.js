import express from 'express';
import router from './routes/index.js';


const app = express();
const hostname = '0.0.0.0';
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/', router);


// Connecting to server and listening on port
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// Prevent Node from exiting prematurely
setInterval(() => {}, 1000 * 60 * 60);