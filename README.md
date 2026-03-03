# 🏢 Sistema de Gestión de Condominio

## 📌 Descripción

Este proyecto consiste en el desarrollo de un **Sistema de Gestión de Condominio**, diseñado para facilitar la administración de residenciales o edificios, permitiendo llevar un control organizado de residentes, pagos, mantenimiento, comunicados y demás procesos administrativos.

El sistema estará dividido en **frontend** y **backend**, comunicados mediante una **API REST**, siguiendo el patrón de arquitectura **MVC (Modelo - Vista - Controlador)** para garantizar una estructura ordenada, escalable y mantenible.

Actualmente el proyecto se encuentra en fase inicial de desarrollo.

---

## 🚀 Tecnologías a utilizar

### 🖥️ Frontend

- **React** (con Vite como herramienta de desarrollo)
- Consumo de API REST
- Interfaz moderna y responsiva

### ⚙️ Backend

- **Node.js**
- **Express**
- Arquitectura MVC
- Exposición de API REST para comunicación con el frontend

### 🗄️ Base de Datos

- **Oracle Database**
- Manejo estructurado de información crítica como:
  - Residentes
  - Pagos
  - Cuotas
  - Mantenimiento
  - Reportes
  - Usuarios y roles

---

## 🏗️ Arquitectura del Proyecto

El sistema estará organizado bajo el patrón **MVC**:

- **Modelo (Model):**  
  Encargado de la lógica de datos y conexión con la base de datos Oracle.

- **Vista (View):**  
  Representada por el frontend en React.

- **Controlador (Controller):**  
  Gestiona las peticiones HTTP, valida datos y conecta el frontend con la base de datos a través de la API.

La comunicación entre frontend y backend se realizará mediante peticiones HTTP (GET, POST, PUT, DELETE) a través de una API REST.

---

## 🎯 Objetivo del Proyecto

Desarrollar una plataforma web que permita:

- Gestionar residentes
- Administrar pagos y cuotas
- Registrar incidencias o mantenimientos
- Controlar accesos mediante usuarios y roles

---

## 📂 Estado del Proyecto

🟡 En desarrollo (fase inicial)

Actualmente se está trabajando en:

- Definición de estructura del proyecto
- Configuración del entorno frontend y backend
- Diseño inicial de la base de datos
- Planificación de módulos principales
