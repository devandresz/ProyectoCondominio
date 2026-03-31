import { useState, useEffect, useCallback } from 'react';
import { parqueosApi } from '../Api/parqueosApi';

export function useParqueos() {
	const [parqueos, setParqueos] = useState([]);
	const [cargando, setCargando] = useState(false);
	const [error, setError] = useState(null);

	const cargar = useCallback(async () => {
		setCargando(true);
		setError(null);
		try {
			const res = await parqueosApi.obtenerTodos();
			setParqueos(res.data);
		} catch (err) {
			setError(err.response?.data?.mensaje ?? 'Error al cargar parqueos.');
		} finally {
			setCargando(false);
		}
	}, []);

	useEffect(() => {
		cargar();
	}, [cargar]);

	const crear = async (datos) => {
		const res = await parqueosApi.crear(datos);
		setParqueos((prev) => [res.data, ...prev]);
		return res.data;
	};

	const actualizar = async (id, datos) => {
		const res = await parqueosApi.actualizar(id, datos);
		setParqueos((prev) => prev.map((p) => (p.ID_PARQUEO === id ? res.data : p)));
		return res.data;
	};

	const eliminar = async (id) => {
		await parqueosApi.eliminar(id);
		setParqueos((prev) => prev.filter((p) => p.ID_PARQUEO !== id));
	};

	return { parqueos, cargando, error, cargar, crear, actualizar, eliminar };
}
