# 📡 API - Sistema de Gestión de Condominios

Documentación de la API REST del backend.

---

## 🌐 Base URL

http://localhost:3000/api

---

## 🔐 Autenticación

Header requerido en rutas protegidas:
Authorization: Bearer <token>

---

# 📚 ENDPOINTS

---

## 👤 Usuario Propiedad

**Base:** `/usuarioPropiedad`

| Método | Endpoint                | Descripción    |
| ------ | ----------------------- | -------------- |
| GET    | `/usuarioPropiedad`     | Obtener todos  |
| GET    | `/usuarioPropiedad/:id` | Obtener por ID |
| POST   | `/usuarioPropiedad`     | Crear          |
| PUT    | `/usuarioPropiedad/:id` | Actualizar     |
| DELETE | `/usuarioPropiedad/:id` | Eliminar       |

## 💳 Pagos

**Base:** `/pagos`

| Método | Endpoint     | Descripción    |
| ------ | ------------ | -------------- |
| GET    | `/pagos`     | Obtener todos  |
| GET    | `/pagos/:id` | Obtener por ID |
| POST   | `/pagos`     | Crear          |
| PUT    | `/pagos/:id` | Actualizar     |
| DELETE | `/pagos/:id` | Eliminar       |

## ⚠️ Llamados de Atención

**Base:** `/llamadasAtencion`

| Método | Endpoint                       | Descripción        |
| ------ | ------------------------------ | ------------------ |
| GET    | `/llamadasAtencion`            | Obtener todos      |
| GET    | `/llamadasAtencion/:id`        | Obtener por ID     |
| GET    | `/llamadasAtencion/acumuladas` | Obtener acumuladas |
| POST   | `/llamadasAtencion`            | Crear              |
| PUT    | `/llamadasAtencion/:id`        | Actualizar         |
| DELETE | `/llamadasAtencion/:id`        | Eliminar           |

## 💰 Cargos Financieros

**Base:** `/cargos-financieros`

| Método | Endpoint                  | Descripción    |
| ------ | ------------------------- | -------------- |
| GET    | `/cargos-financieros`     | Obtener todos  |
| GET    | `/cargos-financieros/:id` | Obtener por ID |
| POST   | `/cargos-financieros`     | Crear          |
| PUT    | `/cargos-financieros/:id` | Actualizar     |
| DELETE | `/cargos-financieros/:id` | Eliminar       |

## 🏷️ Tipos de Cargo

**Base:** `/tipos-cargo`

| Método | Endpoint           | Descripción    |
| ------ | ------------------ | -------------- |
| GET    | `/tipos-cargo`     | Obtener todos  |
| GET    | `/tipos-cargo/:id` | Obtener por ID |
| POST   | `/tipos-cargo`     | Crear          |
| PUT    | `/tipos-cargo/:id` | Actualizar     |
| DELETE | `/tipos-cargo/:id` | Eliminar       |

## 🏊 Áreas Sociales

**Base:** `/areas-sociales`

| Método | Endpoint              | Descripción    |
| ------ | --------------------- | -------------- |
| GET    | `/areas-sociales`     | Obtener todos  |
| GET    | `/areas-sociales/:id` | Obtener por ID |
| POST   | `/areas-sociales`     | Crear          |
| PUT    | `/areas-sociales/:id` | Actualizar     |
| DELETE | `/areas-sociales/:id` | Eliminar       |

## 📅 Reservas

**Base:** `/reservas`

| Método | Endpoint        | Descripción    |
| ------ | --------------- | -------------- |
| GET    | `/reservas`     | Obtener todos  |
| GET    | `/reservas/:id` | Obtener por ID |
| POST   | `/reservas`     | Crear          |
| PUT    | `/reservas/:id` | Actualizar     |
| DELETE | `/reservas/:id` | Eliminar       |

## 🚗 Parqueos

**Base:** `/parqueos`

| Método | Endpoint        | Descripción    |
| ------ | --------------- | -------------- |
| GET    | `/parqueos`     | Obtener todos  |
| GET    | `/parqueos/:id` | Obtener por ID |
| POST   | `/parqueos`     | Crear          |
| PUT    | `/parqueos/:id` | Actualizar     |
| DELETE | `/parqueos/:id` | Eliminar       |

## 🎟️ Tickets

**Base:** `/tickets`

| Método | Endpoint       | Descripción    |
| ------ | -------------- | -------------- |
| GET    | `/tickets`     | Obtener todos  |
| GET    | `/tickets/:id` | Obtener por ID |
| POST   | `/tickets`     | Crear          |
| PUT    | `/tickets/:id` | Actualizar     |
| DELETE | `/tickets/:id` | Eliminar       |

## 🚧 Acceso Garita

**Base:** `/accesoGarita`

| Método | Endpoint            | Descripción    |
| ------ | ------------------- | -------------- |
| GET    | `/accesoGarita`     | Obtener todos  |
| GET    | `/accesoGarita/:id` | Obtener por ID |
| POST   | `/accesoGarita`     | Crear          |
| PUT    | `/accesoGarita/:id` | Actualizar     |
| DELETE | `/accesoGarita/:id` | Eliminar       |
