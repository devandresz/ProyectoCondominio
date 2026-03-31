import { useState, useEffect, useCallback } from 'react';
import { accesoGaritaApi } from '../Api/accesoGaritaApi';

export function useAccesoGarita() {
	const [accesoGarita, setAccesoGarita] = useState([]);
	const [cargando, setCargando] = useState(false);
	const [error, setError] = useState(null);

	const cargar = useCallback(async () => {
		setCargando(true);
		setError(null);
		try {
			const res = await accesoGaritaApi.obtenerTodos();
			setAccesoGarita(res.data);
		} catch (err) {
			setError(err.response?.data?.mensaje ?? 'Error al cargar acceso a la garita.');
		} finally {
			setCargando(false);
		}
	}, []);

	useEffect(() => {
		cargar();
	}, [cargar]);

	const crear = async (datos) => {
		const res = await accesoGaritaApi.crear(datos);
		setAccesoGarita((prev) => [res.data, ...prev]);
		return res.data;
	};

	const actualizar = async (id, datos) => {
		const res = await accesoGaritaApi.actualizar(id, datos);
		setAccesoGarita((prev) => prev.map((p) => (p.ID_ACCESO === id ? res.data : p)));
		return res.data;
	};

	const eliminar = async (id) => {
		await accesoGaritaApi.eliminar(id);
		setAccesoGarita((prev) => prev.filter((p) => p.ID_ACCESO !== id));
	};

	return { accesoGarita, cargando, error, cargar, crear, actualizar, eliminar };
}
