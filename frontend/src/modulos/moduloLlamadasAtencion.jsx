import { useEffect, useState } from 'react';

export default function ModuloLlamadasAtencion() {
	const [llamadasAtencion, setLlamadasAtencion] = useState([]);
	const [error, setError] = useState('');

	const obtenerLlamadasAtencion = async () => {
		try {
			setError('');
			const res = await fetch('http://localhost:1000/llamadasAtencion', {
				credentials: 'include',
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.mensaje || 'No se pudieron obtener los llamadasAtencion');
			}

			setLlamadasAtencion(data);
		} catch (err) {
			console.error(err);
			setError(err.message);
		}
	};

	useEffect(() => {
		obtenerLlamadasAtencion();
	}, []);

	return (
		<div style={contenedor}>
			<h1 style={titulo}>Módulo de Llamadas de Atención</h1>

			{error && <p style={errorStyle}>Error: {error}</p>}

			<div style={tarjeta}>
				<h3 style={subtitulo}>Listado de llamadas</h3>

				<table style={tabla}>
					<thead>
						<tr>
							<th style={th}>#</th>
							<th style={th}>Cantidad</th>
							<th style={th}>Propiedad</th>
							<th style={th}>Descripción</th>
						</tr>
					</thead>
					<tbody>
						{llamadasAtencion.length > 0 ? (
							llamadasAtencion.map((llamadaAtencion, index) => (
								<tr key={llamadaAtencion.NUMERO_PROPIEDAD}>
									<td style={td}>{index}</td>
									<td style={td}>{llamadaAtencion.CANTIDAD}</td>
									<td style={td}>{llamadaAtencion.NUMERO_PROPIEDAD}</td>
									<td style={td}>{llamadaAtencion.DESCRIPCION}</td>
								</tr>
							))
						) : (
							<tr>
								<td style={td} colSpan="6">
									No hay llamadas de atencion registradas
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}

const contenedor = {
	display: 'flex',
	flexDirection: 'column',
	gap: '20px',
};

const titulo = {
	margin: 0,
	color: '#111827',
};

const subtitulo = {
	marginTop: 0,
	color: '#111827',
};

const tarjeta = {
	background: 'white',
	padding: '20px',
	borderRadius: '12px',
	boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
};

const tabla = {
	width: '100%',
	borderCollapse: 'collapse',
};

const th = {
	textAlign: 'left',
	padding: '12px',
	borderBottom: '1px solid #e5e7eb',
	color: '#111827',
};

const td = {
	padding: '12px',
	borderBottom: '1px solid #e5e7eb',
	color: '#374151',
};

const errorStyle = {
	color: '#b91c1c',
	fontWeight: 'bold',
};
