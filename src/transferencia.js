const pool = require("./db");

/**
 * Función que realiza transferencia bancaria segura
 * @param {number} cuentaOrigenId
 * @param {number} cuentaDestinoId
 * @param {number} monto
 */
async function realizarTransferencia(cuentaOrigenId, cuentaDestinoId, monto) {
  const client = await pool.connect(); // obtener cliente único

  try {
    // 1️⃣ Iniciar transacción
    await client.query("BEGIN");

    // 2️⃣ Restar saldo cuenta origen
    const restar = `
      UPDATE cuentas
      SET saldo = saldo - $1
      WHERE id = $2
      RETURNING *;
    `;
    await client.query(restar, [monto, cuentaOrigenId]);

    // 3️⃣ Sumar saldo cuenta destino
    const sumar = `
      UPDATE cuentas
      SET saldo = saldo + $1
      WHERE id = $2
      RETURNING *;
    `;
    await client.query(sumar, [monto, cuentaDestinoId]);

    // 4️⃣ Confirmar transacción
    await client.query("COMMIT");

    console.log("✅ Transferencia exitosa");
  } catch (error) {
    // Si ocurre error revertimos todo
    await client.query("ROLLBACK");
    console.error("❌ Error en transferencia. Se hizo ROLLBACK");
    console.error(error.message);
  } finally {
    // Liberar cliente
    client.release();
  }
}

module.exports = realizarTransferencia;