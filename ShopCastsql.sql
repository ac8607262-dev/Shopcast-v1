DROP DATABASE IF EXISTS shopcast1;
-- Creación de la Base de Datos Shopcast1
CREATE DATABASE shopcast1;
USE shopcast1;

-- 1. Tabla de Clientes / Usuarios (Maneja los roles: cliente, vendedor, admin)
CREATE TABLE cliente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('cliente', 'vendedor', 'admin') DEFAULT 'cliente'
);

-- 2. Tabla de Categorías (Para clasificar productos)
CREATE TABLE categoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
);

-- 3. Tabla de Productos
CREATE TABLE producto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categoria_id INT,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL,
    imagen_url VARCHAR(255),
    FOREIGN KEY (categoria_id) REFERENCES categoria(id) ON DELETE CASCADE
);

-- 4. Tabla de Carrito de Compras
CREATE TABLE carrito (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES cliente(id) ON DELETE CASCADE
);

-- 5. Tabla de Pedidos
CREATE TABLE pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(50) DEFAULT 'Pendiente',
    total DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (cliente_id) REFERENCES cliente(id) ON DELETE CASCADE
);

-- 6. Tabla de Detalle del Pedido (Productos asociados a un pedido)
CREATE TABLE detalle_pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT,
    producto_id INT,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedido(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES producto(id) ON DELETE CASCADE
);

-- 7. Tabla de Pagos
CREATE TABLE pago (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT,
    metodo_pago VARCHAR(50) NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(50) DEFAULT 'Completado',
    FOREIGN KEY (pedido_id) REFERENCES pedido(id) ON DELETE CASCADE
);

-- 8. Tabla de Checkout (Información de envío)
CREATE TABLE checkout (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT,
    direccion_envio VARCHAR(255) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    codigo_postal VARCHAR(20),
    telefono VARCHAR(20),
    FOREIGN KEY (pedido_id) REFERENCES pedido(id) ON DELETE CASCADE
);


-- ==========================================
-- DATOS DE PRUEBA INICIALES
-- ==========================================

-- Usuarios de prueba (Cliente, Vendedor y Admin)
INSERT INTO cliente (nombre, email, password, rol) VALUES 
('Carlos Cliente', 'cliente@mail.com', '123456', 'cliente'),
('Valeria Vendedora', 'vendedor@mail.com', '123456', 'vendedor'),
('Alan Admin', 'admin@mail.com', '123456', 'admin');

-- Categorías iniciales
INSERT INTO categoria (nombre, descripcion) VALUES 
('Tecnología', 'Dispositivos y accesorios electrónicos'),
('Ropa', 'Prendas de vestir y moda');

-- Productos iniciales de prueba
INSERT INTO producto (categoria_id, nombre, descripcion, precio, stock, imagen_url) VALUES 
(1, 'Teclado Mecánico RGB', 'Teclado mecánico gamer de alta respuesta', 89.99, 15, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3'),
(1, 'Audífonos Bluetooth', 'Audífonos inalámbricos con cancelación de ruido', 59.99, 20, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e');