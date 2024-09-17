const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;
const apiUrl = 'https://www.datos.gov.co/resource/sdmr-tfmf.json';

// Ruta para testear el método GET y obtener los datos
app.get('/test-api', async (req, res) => {
    try {
        const response = await axios.get(apiUrl);
        const data = response.data;

        // Respuesta para punto a: verificar si es un array de objetos
        const isArrayOfObjects = Array.isArray(data) && data.length > 0 && typeof data[0] === 'object';
        
        res.json({
            message: 'Datos obtenidos de la API',
            isArrayOfObjects: isArrayOfObjects,
            data: data
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener datos de la API', error: error.message });
    }
});

// Ruta para analizar si la clave cantidad_solicitada necesita conversión (punto c)
app.get('/analyze-cantidad', async (req, res) => {
    try {
        const response = await axios.get(apiUrl);
        const data = response.data;

        const conversionNeeded = data.some(item => typeof item.cantidad_solicitada !== 'number');

        res.json({
            message: 'Análisis completado',
            conversionNeeded: conversionNeeded
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al analizar los datos', error: error.message });
    }
});

// Ruta para listar nombre_comercial en minúsculas (punto d)
app.get('/list-nombre-comercial', async (req, res) => {
    try {
        const response = await axios.get(apiUrl);
        const data = response.data;

        const nombresMinusculas = data.map(item => item.nombre_comercial.toLowerCase());

        res.send(`
            <html>
                <body>
                    <ul>
                        ${nombresMinusculas.map(nombre => `<li>${nombre}</li>`).join('')}
                    </ul>
                </body>
            </html>
        `);
    } catch (error) {
        res.status(500).json({ message: 'Error al listar nombres comerciales', error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
