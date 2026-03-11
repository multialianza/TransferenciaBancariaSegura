# TransferenciaBancariaSegura
🛠️ E4-M7 Ejercicio
Transacción de Transferencia Bancaria Segura 🏦
Objetivo: Comprender y aplicar el concepto de transacciones en bases de datos para garantizar la integridad de los datos. Simularás una transferencia bancaria, una operación crítica donde es fundamental que todos los pasos se completen con éxito o, de lo contrario, ninguno lo haga, evitando así inconsistencias como la pérdida de dinero.

Prerrequisitos:

Tener tu conexión a la base de datos configurada (pool).

Necesitas una tabla cuentas. Conéctate a tu base de datos y ejecuta la siguiente sentencia SQL para crearla y poblarla:

-- Crear la tabla de cuentas
CREATE TABLE cuentas (
    id SERIAL PRIMARY KEY,
    titular VARCHAR(100) NOT NULL,
    saldo DECIMAL(10, 2) CHECK (saldo >= 0) -- El saldo no puede ser negativo
);

-- Insertar dos cuentas de ejemplo
INSERT INTO cuentas (titular, saldo) VALUES
('Juan Pérez', 1000.00),
('María López', 500.00);

 
Instrucciones:

Crearás una única función asíncrona que encapsule toda la lógica de la transferencia. Dentro de esta función, obtendrás un cliente del pool y lo usarás para todas las operaciones de la transacción.

Define la Función Principal:

Crea una función async llamada realizarTransferencia que acepte tres parámetros: cuentaOrigenId, cuentaDestinoId y monto.

Obtén un Cliente del Pool:

La primera acción dentro de un bloque try...catch...finally debe ser obtener un cliente del pool: const client = await pool.connect();. Todas las operaciones siguientes (BEGIN, UPDATE, COMMIT, ROLLBACK) deben ejecutarse sobre este client, no sobre el pool.

Inicia la Transacción:

Dentro del bloque try, la primera consulta que debes ejecutar es await client.query('BEGIN');. Esto le indica a la base de datos que las siguientes operaciones forman parte de un bloque atómico.

Ejecuta las Operaciones de la Transferencia:

Resta el saldo de la cuenta de origen. Escribe una consulta UPDATE parametrizada para restar el monto del saldo de la cuentaOrigenId.

Suma el saldo a la cuenta de destino. Escribe una segunda consulta UPDATE parametrizada para sumar el monto al saldo de la cuentaDestinoId.

Simulación de Error (Opcional pero recomendado): Para probar el ROLLBACK, puedes introducir un error a propósito entre las dos actualizaciones, como intentar ejecutar una consulta SQL inválida.

Confirma la Transacción:

Si ambas actualizaciones se ejecutan sin errores, la última consulta dentro del try debe ser await client.query('COMMIT');. Esto guarda permanentemente todos los cambios realizados desde el BEGIN.

Imprime un mensaje de éxito en la consola.

Maneja los Errores con ROLLBACK:

En el bloque catch, si cualquier promesa dentro del try es rechazada, la ejecución saltará aquí.

Lo primero que debes hacer es revertir la transacción con await client.query('ROLLBACK');. Esto deshará todos los cambios realizados desde el BEGIN, asegurando que la base de datos vuelva a su estado original.

Imprime un mensaje de error en la consola, indicando que la transacción fue revertida.

Libera al Cliente:

En el bloque finally, que se ejecuta siempre (haya éxito o error), es crucial liberar el cliente para que pueda ser reutilizado por otras partes de tu aplicación: client.release();.

Ejecución y Pruebas:

Llama a tu función realizarTransferencia con los IDs de las cuentas y un monto. Prueba varios escenarios:

Transferencia exitosa: realizarTransferencia(1, 2, 100.00);

Transferencia con error (saldo insuficiente): La restricción CHECK (saldo >= 0) en la tabla hará que el UPDATE falle si intentas restar más dinero del que hay. La transacción debería revertirse automáticamente. realizarTransferencia(2, 1, 600.00);

Conceptos a Aplicar:

Atomicidad (ACID): El principio fundamental de las transacciones. Una transacción es una unidad de trabajo "todo o nada".

BEGIN: La sentencia SQL que marca el inicio de un bloque de transacción.

COMMIT: La sentencia SQL que confirma y guarda permanentemente todos los cambios realizados dentro de la transacción.

ROLLBACK: La sentencia SQL que revierte y deshace todos los cambios realizados dentro de la transacción, devolviendo la base de datos al estado en que se encontraba antes del BEGIN.

Cliente de Pool (pool.connect()): Para las transacciones, es esencial obtener un único cliente y ejecutar todas las operaciones sobre él para asegurar que se realicen dentro de la misma sesión de base de datos.

client.release(): El método para devolver un cliente al pool, crucial para evitar que tu aplicación agote las conexiones disponibles.

Entrega:

El trabajo deberá ser entregado a través de un repositorio público en GitHub. No incluyas tus credenciales de conexión. Por favor, comparte únicamente el enlace a dicho repositorio. 📤
