// ============================================================
// 📁 RUTA: frontend/src/paginas/modulos/ModuloAccesoGarita.jsx
// ============================================================
import { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { ShieldCheck, XCircle, CheckCircle2, QrCode, UserCheck } from 'lucide-react';
import { accesoGaritaApi } from '../../api/accesoGaritaApi.js';
import useStore from '../../estado/useStore.js';
import { BtnPrimario } from '../../componentes/ui/Botones.jsx';
import { Campo, Entrada, Selector } from '../../componentes/ui/Formularios.jsx';
import { toast } from 'sonner';

export default function ModuloAccesoGarita() {
	const usuarioActual = useStore((state) => state.usuario);

	const [qrLeido, setQrLeido] = useState('');
	const [invitacion, setInvitacion] = useState(null);
	const [estadoPantalla, setEstadoPantalla] = useState('ESCANEAR');
	const [mensajeError, setMensajeError] = useState('');

	const [form, setForm] = useState({
		tipoDocumento: 'DPI',
		numeroDocumento: '',
		nombreReal: '',
		observaciones: '',
	});

	const procesarQr = async (textoBruto) => {
		if (!textoBruto || estadoPantalla !== 'ESCANEAR') return;

		const str =
			typeof textoBruto === 'string' ? textoBruto : textoBruto[0]?.rawValue || String(textoBruto);

		let codigoLimpio = str;
		if (str.includes('QR-')) {
			codigoLimpio = 'QR-' + str.split('QR-')[1].trim();
		} else {
			codigoLimpio = str.trim();
		}

		setQrLeido(codigoLimpio);
		setEstadoPantalla('VALIDANDO');

		try {
			const respuesta = await accesoGaritaApi.validarQr(codigoLimpio);
			const datosInvitacion = respuesta.data;

			if (datosInvitacion.ACTIVO === 0) {
				lanzarError('Esta invitación ha sido desactivada o ya fue utilizada.');
				return;
			}

			if (
				datosInvitacion.TIPO === 'Normal' &&
				new Date(datosInvitacion.FECHA_EXPIRACION) < new Date()
			) {
				lanzarError('Esta invitación expiró a las 23:59 del día de su creación.');
				return;
			}

			setInvitacion(datosInvitacion);
			setForm({ ...form, nombreReal: datosInvitacion.NOMBRE_VISITANTE });
			setEstadoPantalla('FORMULARIO');
			toast.success('Código QR validado correctamente');
		} catch (error) {
			lanzarError(
				error.response?.data?.mensaje || 'El código QR no pertenece a este condominio.',
			);
		}
	};

	const lanzarError = (mensaje) => {
		setMensajeError(mensaje);
		setEstadoPantalla('ERROR');
		toast.error(mensaje);
	};

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
			toast.success('Acceso registrado con éxito');
		} catch (error) {
			const msgError =
				error.response?.data?.mensaje ||
				error.response?.data?.error?.[0]?.message ||
				'Hubo un error al registrar el acceso.';
			lanzarError(msgError);
		}
	};

	const reiniciarEscaner = () => {
		setQrLeido('');
		setInvitacion(null);
		setMensajeError('');
		setForm({ tipoDocumento: 'DPI', numeroDocumento: '', nombreReal: '', observaciones: '' });
		setEstadoPantalla('ESCANEAR');
	};

	return (
		<div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
			<div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
				<div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
					<div className="p-3 bg-indigo-500/10 rounded-xl">
						<ShieldCheck className="w-6 h-6 text-indigo-400" />
					</div>
					<div>
						<h2 className="text-xl font-bold text-white">Garita de Control</h2>
						<p className="text-sm text-zinc-400">Escáner de código QR de visitantes</p>
					</div>
				</div>

				{estadoPantalla === 'ESCANEAR' && (
					<div className="space-y-4">
						<div className="overflow-hidden rounded-xl border-2 border-dashed border-zinc-700 aspect-square max-w-sm mx-auto relative bg-black">
							<Scanner
								onScan={(resultado) => procesarQr(resultado)}
								onResult={(texto) => procesarQr(texto)}
								onError={(error) => console.log('Error de cámara:', error?.message)}
								options={{ delayBetweenScanAttempts: 500 }}
								formats={['qr_code']}
							/>
							<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
								<QrCode className="w-32 h-32 text-white/20" />
							</div>
						</div>
						<p className="text-center text-sm text-zinc-400">
							Apunta la cámara al código QR de la invitación.
						</p>

						<div className="pt-4 mt-4 border-t border-zinc-800 flex gap-2">
							<Entrada
								placeholder="Ej: QR-xxx o URL completa..."
								value={qrLeido}
								onChange={(e) => setQrLeido(e.target.value)}
							/>
							<BtnPrimario onClick={() => procesarQr(qrLeido)}>Validar</BtnPrimario>
						</div>
					</div>
				)}

				{estadoPantalla === 'VALIDANDO' && (
					<div className="py-20 text-center space-y-4">
						<div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
						<p className="text-indigo-400 font-bold animate-pulse">Consultando base de datos...</p>
					</div>
				)}

				{estadoPantalla === 'FORMULARIO' && invitacion && (
					<form onSubmit={registrarIngreso} className="space-y-5 animate-in slide-in-from-bottom-4">
						<div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-3">
							<CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
							<div>
								<h3 className="text-emerald-400 font-bold">¡Invitación Válida!</h3>
								<p className="text-sm text-emerald-500/80">
									Pase tipo {invitacion.TIPO} a nombre de {invitacion.NOMBRE_VISITANTE}
								</p>
							</div>
						</div>

						<div className="p-4 bg-zinc-800/50 rounded-xl space-y-4">
							<h4 className="text-sm font-bold text-white border-b border-zinc-700 pb-2 flex items-center gap-2">
								<UserCheck className="w-4 h-4" /> Verificación de Identidad
							</h4>

							<div className="grid grid-cols-2 gap-4">
								<Campo etiqueta="Tipo Documento">
									<Selector
										value={form.tipoDocumento}
										onChange={(e) => setForm({ ...form, tipoDocumento: e.target.value })}
									>
										<option value="DPI">DPI</option>
										<option value="Licencia">Licencia de Conducir</option>
									</Selector>
								</Campo>
								<Campo etiqueta="Número de Documento">
									<Entrada
										required
										placeholder="Ej: 2345 67890 0101"
										value={form.numeroDocumento}
										onChange={(e) => setForm({ ...form, numeroDocumento: e.target.value })}
									/>
								</Campo>
							</div>

							<Campo etiqueta="Nombre Real del Visitante (Según Documento)">
								<Entrada
									required
									value={form.nombreReal}
									onChange={(e) => setForm({ ...form, nombreReal: e.target.value })}
								/>
							</Campo>

							<Campo etiqueta="Placa del Vehículo u Observaciones">
								<Entrada
									placeholder="Opcional"
									value={form.observaciones}
									onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
								/>
							</Campo>
						</div>

						<div className="flex gap-3 pt-2">
							<button
								type="button"
								onClick={reiniciarEscaner}
								className="flex-1 py-2.5 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors"
							>
								Cancelar
							</button>
							<button
								type="submit"
								className="flex-1 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors"
							>
								Autorizar Ingreso
							</button>
						</div>
					</form>
				)}

				{estadoPantalla === 'ERROR' && (
					<div className="py-12 text-center space-y-4 animate-in zoom-in-95">
						<XCircle className="w-20 h-20 text-red-500 mx-auto" />
						<h3 className="text-xl font-bold text-red-400">Acceso Denegado</h3>
						<p className="text-zinc-400 max-w-sm mx-auto">{mensajeError}</p>
						<div className="pt-6">
							<BtnPrimario onClick={reiniciarEscaner}>Escanear Otro Código</BtnPrimario>
						</div>
					</div>
				)}

				{estadoPantalla === 'EXITO' && (
					<div className="py-12 text-center space-y-4 animate-in zoom-in-95">
						<div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
							<CheckCircle2 className="w-12 h-12 text-emerald-400" />
						</div>
						<h3 className="text-xl font-bold text-emerald-400">¡Ingreso Registrado!</h3>
						<p className="text-zinc-400">
							Se ha guardado la bitácora de acceso correctamente en la base de datos.
						</p>
						<div className="pt-6">
							<BtnPrimario onClick={reiniciarEscaner}>Regresar a la Garita</BtnPrimario>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
