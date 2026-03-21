import { useState, useEffect, useCallback } from 'react';
import { usuariosPropiedadApi } from '../Api/usuarioPropiedadApi';

export function useUsuarioPropiedad() {
	const [up, setUP] = useState([]);
	const [cargando, setCargando] = useState(false);
	const [error, setError] = useState(null);

	const cargar = useCallback(async () => {
		setCargando(true);
		setError(null);
		try {
			const res = await usuariosPropiedadApi.obtenerTodos();
			setUP(res.data);
		} catch (err) {
			setError(err.response?.data?.mensaje ?? 'Error al cargar propiedades.');
		} finally {
			setCargando(false);
		}
	}, []);

	useEffect(() => {
		cargar();
	}, [cargar]);

	const crear = async (datos) => {
		const res = await usuariosPropiedadApi.crear(datos);
		setUP((prev) => [res.data, ...prev]);
		return res.data;
	};

	const actualizar = async (id, datos) => {
		const res = await usuariosPropiedadApi.actualizar(id, datos);
		setUP((prev) => prev.map((p) => (p.ID_USUARIO_PROPIEDAD === id ? res.data : p)));
		return res.data;
	};

	const eliminar = async (id) => {
		await usuariosPropiedadApi.eliminar(id);
		setUP((prev) => prev.filter((p) => p.ID_USUARIO_PROPIEDAD !== id));
	};

	return { up, cargando, error, cargar, crear, actualizar, eliminar };
}
