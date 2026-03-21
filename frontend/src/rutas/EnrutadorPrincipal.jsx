import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RutaProtegida } from './RutaProtegida.jsx';
import LoginPagina from '../paginas/LoginPagina.jsx';
import GaritaPagina from '../paginas/GaritaPagina.jsx';
import LayoutPrincipal from '../componentes/layout/LayoutPrincipal.jsx';
import ParqueosPagina from '../Paginas/ParqueosPagina.jsx';
import LlamadasAtencionPagina from '../Paginas/LlamadasAtencionPagina.jsx';
import AccesoGaritaPagina from '../Paginas/accesoGaritaPagina.jsx';
import UsuarioPropiedadPagina from '../Paginas/usuarioPropiedadPagina.jsx';

export default function EnrutadorPrincipal() {
	return (
		<BrowserRouter>
			<Routes>
				{/* Rutas públicas */}
				<Route path="/login" element={<LoginPagina />} />
				<Route path="/garita" element={<GaritaPagina />} />
				<Route path="/parqueos" element={<ParqueosPagina />} />
				<Route path="accesoGarita" element={<AccesoGaritaPagina />} />
				<Route path="/llamadasAtencion" element={<LlamadasAtencionPagina />} />
				<Route path="/usuarioPropiedad" element={<UsuarioPropiedadPagina />} />

				<Route path="/garita/validar/:codigo" element={<GaritaPagina />} />

				{/* Rutas protegidas */}
				<Route
					path="/dashboard"
					element={
						<RutaProtegida>
							<LayoutPrincipal />
						</RutaProtegida>
					}
				/>

				{/* Redirecciones */}
				<Route path="/" element={<Navigate to="/login" replace />} />
				<Route path="*" element={<Navigate to="/login" replace />} />
			</Routes>
		</BrowserRouter>
	);
}
