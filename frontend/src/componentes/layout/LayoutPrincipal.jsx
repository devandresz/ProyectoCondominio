// ============================================================
// 📁 RUTA: frontend/src/componentes/layout/LayoutPrincipal.jsx
// ============================================================

import { useState } from 'react';
import { Sidebar } from './Sidebar.jsx';
import { Topbar } from './Topbar.jsx';
import { ModuloPendiente } from '../ModuloPendiente.jsx';
import { GRUPOS } from '../../datos/datosDePrueba.js';
import useStore from '../../estado/useStore.js';
import ModuloTiposCargo from '../../paginas/modulos/ModuloTiposCargo.jsx';
import ModuloCargosFinancieros from '../../paginas/modulos/ModuloCargosFinancieros.jsx';
import ModuloAreasSociales from '../../paginas/modulos/ModuloAreasSociales.jsx';
import PagosPagina from '../../paginas/PagosPagina.jsx';
import ReservasPagina from '../../paginas/ReservasPagina.jsx';

import UsuariosPagina from '../../paginas/UsuariosPagina.jsx';
import TicketsPagina from '../../paginas/TicketsPagina.jsx';
import ParqueosPagina from '../../Paginas/ParqueosPagina.jsx';

// Módulos de compañeros (datos de prueba)
import ModuloPropiedades from '../../paginas/modulos/ModuloPropiedades.jsx';
import ModuloCategorias from '../../paginas/modulos/ModuloCategorias.jsx';
import ModuloVinculaciones from '../../paginas/modulos/ModuloVinculaciones.jsx';
import ModuloInvitaciones from '../../paginas/modulos/ModuloInvitaciones.jsx';
import ModuloVehiculos from '../../paginas/modulos/ModuloVehiculos.jsx';
import ModuloMulta from '../../paginas/modulos/ModuloMulta.jsx';
import PantallaBienvenida from '../../paginas/modulos/PantallaBienvenida.jsx';
import LlamadasAtencionPagina from '../../Paginas/LlamadasAtencionPagina.jsx';
import AccesoGaritaPagina from '../../Paginas/accesoGaritaPagina.jsx';
import UsuarioPropiedadPagina from '../../Paginas/usuarioPropiedadPagina.jsx';

const SUBTITULOS = {
	'Gestión de Propiedades': 'Administración general de unidades y responsables',
	'Categorías de Propiedad': 'Catálogo de tipos de propiedad, cuotas y parqueos',
	'Vinculación Usuario-Propiedad': 'Control de propietarios e inquilinos por unidad',
	'Directorio Residentes': 'Gestión de usuarios del sistema',
	'Control Vehicular': 'Padrón oficial de vehículos asociados a casas',
	'Pases de Visita (QR)': 'Generación de códigos de acceso temporales',
	'Infracciones y Multas': 'Bitácora de faltas y control de sanciones',
	'Mesa de Ayuda': 'Gestión de tickets asignados al personal',
	'Tipos de Cargo': 'Catálogo de conceptos financieros, cargos dinámicos y multas',
	'Cargos Financieros': 'Consulta de estado de cuenta por propiedad y cuotas mensuales',
	'Áreas Sociales': 'Gestión de espacios comunes, horarios y precio por hora',
	'Reservas de Áreas': 'Calendario y gestión de áreas sociales',
	'Inventario Parqueos': 'Inventario de parqueos disponibles',
	'Llamados de Atención': 'Listado de llamadas de atención acumuladas',
	'Bitácora de Seguridad': 'Bitácora y registro de las personas que han ingresado.',
	'Propietarios e Inquilinos': 'Control de inquilinos y propietarios',
};

export default function LayoutPrincipal() {
	const [moduloActivo, setModuloActivo] = useState(null);
	const [busquedaGlobal, setBusquedaGlobal] = useState('');

	const VISTAS = {
		'Gestión de Propiedades': <ModuloPropiedades filtroGlobal={busquedaGlobal} />,
		'Categorías de Propiedad': <ModuloCategorias filtroGlobal={busquedaGlobal} />,
		'Vinculación Usuario-Propiedad': <ModuloVinculaciones filtroGlobal={busquedaGlobal} />,
		'Control Vehicular': <ModuloVehiculos filtroGlobal={busquedaGlobal} />,
		'Pases de Visita (QR)': <ModuloInvitaciones filtroGlobal={busquedaGlobal} />,
		'Infracciones y Multas': <ModuloMulta filtroGlobal={busquedaGlobal} />,
		'Directorio Residentes': <UsuariosPagina filtroGlobal={busquedaGlobal} />,
		'Mesa de Ayuda': <TicketsPagina filtroGlobal={busquedaGlobal} />,
		'Tipos de Cargo': <ModuloTiposCargo filtroGlobal={busquedaGlobal} />,
		'Cargos Financieros': <ModuloCargosFinancieros />,
		'Áreas Sociales': <ModuloAreasSociales />,
		'Control de Cuotas': <PagosPagina filtroGlobal={busquedaGlobal} />,
		'Reservas de Áreas': <ReservasPagina filtroGlobal={busquedaGlobal} />,
		'Inventario Parqueos': <ParqueosPagina filtroGlobal={busquedaGlobal} />,
		'Llamados de Atención': <LlamadasAtencionPagina filtroGlobal={busquedaGlobal} />,
		'Propietarios e Inquilinos': <UsuarioPropiedadPagina filtroGlobal={busquedaGlobal} />,
	};

	const infoModulo = GRUPOS.flatMap((g) => g.modulos).find((m) => m.id === moduloActivo);

	const vistaActual =
		VISTAS[moduloActivo] ??
		(moduloActivo ? (
			<ModuloPendiente nombre={infoModulo?.id || moduloActivo} Icono={infoModulo?.Icono} />
		) : (
			<PantallaBienvenida setModuloActivo={setModuloActivo} />
		));

	return (
		<div className="flex h-screen overflow-hidden bg-fondo text-primario transition-colors duration-300">
			<Sidebar moduloActivo={moduloActivo} setModuloActivo={setModuloActivo} />
			<div className="flex flex-col flex-1 min-w-0 relative z-10">
				<Topbar
					moduloActivo={moduloActivo}
					setModuloActivo={setModuloActivo}
					busquedaGlobal={busquedaGlobal}
					setBusquedaGlobal={setBusquedaGlobal}
					subtitulo={
						!moduloActivo
							? 'Panel de gestión residencial'
							: (SUBTITULOS[moduloActivo] ?? 'Módulo en desarrollo')
					}
				/>
				<main className="flex-1 p-8 overflow-y-auto bg-fondo custom-scrollbar transition-colors duration-300">
					<div className="max-w-7xl mx-auto">{vistaActual}</div>
				</main>
			</div>
		</div>
	);
}