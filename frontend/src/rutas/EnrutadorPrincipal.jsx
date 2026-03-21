import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RutaProtegida } from './RutaProtegida.jsx';
import LoginPagina from '../paginas/LoginPagina.jsx';
import GaritaPagina from '../paginas/GaritaPagina.jsx';
import LayoutPrincipal from '../componentes/layout/LayoutPrincipal.jsx';


export default function EnrutadorPrincipal() {
	return (
		<BrowserRouter>
			<Routes>
				{/* Rutas públicas */}
				<Route path="/login" element={<LoginPagina />} />
				<Route path="/garita" element={<GaritaPagina />} />
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
