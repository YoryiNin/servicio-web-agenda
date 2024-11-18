import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import path from 'path';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(path.resolve(), 'public'))); // Sirve los archivos estáticos desde el directorio 'public'

// Ruta para mostrar la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(path.resolve(), 'public', 'index.html'));
});

// Ruta para listar los contactos
app.get('/contactos', async (req, res) => {
    try {
        const response = await fetch('http://www.raydelto.org/agenda.php');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los contactos' });
    }
});

// Ruta para almacenar un contacto
app.post('/contactos', async (req, res) => {
    try {
        const nuevoContacto = req.body;

        await fetch('http://www.raydelto.org/agenda.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoContacto),
        });

        res.status(201).json({ message: 'Contacto agregado con éxito', nuevoContacto });
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar el contacto' });
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
