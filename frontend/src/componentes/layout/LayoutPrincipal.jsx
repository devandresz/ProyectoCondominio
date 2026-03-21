import { useState } from 'react';
import { Sidebar } from './Sidebar.jsx';
import { Topbar } from './Topbar.jsx';
import { ModuloPendiente } from '../ModuloPendiente.jsx';
import { GRUPOS } from '../../datos/datosDePrueba.js';
import useStore from '../../estado/useStore.js';
import PagosPagina from '../../paginas/PagosPagina.jsx';
import ReservasPagina from '../../paginas/ReservasPagina.jsx';

// Módulos propios conectados al backend
import UsuariosPagina from '../../paginas/UsuariosPagina.jsx';
import TicketsPagina from '../../paginas/TicketsPagina.jsx';

// Módulos de compañeros (datos de prueba)
import ModuloPropiedades from '../../paginas/modulos/ModuloPropiedades.jsx';
import ModuloVehiculos from '../../paginas/modulos/ModuloVehiculos.jsx';
import ModuloInvitaciones from '../../paginas/modulos/ModuloInvitaciones.jsx';
import ModuloMulta from '../../paginas/modulos/ModuloMulta.jsx';

const SUBTITULOS = {
	'Gestión de Propiedades': 'Administración general de unidades y responsables',
	'Directorio Residentes': 'Gestión de usuarios del sistema',
	'Control Vehicular': 'Padrón oficial de vehículos asociados a casas',
	'Pases de Visita (QR)': 'Generación de códigos de acceso temporales',
	'Infracciones y Multas': 'Bitácora de faltas y control de sanciones',
	'Mesa de Ayuda': 'Gestión de tickets asignados al personal',
	'Reservas de Áreas': 'Calendario y gestión de áreas sociales',
};

export default function LayoutPrincipal() {
	const temaOscuro = useStore((s) => s.temaOscuro);
	const [moduloActivo, setModuloActivo] = useState(null);
	const [busquedaGlobal, setBusquedaGlobal] = useState('');

	const VISTAS = {
		'Gestión de Propiedades': <ModuloPropiedades filtroGlobal={busquedaGlobal} />,
		'Control Vehicular': <ModuloVehiculos filtroGlobal={busquedaGlobal} />,
		'Pases de Visita (QR)': <ModuloInvitaciones filtroGlobal={busquedaGlobal} />,
		'Infracciones y Multas': <ModuloMulta filtroGlobal={busquedaGlobal} />,
		'Directorio Residentes': <UsuariosPagina filtroGlobal={busquedaGlobal} />,
		'Mesa de Ayuda': <TicketsPagina filtroGlobal={busquedaGlobal} />,
		'Control de Cuotas': <PagosPagina filtroGlobal={busquedaGlobal} />,
		'Reservas de Áreas': <ReservasPagina filtroGlobal={busquedaGlobal} />,
	};

	const infoModulo = GRUPOS.flatMap((g) => g.modulos).find((m) => m.id === moduloActivo);
	const vistaActual =
		VISTAS[moduloActivo] ??
		(infoModulo ? <ModuloPendiente nombre={infoModulo.id} Icono={infoModulo.Icono} /> : null);

	return (
		<div
			className={`flex h-screen overflow-hidden font-sans transition-colors duration-300 ${temaOscuro ? 'bg-fondo text-primario' : 'tema-claro'}`}
		>
			<Sidebar moduloActivo={moduloActivo} setModuloActivo={setModuloActivo} />

			<div className="flex flex-col flex-1 min-w-0 relative z-10">
				<Topbar
					moduloActivo={moduloActivo}
					busquedaGlobal={busquedaGlobal}
					setBusquedaGlobal={setBusquedaGlobal}
					subtitulo={SUBTITULOS[moduloActivo] ?? 'Módulo en desarrollo'}
				/>
				<main className="flex-1 p-8 overflow-y-auto bg-fondo custom-scrollbar transition-colors duration-300">
					<div className="max-w-7xl mx-auto">{vistaActual}</div>
				</main>
			</div>
		</div>
	);
}
