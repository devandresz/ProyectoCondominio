import { useEffect, useState } from 'react';

export default function ModuloParqueos() {
	const [parqueos, setParqueos] = useState([]);
	const [error, setError] = useState('');

	const obtenerParqueos = async () => {
		try {
			setError('');
			const res = await fetch('http://localhost:1000/parqueos', {
				credentials: 'include',
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.mensaje || 'No se pudieron obtener los parqueos');
			}

			setParqueos(data);
		} catch (err) {
			console.error(err);
			setError(err.message);
		}
	};

	useEffect(() => {
		obtenerParqueos();
	}, []);

	return (
		<div style={contenedor}>
			<h1 style={titulo}>Módulo de Parqueos</h1>

			{error && <p style={errorStyle}>Error: {error}</p>}

			<div style={tarjeta}>
				<h3 style={subtitulo}>Listado de parqueos</h3>

				<table style={tabla}>
					<thead>
						<tr>
							<th style={th}>No. Parqueo</th>
							<th style={th}>Descripción</th>
							<th style={th}>Propiedad</th>
							<th style={th}>Estado</th>
						</tr>
					</thead>
					<tbody>
						{parqueos.length > 0 ? (
							parqueos.map((parqueo) => (
								<tr key={parqueo.NUMERO_PROPIEDAD}>
									<td style={td}>{parqueo.NUMERO_PARQUEO}</td>
									<td style={td}>{parqueo.DESCRIPCION}</td>
									<td style={td}>{parqueo.NUMERO_PROPIEDAD}</td>
									<td style={td}>{parqueo.ACTIVO}</td>
								</tr>
							))
						) : (
							<tr>
								<td style={td} colSpan="6">
									No hay parqueos registradas
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
