import { useState } from "react";
import { VistaLogin } from "./vistas/PantallasLibres";
import ModuloMultasSeguro from "./modulos/ModuloMultasSeguro";

export default function App() {
  const [pantallaActual, setPantallaActual] = useState("login");
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [moduloActivo, setModuloActivo] = useState("dashboard");

  const manejarLogin = async (usuario, contrasena) => {
    try {
      const res = await fetch("http://localhost:1000/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombreUsuario: usuario,
          contrasena,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setUsuarioActual(data);
        setPantallaActual("dashboard");
        setModuloActivo("dashboard");
      } else {
        alert(data.mensaje || "Credenciales incorrectas");
      }
    } catch (error) {
      console.error(error);
      alert("No se pudo conectar al backend");
    }
  };

  const cerrarSesion = () => {
    setPantallaActual("login");
    setUsuarioActual(null);
    setModuloActivo("dashboard");
  };

  return (
    <div style={{ minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      {pantallaActual === "login" && <VistaLogin onLogin={manejarLogin} />}

      {pantallaActual === "dashboard" && (
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <aside
            style={{
              width: "260px",
              background: "#0f172a",
              color: "white",
              padding: "20px",
            }}
          >
            <h2 style={{ marginBottom: "30px", color: "white" }}>
              Sistema Condominio
            </h2>

            <p
              style={{
                marginBottom: "10px",
                fontSize: "14px",
                color: "#cbd5e1",
              }}
            >
              Usuario:
            </p>

            <p
              style={{
                marginBottom: "20px",
                fontWeight: "bold",
                color: "white",
              }}
            >
              {usuarioActual?.NOMBRE} {usuarioActual?.APELLIDO}
            </p>

            <button
              onClick={() => setModuloActivo("dashboard")}
              style={botonMenu(moduloActivo === "dashboard")}
            >
              Dashboard
            </button>

            <button
              onClick={() => setModuloActivo("multas")}
              style={botonMenu(moduloActivo === "multas")}
            >
              Multas
            </button>

            <button
              onClick={cerrarSesion}
              style={{
                marginTop: "30px",
                width: "100%",
                padding: "12px",
                border: "none",
                borderRadius: "8px",
                background: "#dc2626",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Cerrar sesión
            </button>
          </aside>

          <main style={{ flex: 1, background: "#f3f4f6", padding: "30px" }}>
            {moduloActivo === "dashboard" && (
              <>
                <h1 style={{ marginBottom: "20px", color: "#111827" }}>
                  Dashboard
                </h1>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "20px",
                  }}
                >
                  <div style={tarjeta}>
                    <h3 style={tituloTarjeta}>Usuarios</h3>
                    <p style={textoTarjeta}>
                      Módulo disponible para administración.
                    </p>
                  </div>

                  <div style={tarjeta}>
                    <h3 style={tituloTarjeta}>Propiedades</h3>
                    <p style={textoTarjeta}>
                      Control de unidades del condominio.
                    </p>
                  </div>

                  <div style={tarjeta}>
                    <h3 style={tituloTarjeta}>Multas</h3>
                    <p style={textoTarjeta}>
                      Registro y consulta de infracciones.
                    </p>
                  </div>
                </div>
              </>
            )}

            {moduloActivo === "multas" && <ModuloMultasSeguro />}
          </main>
        </div>
      )}
    </div>
  );
}

function botonMenu(activo) {
  return {
    width: "100%",
    padding: "12px",
    marginBottom: "10px",
    border: "none",
    borderRadius: "8px",
    background: activo ? "#2563eb" : "#1e293b",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    textAlign: "left",
  };
}

const tarjeta = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
};

const tituloTarjeta = {
  margin: "0 0 10px 0",
  color: "#111827",
};

const textoTarjeta = {
  margin: 0,
  color: "#374151",
};