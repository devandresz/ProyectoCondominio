import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RutaProtegida } from './RutaProtegida.jsx';
import LoginPagina from '../paginas/LoginPagina.jsx';
import GaritaPagina from '../paginas/GaritaPagina.jsx';
import LayoutPrincipal from '../componentes/layout/LayoutPrincipal.jsx';
import ParqueosPagina from '../Paginas/ParqueosPagina.jsx';
import LlamadasAtencionPagina from '../Paginas/LlamadasAtencionPagina.jsx';
import AccesoGaritaPagina from '../Paginas/accesoGaritaPagina.jsx';
import UsuarioPropiedadPagina from '../Paginas/usuarioPropiedadPagina.jsx';

// Importamos la nueva pantalla de bienvenida
import PantallaBienvenida from '../paginas/modulos/PantallaBienvenida.jsx';

// Importa aquí tus demás módulos cuando estés listo para conectarlos al menú
// import ModuloPropiedades from '../paginas/modulos/ModuloPropiedades.jsx';
// import ModuloCategorias from '../paginas/modulos/ModuloCategorias.jsx';
// import ModuloVinculaciones from '../paginas/modulos/ModuloVinculaciones.jsx';
// import ModuloInvitaciones from '../paginas/modulos/ModuloInvitaciones.jsx';

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
				>
					{/* ESTA ES LA CLAVE: El index hace que se cargue por defecto al entrar a /dashboard */}
					<Route index element={<PantallaBienvenida />} />

					{/* Aquí van las rutas hijas que se cargarán a la derecha del menú */}
					{/* <Route path="propiedades" element={<ModuloPropiedades />} /> */}
					{/* <Route path="categorias" element={<ModuloCategorias />} /> */}
					{/* <Route path="vinculaciones" element={<ModuloVinculaciones />} /> */}
					{/* <Route path="invitaciones" element={<ModuloInvitaciones />} /> */}
				</Route>

				{/* Redirecciones */}
				<Route path="/" element={<Navigate to="/login" replace />} />
				<Route path="*" element={<Navigate to="/login" replace />} />
			</Routes>
		</BrowserRouter>
	);
}
