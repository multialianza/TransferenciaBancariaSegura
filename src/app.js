const express = require("express");
const realizarTransferencia = require("./transferencia");

const app = express();
app.use(express.json());

/**
 * Endpoint para transferir dinero
 * POST /transferir
 */
app.post("/transferir", async (req, res) => {
  const { origen, destino, monto } = req.body;

  await realizarTransferencia(origen, destino, monto);

  res.send("Transferencia procesada. Revisar consola.");
});

app.listen(3000, () => {
  console.log("Servidor en puerto 3000");
});

