import { useState, useEffect, useCallback } from 'react';
import { ticketsApi } from '../api/ticketsApi.js';

export function useTickets() {
	const [tickets, setTickets] = useState([]);
	const [cargando, setCargando] = useState(false);
	const [error, setError] = useState(null);

	const cargar = useCallback(async () => {
		setCargando(true);
		setError(null);
		try {
			const res = await ticketsApi.obtenerTodos();
			setTickets(res.data);
		} catch (err) {
			setError(err.response?.data?.mensaje ?? 'Error al cargar tickets.');
		} finally {
			setCargando(false);
		}
	}, []);

	useEffect(() => {
		cargar();
	}, [cargar]);

	const crear = async (datos) => {
		const res = await ticketsApi.crear(datos);
		setTickets((prev) => [res.data, ...prev]);
		return res.data;
	};

	const actualizar = async (id, datos) => {
		const res = await ticketsApi.actualizar(id, datos);
		setTickets((prev) => prev.map((t) => (t.ID_TICKET === id ? res.data : t)));
		return res.data;
	};

	const eliminar = async (id) => {
		await ticketsApi.eliminar(id);
		setTickets((prev) => prev.filter((t) => t.ID_TICKET !== id));
	};

	return { tickets, cargando, error, cargar, crear, actualizar, eliminar };
}
