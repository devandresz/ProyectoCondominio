import { useState, useEffect, useCallback } from 'react';
import { llamadasAtencionApi } from '../Api/llamadasAtencionApi';

export function useLlamadasAtencion() {
	const [llamadasAtencion, setLlamadasAtencion] = useState([]);
	const [cargando, setCargando] = useState(false);
	const [error, setError] = useState(null);
	const [llamadasAgrupadas, setLlamadasAgrupadas] = useState([]);

	const cargar = useCallback(async () => {
		setCargando(true);
		setError(null);
		try {
			const res = await llamadasAtencionApi.obtenerTodos();
			setLlamadasAtencion(res.data);
			const resAgrupados = await llamadasAtencionApi.obtenerTodosAgrupados();
			setLlamadasAgrupadas(resAgrupados.data);
		} catch (err) {
			setError(err.response?.data?.mensaje ?? 'Error al cargar llamadasAtencion.');
		} finally {
			setCargando(false);
		}
	}, []);

	useEffect(() => {
		cargar();
	}, [cargar]);

	const crear = async (datos) => {
		const res = await llamadasAtencionApi.crear(datos);
		setLlamadasAtencion((prev) => [res.data, ...prev]);
		return res.data;
	};

	const actualizar = async (id, datos) => {
		const res = await llamadasAtencionApi.actualizar(id, datos);
		setLlamadasAtencion((prev) => prev.map((l) => (l.ID_LLAMADO === id ? res.data : l)));
		return res.data;
	};

	const eliminar = async (id) => {
		await llamadasAtencionApi.eliminar(id);
		setLlamadasAtencion((prev) => prev.filter((l) => l.ID_LLAMADO !== id));
	};

	return {
		llamadasAtencion,
		llamadasAgrupadas,
		cargando,
		error,
		cargar,
		crear,
		actualizar,
		eliminar,
	};
}
