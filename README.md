# 🏢 Sistema de Gestión de Condominios

Sistema web para la administración integral de condominios, desarrollado con arquitectura cliente-servidor. Permite gestionar usuarios, pagos, reservas, accesos y control interno del condominio de forma eficiente.

---

## 🚀 Tecnologías utilizadas

### 🖥️ Frontend

- React
- Vite
- JavaScript
- CSS

### ⚙️ Backend

- Node.js
- Express

### 🗄️ Base de datos

- Oracle Database

---

## 📌 Características principales

- Gestión de usuarios (Residente, Administrador, Guardia)
- CRUD completo de entidades principales
- Registro y control de pagos mensuales
- Generación automática de moras
- Registro de llamados de atención
- Generación automática de multas (al acumular 3 incidencias)
- Reserva de áreas comunes (parques, salones, piscinas, etc.)
- Gestión de parqueos por categoría
- Generación de invitaciones mediante código QR
- Validación de acceso de invitados en garita

---

## 🧩 Módulos del sistema

### 👤 Usuarios

- Registro, edición y eliminación de usuarios
- Asignación de roles

### 💳 Pagos

- Registro de pagos
- Historial de pagos
- Generación de mora automática

### ⚠️ Incidencias

- Registro de llamados de atención
- Generación de multas

### 🏊 Reservas

- Reserva de áreas comunes
- Validación de disponibilidad

### 🚗 Parqueos

- Asignación automática según categoría

### 📱 Invitaciones QR

- Generación de QR para invitados
- Validación en garita con documento de identidad

---

## 📂 Estructura del proyecto

```bash
/condominio-app
│
├── frontend/        # Aplicación React + Vite
├── backend/         # API REST con Node.js + Express
├── AS.sql        # Scripts y modelos Oracle
└── README.md
```
