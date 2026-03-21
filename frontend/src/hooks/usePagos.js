import { useState, useEffect, useCallback } from 'react';
import { pagosApi } from '../api/pagosApi.js';
import useStore from '../estado/useStore.js';

export function usePagos() {
	const usuario = useStore((s) => s.usuario);
	const esAdmin = usuario?.ROL === 'Administrador';

	const [pagos, setPagos] = useState([]);
	const [estadoCuenta, setEstadoCuenta] = useState(null); // { cargosPendientes, totalPendiente, ultimoPago }
	const [cargando, setCargando] = useState(false);
	const [cargandoEstado, setCargandoEstado] = useState(false);
	const [error, setError] = useState(null);

	// Carga lista de pagos según rol
	const cargarPagos = useCallback(async () => {
		setCargando(true);
		setError(null);
		try {
			const res = esAdmin ? await pagosApi.obtenerTodos() : await pagosApi.misPagos();
			setPagos(res.data);
		} catch (err) {
			setError(err.response?.data?.mensaje ?? 'Error al cargar pagos.');
		} finally {
			setCargando(false);
		}
	}, [esAdmin]);

	// Carga estado de cuenta (preview de cargos pendientes) para una propiedad
	const cargarEstadoCuenta = useCallback(
		async (idPropiedad) => {
			if (!idPropiedad) {
				setEstadoCuenta(null);
				return;
			}
			setCargandoEstado(true);
			try {
				const res = await pagosApi.estadoCuenta(esAdmin ? idPropiedad : undefined);
				setEstadoCuenta(res.data);
			} catch {
				setEstadoCuenta(null);
			} finally {
				setCargandoEstado(false);
			}
		},
		[esAdmin],
	);

	useEffect(() => {
		cargarPagos();
	}, [cargarPagos]);

	// Crear pago — el backend suma y aplica todos los cargos pendientes (RN-F6)
	const crear = async (datos) => {
		const res = await pagosApi.crear(datos);
		setPagos((prev) => [res.data, ...prev]);
		return res.data;
	};

	return {
		pagos,
		estadoCuenta,
		cargando,
		cargandoEstado,
		error,
		cargarPagos,
		cargarEstadoCuenta,
		crear,
	};
}
