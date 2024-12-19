const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configurar conexión a la base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
// Probar conexión a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
    } else {
        console.log('Conectado a la base de datos MySQL');
    }
});

// Rutas básicas
app.get('/', (req, res) => {
    res.send('Servidor funcionando');
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

// Obtener todas las personas
app.get('/personas', (req, res) => {
    const query = 'SELECT * FROM PERSONA';
    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Obtener una persona por ID
app.get('/personas/:id', (req, res) => {
    const query = 'SELECT * FROM PERSONA WHERE id = ?';
    const id = req.params.id;
    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results[0]);
    });
});

// Crear una nueva persona
app.post('/personas', (req, res) => {
    const { nombre, telefono, edad, sexo, VIVIENDA_id_viv, dependiente_de } = req.body;
    const query = `INSERT INTO PERSONA (nombre, telefono, edad, sexo, VIVIENDA_id_viv, dependiente_de) VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(query, [nombre, telefono, edad, sexo, VIVIENDA_id_viv, dependiente_de], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ id: results.insertId, ...req.body });
    });
});

// Actualizar una persona
app.put('/personas/:id', (req, res) => {
    const id = req.params.id;
    const { nombre, telefono, edad, sexo, VIVIENDA_id_viv, dependiente_de } = req.body;
    const query = `UPDATE PERSONA SET nombre = ?, telefono = ?, edad = ?, sexo = ?, VIVIENDA_id_viv = ?, dependiente_de = ? WHERE id = ?`;
    db.query(query, [nombre, telefono, edad, sexo, VIVIENDA_id_viv, dependiente_de, id], (err) => {
        if (err) return res.status(500).send(err);
        res.send('Persona actualizada correctamente');
    });
});



// Eliminar una persona
app.delete('/personas/:id', (req, res) => {
    const id = req.params.id;
    const query = `DELETE FROM PERSONA WHERE id = ?`;
    db.query(query, [id], (err) => {
        if (err) return res.status(500).send(err);
        res.send('Persona eliminada correctamente');
    });
});

// Obtener todas las viviendas
app.get('/viviendas', (req, res) => {
    const query = 'SELECT * FROM VIVIENDA';
    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Obtener una vivienda por ID
app.get('/viviendas/:id', (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM VIVIENDA WHERE id_viv = ?';
    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results[0]);
    });
});

// Endpoint para agregar una nueva vivienda
app.post('/viviendas', (req, res) => {
    const { direccion, capacidad, niveles, MUNICIPIO_id_mun } = req.body;
    const query = `
        INSERT INTO VIVIENDA (direccion, capacidad, niveles, MUNICIPIO_id_mun) 
        VALUES (?, ?, ?, ?)
    `;
    db.query(query, [direccion, capacidad, niveles, MUNICIPIO_id_mun], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).send('Vivienda agregada correctamente');
    });
});

// Endpoint para modificar una vivienda
app.put('/viviendas/:id', (req, res) => {
    const id = req.params.id;
    const { direccion, capacidad, niveles, MUNICIPIO_id_mun } = req.body;
    const query = `
        UPDATE VIVIENDA 
        SET direccion = ?, capacidad = ?, niveles = ?, MUNICIPIO_id_mun = ? 
        WHERE id_viv = ?
    `;
    db.query(query, [direccion, capacidad, niveles, MUNICIPIO_id_mun, id], (err) => {
        if (err) return res.status(500).send(err);
        res.send('Vivienda modificada correctamente');
    });
});

// Endpoint para eliminar una vivienda
app.delete('/viviendas/:id', (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM VIVIENDA WHERE id_viv = ?';
    db.query(query, [id], (err) => {
        if (err) return res.status(500).send(err);
        res.send('Vivienda eliminada correctamente');
    });
});


// Endpoint para obtener todos los municipios
app.get('/municipios', (req, res) => {
    const query = 'SELECT * FROM MUNICIPIO';
    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(200).json(results);
    });
});

// Endpoint para agregar un municipio
app.post('/municipios', (req, res) => {
    const { nombre, area, presupuesto } = req.body;
    const query = `
        INSERT INTO MUNICIPIO (nombre, area, presupuesto) 
        VALUES (?, ?, ?)
    `;
    db.query(query, [nombre, area, presupuesto], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).send('Municipio agregado correctamente');
    });
});


// Endpoint para modificar un municipio
app.put('/municipios/:id', (req, res) => {
    const id = req.params.id;
    const { nombre, area, presupuesto } = req.body;
    const query = `
        UPDATE MUNICIPIO 
        SET nombre = ?, area = ?, presupuesto = ? 
        WHERE id_mun = ?
    `;
    db.query(query, [nombre, area, presupuesto, id], (err) => {
        if (err) return res.status(500).send(err);
        res.send('Municipio modificado correctamente');
    });
});

// Endpoint para eliminar un municipio
app.delete('/municipios/:id', (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM MUNICIPIO WHERE id_mun = ?';
    db.query(query, [id], (err) => {
        if (err) return res.status(500).send(err);
        res.send('Municipio eliminado correctamente');
    });
});

