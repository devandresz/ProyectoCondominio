import { useState, useEffect, useCallback } from 'react';
import { reservasApi } from '../api/reservasApi.js';
import useStore from '../estado/useStore.js';

export function useReservas() {
	const usuario = useStore((s) => s.usuario);
	const esAdmin = usuario?.ROL === 'Administrador';

	const [reservas, setReservas] = useState([]);
	const [areas, setAreas] = useState([]);
	const [cargando, setCargando] = useState(false);
	const [cargandoAreas, setCargandoAreas] = useState(false);
	const [error, setError] = useState(null);

	const cargarReservas = useCallback(async () => {
		setCargando(true);
		setError(null);
		try {
			const res = esAdmin ? await reservasApi.obtenerTodas() : await reservasApi.misReservas();
			setReservas(res.data);
		} catch (err) {
			setError(err.response?.data?.mensaje ?? 'Error al cargar reservas.');
		} finally {
			setCargando(false);
		}
	}, [esAdmin]);

	const cargarAreas = useCallback(async () => {
		setCargandoAreas(true);
		try {
			const res = await reservasApi.obtenerAreas();
			setAreas(res.data);
		} catch {
			setAreas([]);
		} finally {
			setCargandoAreas(false);
		}
	}, []);

	useEffect(() => {
		cargarReservas();
		cargarAreas();
	}, [cargarReservas, cargarAreas]);

	const crear = async (datos) => {
		const res = await reservasApi.crear(datos);
		setReservas((prev) => [res.data, ...prev]);
		return res.data;
	};

	const cancelar = async (id, motivo) => {
		const res = await reservasApi.cancelar(id, motivo);
		setReservas((prev) =>
			prev.map((r) => (r.ID_RESERVA === id ? { ...r, ESTADO: 'CANCELADA' } : r)),
		);
		return res.data;
	};

	return {
		reservas,
		areas,
		cargando,
		cargandoAreas,
		error,
		cargarReservas,
		cargarAreas,
		crear,
		cancelar,
	};
}
