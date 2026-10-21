# Racer 2D

Juego de carreras 2D con bots, garaje, creador de pistas, amigos, chat y multijugador (hasta 100 jugadores por sala).

## Probar en tu computadora

```bash
npm install
npm start
```

Abre `http://localhost:3000` en el navegador.

## Subir a Render (Web Service)

- **Build Command:** `npm install`
- **Start Command:** `node server.js`
- No hace falta una variable de entorno; Render asigna el `PORT` solo.

Usa **Web Service** y no Static Site, porque el multijugador y el chat necesitan `server.js`.

## Notas

- Las cuentas se guardan en el navegador del jugador, no en el servidor.
- El dinero es virtual y no tiene valor real.
- El carro inicial es un F1 que llega a 178 km/h.
