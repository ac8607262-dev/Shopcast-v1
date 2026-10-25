DROP DATABASE IF EXISTS Shopcast1;
CREATE DATABASE Shopcast1; 
USE Shopcast1;
CREATE TABLE Categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(100) NOT NULL
);
CREATE TABLE Producto (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    id_categoria INT NOT NULL,
    nombre_producto VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    CONSTRAINT fk_producto_categoria FOREIGN KEY (id_categoria) 
        REFERENCES Categoria(id_categoria)
        ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE Carrito (
    id_carrito INT AUTO_INCREMENT PRIMARY KEY,
    cedula VARCHAR(20) NOT NULL,
    fecha_creacion DATETIME NOT NULL,
    estado_carrito VARCHAR(50) NOT NULL
);
CREATE TABLE Cliente (
    cedula VARCHAR(20) PRIMARY KEY,
    nombre_cliente VARCHAR(100) NOT NULL,
    direccion VARCHAR(150),
    tipo_cliente VARCHAR(50),
    correo VARCHAR(100),
    id_carrito INT,
    CONSTRAINT fk_cliente_carrito FOREIGN KEY (id_carrito) 
        REFERENCES Carrito(id_carrito)
        ON DELETE SET NULL ON UPDATE CASCADE
);
ALTER TABLE Carrito
ADD CONSTRAINT fk_carrito_cliente FOREIGN KEY (cedula) 
    REFERENCES Cliente(cedula)
    ON DELETE CASCADE ON UPDATE CASCADE;
CREATE TABLE Pedido (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_carrito INT NOT NULL,
    total_pedido DECIMAL(10, 2) NOT NULL,
    fecha_pedido DATETIME NOT NULL,
    CONSTRAINT fk_pedido_carrito FOREIGN KEY (id_carrito) 
        REFERENCES Carrito(id_carrito)
        ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE TABLE Pago (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL,
    estado_pago VARCHAR(50) NOT NULL,
    fecha_pago DATETIME NOT NULL,
    CONSTRAINT fk_pago_pedido FOREIGN KEY (id_pedido) 
        REFERENCES Pedido(id_pedido)
        ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE Checkout (
    id_checkout INT AUTO_INCREMENT PRIMARY KEY,
    id_pago INT NOT NULL,
    estado_carrito VARCHAR(50) NOT NULL,
    CONSTRAINT fk_checkout_pago FOREIGN KEY (id_pago) 
        REFERENCES Pago(id_pago)
        ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE DetallePedido (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    direccion_final VARCHAR(150) NOT NULL,
    cantidad INT NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_detalle_pedido FOREIGN KEY (id_pedido) 
        REFERENCES Pedido(id_pedido)
        ON DELETE CASCADE ON UPDATE CASCADE
);

#"INSERCION DE DATOS"

INSERT INTO Categoria (nombre_categoria) 
VALUES 
('Tecnología'),
('Ropa y Accesorios');
INSERT INTO Producto (id_categoria, nombre_producto, descripcion, precio, stock) 
VALUES 
(1, 'Audífonos Bluetooth', 'Audífonos inalámbricos con cancelación de ruido', 120000, 15),
(2, 'Chaqueta Impermeable', 'Chaqueta para lluvia talla M unisex', 85000, 20);
INSERT INTO Cliente (cedula, nombre_cliente, direccion, tipo_cliente, correo, id_carrito) 
VALUES 
('1018234567', 'Carlos Pérez', 'Calle 45 # 12-34, Bogotá', 'usuario', 'carlos.perez@email.com', NULL),
('1020987654', 'María Rodríguez', 'Carrera 7 # 89-10, Medellín', 'admin', 'maria.rodriguez@email.com', NULL);
INSERT INTO Carrito (cedula, fecha_creacion, estado_carrito) 
VALUES 
('1018234567', '2026-10-20 10:30:00', 'Activo'),
('1020987654', '2026-10-21 14:15:00', 'Completado');
INSERT INTO Pedido (id_carrito, total_pedido, fecha_pedido) 
VALUES 
(1, 120000, '2026-10-20 11:00:00'),
(2, 85000, '2026-10-21 15:00:00');
INSERT INTO DetallePedido (id_pedido, direccion_final, cantidad, subtotal) 
VALUES 
(1, 'Calle 45 # 12-34, Bogotá', 1, 120000),
(2, 'Carrera 7 # 89-10, Medellín', 1, 85000);
INSERT INTO Pago (id_pedido, metodo_pago, estado_pago, fecha_pago) 
VALUES 
(1, 'Tarjeta de Crédito', 'Aprobado', '2026-10-20 11:05:00'),
(2, 'PSE / Transferencia', 'Aprobado', '2026-10-21 15:02:00');
INSERT INTO Checkout (id_pago, estado_carrito) 
VALUES 
(1, 'Cerrado'),
(2, 'Cerrado');

#Consultas de tabla de todos los datos
SELECT *
FROM Pedido;
#Consultas de tabla donde los datos son igual o mayor que =,<,>.
SELECT *
FROM Pedido
WHERE total_pedido < "100000";
#Consultas de tabla donde los datos contienen%
SELECT *
FROM Cliente
WHERE cedula like "%8%"