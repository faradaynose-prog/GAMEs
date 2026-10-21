// Servidor de Racer 2D: sirve index.html y maneja la sala multijugador (máx. 100 jugadores) y el chat.
const http = require('http');
const fs = require('fs');
const path = require('path');
const {WebSocketServer} = require('ws');

const PORT = process.env.PORT || 3000;
const MAX_PLAYERS = 100;
const players = new Map(); // ws -> {name, x, y, a, v, color, pos}

const server = http.createServer((req, res) => {
  fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
    if (err) { res.writeHead(500); return res.end('Error al cargar el juego'); }
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(data);
  });
});

const wss = new WebSocketServer({server});

function send(ws, obj) {
  if (ws.readyState === 1) ws.send(JSON.stringify(obj));
}
function broadcast(obj) {
  const s = JSON.stringify(obj);
  for (const ws of players.keys()) if (ws.readyState === 1) ws.send(s);
}

wss.on('connection', ws => {
  ws.on('message', raw => {
    let m;
    try { m = JSON.parse(raw); } catch (e) { return; }

    if (m.t === 'join') {
      if (players.has(ws)) return;
      if (players.size >= MAX_PLAYERS) { send(ws, {t: 'full'}); ws.close(); return; }
      players.set(ws, {name: String(m.name || 'Piloto').slice(0, 16), x: 0, y: 0, a: 0, v: 0, color: '#ffffff', pos: false});
    } else if (m.t === 'pos') {
      const p = players.get(ws);
      if (!p) return;
      p.x = +m.x || 0; p.y = +m.y || 0; p.a = +m.a || 0; p.v = +m.v || 0;
      p.color = String(m.color || '#ffffff').slice(0, 9);
      p.pos = true;
    } else if (m.t === 'chat') {
      const p = players.get(ws);
      if (!p) return;
      const text = String(m.text || '').slice(0, 140);
      if (text) broadcast({t: 'chat', name: p.name, text});
    }
  });
  ws.on('close', () => { players.delete(ws); });
});

// Estado de la sala 10 veces por segundo
setInterval(() => {
  const list = [], online = [];
  for (const p of players.values()) {
    online.push(p.name);
    if (p.pos) list.push({name: p.name, x: p.x, y: p.y, a: p.a, v: p.v, color: p.color});
  }
  broadcast({t: 'state', players: list, online});
}, 100);

server.listen(PORT, () => console.log('Racer 2D en el puerto ' + PORT));
