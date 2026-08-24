-- ==========================================
-- SISTEMA DE FACTURACIÓN HOTELERA
-- Esquema de Base de Datos — Normalizado 3FN
-- ==========================================

CREATE DATABASE IF NOT EXISTS facturacion_hotel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE facturacion_hotel;

-- Tabla: huesped
CREATE TABLE huesped (
  id_huesped INT PRIMARY KEY AUTO_INCREMENT,
  ci_nit VARCHAR(15) NOT NULL UNIQUE,
  tipo_documento VARCHAR(4) NOT NULL CHECK (tipo_documento IN ('CI','NIT')),
  nombre_completo VARCHAR(100) NOT NULL,
  razon_social VARCHAR(100) NULL,
  telefono VARCHAR(20) NULL,
  direccion VARCHAR(200) NULL,
  fecha_registro DATE NOT NULL DEFAULT (CURRENT_DATE)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: habitacion
CREATE TABLE habitacion (
  id_habitacion INT PRIMARY KEY AUTO_INCREMENT,
  numero VARCHAR(10) NOT NULL UNIQUE,
  tipo VARCHAR(30) NULL,
  tarifa_base DECIMAL(10,2) NOT NULL CHECK (tarifa_base > 0),
  estado VARCHAR(15) NOT NULL DEFAULT 'Disponible' CHECK (estado IN ('Disponible','Ocupada','Mantenimiento'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: hospedaje
CREATE TABLE hospedaje (
  id_hospedaje INT PRIMARY KEY AUTO_INCREMENT,
  id_huesped INT NOT NULL,
  id_habitacion INT NOT NULL,
  fecha_entrada DATE NOT NULL,
  fecha_salida DATE NOT NULL,
  tarifa_diaria_aplicada DECIMAL(10,2) NOT NULL CHECK (tarifa_diaria_aplicada > 0),
  dias INT NOT NULL CHECK (dias >= 1),
  subtotal DECIMAL(12,2) NOT NULL CHECK (subtotal >= 0),
  estado VARCHAR(15) NOT NULL DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente','En curso','Finalizado')),
  FOREIGN KEY (id_huesped) REFERENCES huesped(id_huesped) ON DELETE RESTRICT,
  FOREIGN KEY (id_habitacion) REFERENCES habitacion(id_habitacion) ON DELETE RESTRICT,
  CONSTRAINT fechas_validas CHECK (fecha_salida > fecha_entrada)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: factura
CREATE TABLE factura (
  id_factura INT PRIMARY KEY AUTO_INCREMENT,
  id_hospedaje INT NOT NULL UNIQUE,
  fecha_emision DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  monto_total DECIMAL(12,2) NOT NULL CHECK (monto_total >= 0),
  nit_emisor VARCHAR(15) NOT NULL,
  nombre_emisor VARCHAR(100) NOT NULL,
  codigo_control VARCHAR(50) NULL,
  estado VARCHAR(15) NOT NULL DEFAULT 'Emitida' CHECK (estado IN ('Emitida','Anulada')),
  FOREIGN KEY (id_hospedaje) REFERENCES hospedaje(id_hospedaje) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;