// ============================================================
// 📁 RUTA: frontend/src/paginas/GaritaPagina.jsx
// ============================================================
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Camera, X, CheckCircle2, AlertTriangle, UserCheck, QrCode } from 'lucide-react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { accesoGaritaApi } from '../api/accesoGaritaApi.js';
import useStore from '../estado/useStore.js';
import { toast } from 'sonner';

export default function GaritaPagina() {
	const { codigo } = useParams();
	const navigate = useNavigate();
	const usuarioActual = useStore((state) => state.usuario);

	const [estadoPantalla, setEstadoPantalla] = useState('ESCANEAR');
	const [mensajeError, setMensajeError] = useState('');
	const [codigoManual, setCodigoManual] = useState('');
	const [invitacion, setInvitacion] = useState(null);

	const [form, setForm] = useState({
		tipoDocumento: 'DPI',
		numeroDocumento: '',
		nombreReal: '',
		observaciones: '',
	});

	const extraerCodigo = (texto) => {
		if (!texto) return '';
		const str = typeof texto === 'string' ? texto : texto[0]?.rawValue || String(texto);
		if (str.includes('QR-')) {
			return 'QR-' + str.split('QR-')[1].trim();
		}
		return str.trim();
	};

	const procesarQr = async (textoQr) => {
		if (!textoQr || estadoPantalla !== 'ESCANEAR') return;

		const codigoLimpio = extraerCodigo(textoQr);
		if (!codigoLimpio) return;

		setEstadoPantalla('VALIDANDO');

		try {
			const respuesta = await accesoGaritaApi.validarQr(codigoLimpio);
			const datosInvitacion = respuesta.data;

			if (datosInvitacion.ACTIVO === 0) {
				lanzarError('Esta invitación ha sido desactivada o ya fue utilizada.');
				return;
			}

			if (datosInvitacion.TIPO_NOMBRE === 'Normal' || datosInvitacion.TIPO === 'Normal') {
				if (datosInvitacion.FECHA_EXPIRACION) {
					const expiracion = new Date(datosInvitacion.FECHA_EXPIRACION);
					if (expiracion < new Date()) {
						lanzarError('Esta invitación expiró a las 23:59 del día de su creación.');
						return;
					}
				}
			}

			setInvitacion(datosInvitacion);
			setForm((prev) => ({ ...prev, nombreReal: datosInvitacion.NOMBRE_VISITANTE }));
			setEstadoPantalla('FORMULARIO');
			toast.success('Código QR validado correctamente');
		} catch (error) {
			lanzarError(
				error.response?.data?.mensaje || 'El código QR es inválido o no existe en el sistema.',
			);
		}
	};

	useEffect(() => {
		if (codigo && estadoPantalla === 'ESCANEAR') {
			procesarQr(codigo);
		}
	}, [codigo]);

	const registrarIngreso = async (e) => {
		e.preventDefault();
		try {
			await accesoGaritaApi.registrar({
				idInvitacion: invitacion.ID_INVITACION,
				idGuardia: usuarioActual?.ID_USUARIO || 1,
				tipoDocumento: form.tipoDocumento,
				numeroDocumento: form.numeroDocumento,
				nombreReal: form.nombreReal,
				observaciones: form.observaciones,
			});
			setEstadoPantalla('EXITO');
			toast.success('Ingreso registrado con éxito');
		} catch (error) {
			const msgError =
				error.response?.data?.mensaje ||
				error.response?.data?.error?.[0]?.message ||
				'Error de conexión con el servidor.';
			lanzarError(msgError);
		}
	};

	const lanzarError = (mensaje) => {
		setMensajeError(mensaje);
		setEstadoPantalla('ERROR');
		toast.error(mensaje);
	};

	const reiniciarEscaner = () => {
		setCodigoManual('');
		setInvitacion(null);
		setMensajeError('');
		setForm({ tipoDocumento: 'DPI', numeroDocumento: '', nombreReal: '', observaciones: '' });
		setEstadoPantalla('ESCANEAR');
		navigate('/garita');
	};

	return (
		<div className="flex flex-col min-h-screen bg-zinc-950 text-white font-sans">
			<header className="bg-zinc-900 p-4 border-b border-zinc-800 text-center">
				<h1 className="text-lg font-bold text-zinc-100">Control de Garita</h1>
				<p className="text-xs text-zinc-400">Condominio PuraFé</p>
			</header>

			<main className="flex-1 flex flex-col items-center justify-center p-6">
				{estadoPantalla === 'ESCANEAR' && (
					<div className="w-full max-w-sm flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
						<div className="w-full aspect-square bg-black border-2 border-dashed border-zinc-700 rounded-3xl overflow-hidden relative mb-6 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
							<Scanner
								onScan={(resultado) => procesarQr(resultado)}
								onResult={(texto) => procesarQr(texto)}
								onError={(e) => console.log('Error de cámara:', e?.message)}
								options={{ delayBetweenScanAttempts: 500 }}
								formats={['qr_code']}
							/>
							<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
								<QrCode className="w-32 h-32 text-white/10" />
							</div>
						</div>

						<h2 className="text-xl font-bold mb-2">Escáner Activo</h2>
						<p className="text-zinc-500 text-center text-sm mb-6">
							Apunta con la cámara al código QR del visitante o ingresa el código manualmente.
						</p>

						<div className="w-full flex gap-2">
							<input
								type="text"
								placeholder="Ej: QR-xxx o URL completa"
								value={codigoManual}
								onChange={(e) => setCodigoManual(e.target.value)}
								className="flex-1 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-zinc-600 font-mono text-sm"
							/>
							<button
								onClick={() => procesarQr(codigoManual)}
								className="px-4 py-3 bg-zinc-800 rounded-xl font-bold hover:bg-zinc-700 transition-colors"
							>
								Buscar
							</button>
						</div>
					</div>
				)}

				{estadoPantalla === 'VALIDANDO' && (
					<div className="flex flex-col items-center">
						<div className="w-16 h-16 border-4 border-zinc-600 border-t-emerald-500 rounded-full animate-spin mb-6" />
						<h2 className="text-xl font-bold animate-pulse">Consultando base de datos...</h2>
					</div>
				)}

				{estadoPantalla === 'FORMULARIO' && invitacion && (
					<div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-8 duration-300">
						<div className="text-center mb-6">
							<div className="inline-flex px-3 py-1 rounded-full text-xs font-bold mb-4 bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
								Pase de {invitacion.TIPO_NOMBRE || invitacion.TIPO || 'Visitante'}
							</div>
							<h2 className="text-2xl font-bold text-zinc-100">{invitacion.NOMBRE_VISITANTE}</h2>
							<p className="text-zinc-400 mt-1 text-sm font-mono text-xs opacity-60">
								{codigo || extraerCodigo(codigoManual) || 'Código validado'}
							</p>
						</div>

						<form onSubmit={registrarIngreso} className="space-y-4">
							<div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-3">
								<h3 className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
									<UserCheck className="w-4 h-4" /> Verificación de Identidad
								</h3>

								<div className="grid grid-cols-3 gap-2">
									<div className="col-span-1">
										<select
											className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-sm text-white focus:border-emerald-500 outline-none"
											value={form.tipoDocumento}
											onChange={(e) => setForm({ ...form, tipoDocumento: e.target.value })}
										>
											<option value="DPI">DPI</option>
											<option value="Licencia">Licencia</option>
										</select>
									</div>
									<div className="col-span-2">
										<input
											required
											type="text"
											placeholder="No. de Documento"
											className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-sm text-white focus:border-emerald-500 outline-none"
											value={form.numeroDocumento}
											onChange={(e) => setForm({ ...form, numeroDocumento: e.target.value })}
										/>
									</div>
								</div>

								<input
									required
									type="text"
									placeholder="Nombre Real (Según Documento)"
									className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-sm text-white focus:border-emerald-500 outline-none"
									value={form.nombreReal}
									onChange={(e) => setForm({ ...form, nombreReal: e.target.value })}
								/>

								<input
									type="text"
									placeholder="Placas o Notas adicionales (Opcional)"
									className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-sm text-white focus:border-emerald-500 outline-none"
									value={form.observaciones}
									onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
								/>
							</div>

							<button
								type="submit"
								className="w-full py-4 bg-emerald-500 text-zinc-950 font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:bg-emerald-400 transition-colors"
							>
								Autorizar Ingreso
							</button>
							<button
								type="button"
								onClick={reiniciarEscaner}
								className="w-full py-3 bg-transparent text-zinc-400 font-bold rounded-xl hover:bg-zinc-800 transition-colors"
							>
								Cancelar
							</button>
						</form>
					</div>
				)}

				{estadoPantalla === 'EXITO' && (
					<div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
						<div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
							<CheckCircle2 className="w-12 h-12 text-emerald-500" />
						</div>
						<h2 className="text-2xl font-bold text-emerald-400 mb-2">¡Acceso Registrado!</h2>
						<p className="text-zinc-400 text-center mb-8">
							El visitante puede ingresar al condominio.
						</p>
						<button
							onClick={reiniciarEscaner}
							className="px-6 py-3 bg-zinc-800 rounded-xl font-bold hover:bg-zinc-700 transition-colors"
						>
							Escanear otro pase
						</button>
					</div>
				)}

				{estadoPantalla === 'ERROR' && (
					<div className="flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-300 w-full max-w-sm">
						<div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
							<X className="w-10 h-10 text-red-500" />
						</div>
						<h1 className="text-2xl font-bold mb-2">Pase Inválido</h1>
						<div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl mb-8 w-full">
							<p className="text-red-400 flex items-center justify-center gap-2 font-bold mb-1">
								<AlertTriangle className="w-5 h-5" /> Acceso Denegado
							</p>
							<p className="text-red-400/80 text-sm">{mensajeError}</p>
						</div>
						<button
							onClick={reiniciarEscaner}
							className="px-6 py-3 bg-zinc-800 w-full rounded-xl font-bold hover:bg-zinc-700 transition-colors"
						>
							Volver a Escanear
						</button>
					</div>
				)}
			</main>
		</div>
	);
}
