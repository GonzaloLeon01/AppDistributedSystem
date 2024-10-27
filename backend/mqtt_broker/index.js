import { connect } from "mqtt";

const express = require("express");
const app = express();
const port = 3000;

const client = connect("mqtt://localhost:1883");
let lastPressure = null;
const topico_presion = "pressure";
const topico_valvula = "valve";
const topico_bomba = "pump";

app.get("/pressure", (req, res) => {
  res.json({
    presion: lastPressure || -1,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.post("/valvula", (req, res) => {
  const estado_valvula = req.body?.status;
  if (!estado_valvula || estado_valvula == "OFF" || estado_valvula == "ON") {
    //Si el estado es undefines
    return res.send(400);
  } else {
    client.publish(topico_valvula, estado_valvula);
    return res.send(200);
  }
});

app.post("/bomba", (req, res) => {
  const estado_bomba = req.body?.status;
  if (!estado_bomba || estado_bomba == "OPEN" || estado_bomba == "CLOSE") {
    //Si el estado es undefines
    return res.send(400);
  } else {
    client.publish(topico_bomba, estado_bomba);
    return res.send(200);
  }
});

client.on("connect", () => {
  client.subscribe(topico, (err) => {
    if (err) {
      console.error("Subscription error:", err);
    }
  });
});

client.on("message", (topic, message) => {
  if (topic === topico_presion) {
    lastPressure = message;
  }
  client.end();
});

client.on("error", (err) => {
  console.error("Connection error:", err);
});
