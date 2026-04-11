// ============================================================
// 📁 RUTA: frontend/src/modulos/ModuloMultasSeguro.jsx
// ============================================================
// import { useEffect, useState } from 'react';
// import { toast } from 'sonner';

// export default function ModuloMultasSeguro() {
// 	const [multas, setMultas] = useState([]);
// 	const [error, setError] = useState('');

// 	const obtenerMultas = async () => {
// 		try {
// 			setError('');
// 			const res = await fetch(`${import.meta.env.VITE_API_URL}/multas`, {
// 				credentials: 'include',
// 			});

// 			const data = await res.json();

// 			if (!res.ok) {
// 				throw new Error(data.mensaje || 'No se pudieron obtener las multas');
// 			}

// 			setMultas(data);
// 		} catch (err) {
// 			console.error(err);
// 			setError(err.message);
//          toast.error(err.message);
// 		}
// 	};

// 	useEffect(() => {
// 		obtenerMultas();
// 	}, []);

// 	return (
// 		<div style={contenedor}>
// 			<h1 style={titulo}>Módulo de Multas</h1>

// 			{error && <p style={errorStyle}>Error: {error}</p>}

// 			<div style={tarjeta}>
// 				<h3 style={subtitulo}>Listado de multas</h3>

// 				<table style={tabla}>
// 					<thead>
// 						<tr>
// 							<th style={th}>ID</th>
// 							<th style={th}>Propiedad</th>
// 							<th style={th}>Tipo</th>
// 							<th style={th}>Monto</th>
// 							<th style={th}>Descripción</th>
// 							<th style={th}>Estado</th>
// 						</tr>
// 					</thead>
// 					<tbody>
// 						{multas.length > 0 ? (
// 							multas.map((multa) => (
// 								<tr key={multa.ID_CARGO}>
// 									<td style={td}>{multa.ID_CARGO}</td>
// 									<td style={td}>{multa.ID_PROPIEDAD}</td>
// 									<td style={td}>{multa.TIPO_CARGO}</td>
// 									<td style={td}>{multa.MONTO}</td>
// 									<td style={td}>{multa.DESCRIPCION}</td>
// 									<td style={td}>{multa.ESTADO}</td>
// 								</tr>
// 							))
// 						) : (
// 							<tr>
// 								<td style={td} colSpan="6">
// 									No hay multas registradas
// 								</td>
// 							</tr>
// 						)}
// 					</tbody>
// 				</table>
// 			</div>
// 		</div>
// 	);
// }

// const contenedor = {
// 	display: 'flex',
// 	flexDirection: 'column',
// 	gap: '20px',
// };

// const titulo = {
// 	margin: 0,
// 	color: '#111827',
// };

// const subtitulo = {
// 	marginTop: 0,
// 	color: '#111827',
// };

// const tarjeta = {
// 	background: 'white',
// 	padding: '20px',
// 	borderRadius: '12px',
// 	boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
// };

// const tabla = {
// 	width: '100%',
// 	borderCollapse: 'collapse',
// };

// const th = {
// 	textAlign: 'left',
// 	padding: '12px',
// 	borderBottom: '1px solid #e5e7eb',
// 	color: '#111827',
// };

// const td = {
// 	padding: '12px',
// 	borderBottom: '1px solid #e5e7eb',
// 	color: '#374151',
// };

// const errorStyle = {
// 	color: '#b91c1c',
// 	fontWeight: 'bold',
// };
