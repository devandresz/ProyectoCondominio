import { X, AlertTriangle, Search, Save } from 'lucide-react';

// ─── ETIQUETA (badge de estado) ───────────────────────────────────────────
export function Etiqueta({ texto, variante = 'default' }) {
	const estilos = {
		activo: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
		pendiente: 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
		inactivo: 'bg-zinc-500/10 text-zinc-400 border border-zinc-600/30',
		utilizado: 'bg-zinc-500/10 text-zinc-400 border border-zinc-600/30',
		pagado: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
		expirado: 'bg-red-500/10 text-red-400 border border-red-500/20',
		normal: 'bg-violet-500/10 text-violet-400 border border-violet-500/20',
		servicio: 'bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20',
		default: 'bg-zinc-800 text-zinc-300 border border-zinc-700',
	};
	return (
		<span
			className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${estilos[variante] ?? estilos.default}`}
		>
			{texto}
		</span>
	);
}

// ─── TARJETA MÉTRICA ──────────────────────────────────────────────────────
export function TarjetaMetrica({ etiqueta, valor, Icono, fondo, textoIcono }) {
	return (
		<div className="p-5 border bg-fondo border-borde rounded-xl shadow-sm hover:border-zinc-700 transition-colors">
			<div className="flex items-center justify-between mb-3">
				<span className="text-xs font-medium text-secundario">{etiqueta}</span>
				<div
					className={`flex items-center justify-center w-8 h-8 rounded-lg ${fondo ?? 'bg-zinc-800'}`}
				>
					{textoIcono ? (
						<span className="text-sm font-bold text-primario">{textoIcono}</span>
					) : (
						<Icono className="w-4 h-4 text-primario" />
					)}
				</div>
			</div>
			<p className="text-2xl font-bold font-title text-primario">{valor}</p>
		</div>
	);
}

// ─── MODAL ────────────────────────────────────────────────────────────────
export function Modal({ titulo, alCerrar, children }) {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
			<div className="w-full max-w-lg mx-4 border shadow-2xl bg-tarjeta border-borde rounded-2xl overflow-hidden animate-in zoom-in-95 duration-200">
				<div className="flex items-center justify-between p-6 border-b border-borde bg-fondo">
					<h2 className="text-sm font-semibold font-title text-primario">{titulo}</h2>
					<button onClick={alCerrar} className="p-1 rounded-lg transition-colors hover:bg-zinc-800">
						<X className="w-4 h-4 text-secundario" />
					</button>
				</div>
				<div className="p-6 bg-tarjeta">{children}</div>
			</div>
		</div>
	);
}

// ─── MODAL CONFIRMACIÓN ───────────────────────────────────────────────────
export function ModalConfirmacion({ titulo, mensaje, onConfirmar, onCancelar }) {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
			<div className="w-full max-w-sm mx-4 bg-tarjeta border border-red-500/30 rounded-3xl overflow-hidden shadow-[0_0_40px_-10px_rgba(239,68,68,0.25)] animate-in zoom-in-95 duration-200">
				<div className="p-6 text-center">
					<div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
						<AlertTriangle className="w-8 h-8 text-red-500" />
					</div>
					<h2 className="text-lg font-bold text-primario mb-2">{titulo}</h2>
					<p className="text-sm text-zinc-400 mb-8">{mensaje}</p>
					<div className="flex gap-3">
						<button
							onClick={onCancelar}
							className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl border border-borde text-zinc-300 hover:bg-zinc-800 transition-colors"
						>
							Cancelar
						</button>
						<button
							onClick={onConfirmar}
							className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
						>
							Sí, eliminar
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

// ─── CAMPO / ENTRADA / SELECTOR ───────────────────────────────────────────
export function Campo({ etiqueta, children }) {
	return (
		<div className="space-y-1.5">
			<label className="text-[11px] font-medium text-secundario uppercase tracking-wide">
				{etiqueta}
			</label>
			{children}
		</div>
	);
}

export function Entrada(props) {
	return (
		<input
			className="w-full px-3 py-2 text-sm border rounded-lg bg-fondo border-borde text-primario placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
			{...props}
		/>
	);
}

export function Selector({ children, ...props }) {
	return (
		<select
			className="w-full px-3 py-2 text-sm border rounded-lg bg-fondo border-borde text-primario focus:outline-none focus:border-zinc-500 transition-colors"
			{...props}
		>
			{children}
		</select>
	);
}

// ─── BUSCADOR ─────────────────────────────────────────────────────────────
export function BuscadorCasa({ valor, alCambiar }) {
	return (
		<div className="flex items-center gap-2 px-3 py-1.5 border rounded-lg bg-tarjeta border-borde w-64 focus-within:border-zinc-500 transition-colors shadow-sm">
			<Search className="w-3.5 h-3.5 text-secundario flex-shrink-0" />
			<input
				value={valor}
				onChange={(e) => alCambiar(e.target.value)}
				placeholder="Filtrar..."
				className="w-full text-sm bg-transparent border-none outline-none text-primario placeholder:text-zinc-600"
			/>
			{valor && (
				<button
					onClick={() => alCambiar('')}
					className="text-zinc-600 hover:text-zinc-400 transition-colors"
				>
					<X className="w-3 h-3" />
				</button>
			)}
		</div>
	);
}

// ─── BOTONES ──────────────────────────────────────────────────────────────
export function BtnPrimario({ children, onClick }) {
	return (
		<button
			onClick={onClick}
			className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primario text-fondo hover:bg-white/90 transition-colors shadow-sm"
		>
			{children}
		</button>
	);
}

export function BtnAccion({ onClick, Icono, titulo, colorHover = 'hover:text-primario' }) {
	return (
		<button
			type="button"
			onClick={(e) => {
				e.stopPropagation();
				onClick();
			}}
			title={titulo}
			className={`p-1.5 rounded-lg hover:bg-zinc-800 transition-colors text-secundario ${colorHover}`}
		>
			<Icono className="w-3.5 h-3.5" />
		</button>
	);
}

export function BotonesModal({
	alCancelar,
	alGuardar,
	textoGuardar = 'Guardar',
	IconoGuardar = Save,
}) {
	return (
		<div className="flex gap-3 pt-2">
			<button
				type="button"
				onClick={alCancelar}
				className="flex-1 px-4 py-2 text-sm border rounded-lg border-borde text-secundario hover:text-primario transition-colors"
			>
				Cancelar
			</button>
			<button
				type="submit"
				onClick={alGuardar}
				className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-primario text-fondo hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
			>
				<IconoGuardar className="w-3.5 h-3.5" /> {textoGuardar}
			</button>
		</div>
	);
}

// ─── TABLA (cabecera, fila, celda, pie) ───────────────────────────────────
export function CabeceraTabla({ columnas }) {
	return (
		<thead>
			<tr className="border-b border-borde bg-fondo/50">
				{columnas.map((col) => (
					<th
						key={col}
						className="px-4 py-3 text-left text-[11px] font-bold text-secundario tracking-wide uppercase"
					>
						{col}
					</th>
				))}
			</tr>
		</thead>
	);
}

export function Fila({ indice, seleccionada, onClick, children }) {
	return (
		<tr
			onClick={onClick}
			className={`border-b border-borde/50 cursor-pointer transition-colors select-none fila-tabla ${seleccionada ? 'fila-seleccionada border-l-2 border-l-primario' : 'fila-normal'}`}
		>
			{children}
		</tr>
	);
}

export function Celda({ children, mono }) {
	return (
		<td className={`px-4 py-3 text-sm font-bold text-primario ${mono ? 'font-mono' : ''}`}>
			{children}
		</td>
	);
}

export function PieTabla({ mostrados, total, unidad }) {
	return (
		<div className="px-4 py-3 text-[11px] text-secundario border-t border-borde bg-fondo/50">
			Mostrando {mostrados} de {total} {unidad}
		</div>
	);
}

// ─── MÓDULO PENDIENTE ─────────────────────────────────────────────────────
export function ModuloPendiente({ nombre, Icono }) {
	return (
		<div className="flex flex-col items-center justify-center h-72 rounded-2xl border bg-zinc-900/40 border-borde gap-4 animate-in fade-in duration-300">
			<div className="flex items-center justify-center w-14 h-14 rounded-2xl border border-borde bg-fondo shadow-sm">
				<Icono className="w-6 h-6 text-zinc-600" />
			</div>
			<div className="text-center space-y-1">
				<p className="text-sm font-semibold font-title text-zinc-400">{nombre}</p>
				<p className="text-xs text-zinc-600">Módulo en desarrollo por otro equipo.</p>
			</div>
		</div>
	);
}
