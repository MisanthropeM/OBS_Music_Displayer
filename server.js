import fs from 'node:fs/promises';
import express from 'express';

const PATH_TO_SONG_NAME = './title.txt';
const PATH_TO_ARTIST_NAME = './artist.txt';
const encoding = 'utf8';

const readSongName = async () => {
  const title = await (await fs.readFile(PATH_TO_SONG_NAME, { encoding })).trim();
  const artist = await (await fs.readFile(PATH_TO_ARTIST_NAME, { encoding })).trim();
  if (title) return `${artist} - ${title}\n`;
  else throw new Error('😰 Empty? ');
};

const app = express();

let currentName = await readSongName();
const activeConnections = [];

// Client:
app.get(['', '/', 'index', 'index.html'], async (request, response) => {
  const htmlPage = await fs.readFile('./client/index.html');
  response.set('Content-Type', 'text/html;charset=utf-8');
  response.send(htmlPage);
});
app.get('/script.js', async (req, res) => {
  const file = await fs.readFile('./client/script.js');
  res.set('Content-Type', 'application/javascript');
  res.send(file);
});
app.get('/style.css', async (req, res) => {
  const file = await fs.readFile('./client/style.css');
  res.set('Content-Type', 'text/css');
  res.send(file);
});

// Get song name:
app.get('/song-name', async (request, response) => {
  console.log('😇 connection open ');

  response.set({
    'Content-Type': 'text/event-stream;charset=utf-8',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  });

  response.write('event: message\n'); // <- announce message event
  response.write(`data: ${currentName}\n`); // <- send new name data

  activeConnections.push(response); // <- then add to active connections

  // handle connection stop:
  request.on('close', () => {
    const toDelete = activeConnections.findIndex(r => response === r);
    activeConnections.splice(toDelete, 1); // remove connection
    console.log('🤨 connection closed ');
  });
});

const sendSongs = () => {
  for (const response of activeConnections) {
    response.write('event: message\n'); // <- announce message event
    response.write(`data: ${currentName}\n`); // <- send new name data
  }
};

// Watch file:
const watchFile = async () => {
  const watcher = fs.watch(PATH_TO_SONG_NAME, { encoding });

  try {
    // initial send, useful for retries:
    currentName = await readSongName();
    sendSongs();

    for await (const { eventType } of watcher) {
      if (eventType === 'error') throw new Error('😔 Error when watching file');
      if (eventType === 'change') {
        await new Promise(resolve => setTimeout(resolve, 100)); // sleep 100 because we can attempt to read before it's fully saved
        currentName = await readSongName();
        console.log(`   😎 new song name: ${currentName}`);
        sendSongs();
      }
    }
  } catch (e) { // on error, retry a bit later:
    console.error(e);
    setTimeout(() => {
      console.log('😐 retrying watch...');
      watchFile();
    }, 50);
  }
};

watchFile();

app.listen(3000);
