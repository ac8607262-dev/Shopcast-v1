require('dotenv').config(); // Carga las variables del archivo .env
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Configurar CORS correctamente para React
app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// 2. Middleware para procesar JSON en las peticiones
app.use(express.json());

// 3. Conexión usando las variables de entorno (.env)
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'shopcast1',
    waitForConnections: true,
    connectionLimit: 10
});

// Usamos la versión de promesas
const db = pool.promise();

console.log('✅ Pool de conexiones a MySQL inicializado correctamente (Shopcast1)');

// ==========================================
//          ENDPOINTS DE API (Shopcast1)
// ==========================================

// Endpoint de Login (Devuelve el rol correctamente)
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [results] = await db.query(
            'SELECT id, nombre, email, rol FROM cliente WHERE email = ? AND password = ?',
            [email, password]
        );
        if (results.length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint para obtener todos los productos del catálogo
app.get('/api/productos', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM producto');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint para obtener productos filtrados por categoría
app.get('/api/categoria/:categoriaId/productos', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM producto WHERE categoria_id = ?', [req.params.categoriaId]);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint para agregar un nuevo producto (Administración / Vendedor)
app.post('/api/productos', async (req, res) => {
    const { categoria_id, nombre, precio, stock, descripcion, imagen_url } = req.body;
    try {
        const query = 'INSERT INTO producto (categoria_id, nombre, precio, stock, descripcion, imagen_url) VALUES (?, ?, ?, ?, ?, ?)';
        await db.query(query, [categoria_id, nombre, precio, stock || 0, descripcion || '', imagen_url || '']);
        res.json({ message: '¡Producto agregado exitosamente al catálogo de Shopcast1!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint para obtener todas las categorías
app.get('/api/categorias', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM categoria');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint para crear una nueva categoría
app.post('/api/categorias', async (req, res) => {
    const { nombre, descripcion } = req.body;
    try {
        const query = 'INSERT INTO categoria (nombre, descripcion) VALUES (?, ?)';
        const [result] = await db.query(query, [nombre, descripcion]);
        res.json({ message: '¡Categoría creada con éxito!', id: result.insertId });
    } catch (err) { 
        res.status(500).json({ error: err.message });
    }
});

// 4. Iniciar Servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});