import { useState, useRef, useEffect } from 'react';

/* ============================================================
   CABALLO ANIMADO — ESTILO TUNNELBEAR
   Comportamientos:
   - Ojos siguen el cursor de texto (caracter a caracter)
   - Orejas se mueven al escribir en usuario
   - Se tapa los ojos con las pezuñas cuando contraseña está oculta
   - Espía entre los dedos separados cuando se muestra la contraseña
     (dedo índice+medio separados del anular+meñique = rendija de visión)
   - Parpadeo aleatorio en reposo
   - Cabeceo suave al pasar entre campos
============================================================ */
export function CaballoAnimado({ tapado, asomado, pupilaX, pupilaY }) {
	const [parpadeo, setParpadeo] = useState(false);
	const [orejas, setOrejas] = useState(false);
	const animandoRef = useRef(false);
	const intervaloRef = useRef(null);

	// Parpadeo aleatorio cuando los ojos están visibles
	useEffect(() => {
		if (tapado && !asomado) return;
		let timeout;
		const programar = () => {
			const delay = 2500 + Math.random() * 3500;
			timeout = setTimeout(() => {
				setParpadeo(true);
				setTimeout(() => setParpadeo(false), 130);
				programar();
			}, delay);
		};
		programar();
		return () => clearTimeout(timeout);
	}, [tapado, asomado]);

	// Movimiento de orejas al escribir en el campo usuario
	useEffect(() => {
		if (pupilaX !== 0 || pupilaY !== 0) {
			if (!animandoRef.current) {
				animandoRef.current = true;
				// Oscilación suave: ±4 grados, nada más
				intervaloRef.current = setInterval(() => setOrejas((p) => !p), 350);
			}
		} else {
			if (animandoRef.current) {
				animandoRef.current = false;
				clearInterval(intervaloRef.current);
				setOrejas(false);
			}
		}
		return () => {};
	}, [pupilaX, pupilaY]);

	useEffect(() => () => clearInterval(intervaloRef.current), []);

	const parpado = parpadeo ? 7 : 0;
	const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

	// Pupila: clamp dentro del iris (radio iris 6.5, radio pupila 4 → max desplaz ~2.5)
	const px = clamp(pupilaX, -2.4, 2.4);
	const py = clamp(pupilaY, -1.8, 1.8);

	// Centros de cada ojo en reposo
	const izqCX = 48,
		izqCY = 47;
	const derCX = 72,
		derCY = 47;

	// Posición final de pupila
	const izqX = izqCX + px;
	const izqY = izqCY + py;
	const derX = derCX + px;
	const derY = derCY + py;

	// Paleta
	const C = '#7B3F1A';
	const CH = '#B86A2E';
	const CP = '#2C1208';
	const CS = '#5E2E0E';

	// Ángulo de orejas: muy suave, solo ±4 grados
	const anguloOreja = orejas ? 4 : -4;

	return (
		<svg
			viewBox="0 0 120 135"
			width="140"
			height="140"
			xmlns="http://www.w3.org/2000/svg"
			style={{ filter: 'drop-shadow(0 10px 28px rgba(0,0,0,0.55))', overflow: 'visible' }}
		>
			{/* Cuerpo */}
			<ellipse cx="60" cy="112" rx="42" ry="32" fill={C} />
			{/* Cuello */}
			<path d="M 36 100 Q 40 60 60 55 Q 80 60 84 100 Z" fill={C} />
			{/* Crin */}
			<path d="M 80 52 Q 96 72 88 102 Q 76 82 80 52" fill={CP} />

			{/* ── OREJAS — rotación suave y pequeña alrededor de su base ── */}
			<g
				style={{
					transformOrigin: '44px 36px',
					transform: `rotate(${anguloOreja}deg)`,
					transition: 'transform 0.3s ease',
				}}
			>
				<ellipse cx="44" cy="26" rx="8" ry="13" fill={C} />
				<ellipse cx="44" cy="27" rx="5" ry="9" fill={CS} />
			</g>
			<g
				style={{
					transformOrigin: '76px 36px',
					transform: `rotate(${-anguloOreja}deg)`,
					transition: 'transform 0.3s ease',
				}}
			>
				<ellipse cx="76" cy="26" rx="8" ry="13" fill={C} />
				<ellipse cx="76" cy="27" rx="5" ry="9" fill={CS} />
			</g>

			{/* Cabeza — dibujada DESPUÉS de las orejas para solapar su base */}
			<ellipse cx="60" cy="56" rx="29" ry="33" fill={C} />
			{/* Flequillo */}
			<path d="M 38 34 Q 60 16 82 34 Q 68 48 60 50 Q 52 48 38 34" fill={CP} />

			{/* ════ ESTADO A — OJOS ABIERTOS (sin foco en contraseña) ════ */}
			<g style={{ transition: 'opacity 0.3s ease', opacity: tapado ? 0 : 1 }}>
				{/* Ojo izquierdo */}
				<circle cx="48" cy="47" r="9" fill="white" />
				<circle cx="48" cy="47" r="6.5" fill="#f5e642" />
				<circle
					style={{ transition: 'cx 0.14s ease-out, cy 0.14s ease-out' }}
					cx={izqX}
					cy={izqY}
					r="4"
					fill={CP}
				/>
				<circle
					style={{ transition: 'cx 0.14s ease-out, cy 0.14s ease-out' }}
					cx={izqX + 1.5}
					cy={izqY - 1.5}
					r="1.4"
					fill="white"
				/>
				{/* Párpado */}
				<rect
					x="38.5"
					y={47 - 9}
					width="19"
					height={parpado}
					rx="2"
					fill={C}
					style={{ transition: 'height 0.1s ease' }}
				/>

				{/* Ojo derecho */}
				<circle cx="72" cy="47" r="9" fill="white" />
				<circle cx="72" cy="47" r="6.5" fill="#f5e642" />
				<circle
					style={{ transition: 'cx 0.14s ease-out, cy 0.14s ease-out' }}
					cx={derX}
					cy={derY}
					r="4"
					fill={CP}
				/>
				<circle
					style={{ transition: 'cx 0.14s ease-out, cy 0.14s ease-out' }}
					cx={derX + 1.5}
					cy={derY - 1.5}
					r="1.4"
					fill="white"
				/>
				<rect
					x="62.5"
					y={47 - 9}
					width="19"
					height={parpado}
					rx="2"
					fill={C}
					style={{ transition: 'height 0.1s ease' }}
				/>

				{/* Hocico */}
				<ellipse cx="60" cy="72" rx="22" ry="14" fill={CH} />
				<circle cx="53" cy="70" r="3.5" fill={CS} />
				<circle cx="67" cy="70" r="3.5" fill={CS} />
				<path
					d="M 55 78 Q 60 82 65 78"
					stroke={CS}
					strokeWidth="1.8"
					fill="none"
					strokeLinecap="round"
				/>
			</g>

			{/* ════ ESTADO B — TAPADO: pezuñas cerradas sobre ojos ════
			     Se activa cuando: focusPassword=true Y mostrarPassword=false
			     tapado = true, asomado = false
			*/}
			<g
				style={{
					transition: 'opacity 0.3s ease',
					opacity: tapado && !asomado ? 1 : 0,
					pointerEvents: 'none',
				}}
			>
				{/* Hocico */}
				<ellipse cx="60" cy="72" rx="22" ry="14" fill={CH} />
				<circle cx="53" cy="70" r="3.5" fill={CS} />
				<circle cx="67" cy="70" r="3.5" fill={CS} />

				{/* Brazo izquierdo */}
				<path
					d="M 34 108 Q 24 76 44 50"
					stroke={C}
					strokeWidth="14"
					strokeLinecap="round"
					fill="none"
				/>
				{/* Palma izquierda */}
				<ellipse cx="41" cy="46" rx="12" ry="9" fill={CP} transform="rotate(-20 41 46)" />
				{/* 4 dedos juntos izquierda */}
				<rect
					x="24"
					y="37"
					width="6.5"
					height="11"
					rx="3.2"
					fill={CP}
					transform="rotate(-32 27 42)"
				/>
				<rect
					x="30"
					y="34"
					width="6.5"
					height="11"
					rx="3.2"
					fill={CP}
					transform="rotate(-18 33 39)"
				/>
				<rect
					x="36"
					y="33"
					width="6.5"
					height="11"
					rx="3.2"
					fill={CP}
					transform="rotate(-4 39 38)"
				/>
				<rect
					x="42"
					y="34"
					width="6.5"
					height="11"
					rx="3.2"
					fill={CP}
					transform="rotate(10 45 39)"
				/>

				{/* Brazo derecho */}
				<path
					d="M 86 108 Q 96 76 76 50"
					stroke={C}
					strokeWidth="14"
					strokeLinecap="round"
					fill="none"
				/>
				{/* Palma derecha */}
				<ellipse cx="79" cy="46" rx="12" ry="9" fill={CP} transform="rotate(20 79 46)" />
				{/* 4 dedos juntos derecha */}
				<rect
					x="90"
					y="37"
					width="6.5"
					height="11"
					rx="3.2"
					fill={CP}
					transform="rotate(32 93 42)"
				/>
				<rect
					x="84"
					y="34"
					width="6.5"
					height="11"
					rx="3.2"
					fill={CP}
					transform="rotate(18 87 39)"
				/>
				<rect
					x="78"
					y="33"
					width="6.5"
					height="11"
					rx="3.2"
					fill={CP}
					transform="rotate(4 81 38)"
				/>
				<rect
					x="72"
					y="34"
					width="6.5"
					height="11"
					rx="3.2"
					fill={CP}
					transform="rotate(-10 75 39)"
				/>
			</g>

			{/* ════ ESTADO C — ESPIANDO entre dedos separados ════
			     Se activa cuando: focusPassword=true Y mostrarPassword=true
			     tapado = false (por lógica), entonces usamos prop "asomado" directo
			     NOTA: asomado = focusPassword && mostrarPassword (redefinido en PantallasLibres)
			*/}
			<g
				style={{
					transition: 'opacity 0.3s ease',
					opacity: asomado ? 1 : 0,
					pointerEvents: 'none',
				}}
			>
				{/* Hocico */}
				<ellipse cx="60" cy="72" rx="22" ry="14" fill={CH} />
				<circle cx="53" cy="70" r="3.5" fill={CS} />
				<circle cx="67" cy="70" r="3.5" fill={CS} />

				{/* Ojos espiando por la rendija */}
				<circle cx="48" cy="47" r="9" fill="white" />
				<circle cx="48" cy="47" r="6.5" fill="#f5e642" />
				<circle
					style={{ transition: 'cx 0.14s ease-out, cy 0.14s ease-out' }}
					cx={izqX}
					cy={izqY}
					r="4"
					fill={CP}
				/>
				<circle
					style={{ transition: 'cx 0.14s ease-out, cy 0.14s ease-out' }}
					cx={izqX + 1.5}
					cy={izqY - 1.5}
					r="1.4"
					fill="white"
				/>
				<circle cx="72" cy="47" r="9" fill="white" />
				<circle cx="72" cy="47" r="6.5" fill="#f5e642" />
				<circle
					style={{ transition: 'cx 0.14s ease-out, cy 0.14s ease-out' }}
					cx={derX}
					cy={derY}
					r="4"
					fill={CP}
				/>
				<circle
					style={{ transition: 'cx 0.14s ease-out, cy 0.14s ease-out' }}
					cx={derX + 1.5}
					cy={derY - 1.5}
					r="1.4"
					fill="white"
				/>

				{/* ── MANO IZQUIERDA con rendija ── */}
				<path
					d="M 34 108 Q 24 76 44 50"
					stroke={C}
					strokeWidth="14"
					strokeLinecap="round"
					fill="none"
				/>
				<ellipse cx="41" cy="46" rx="12" ry="9" fill={CP} transform="rotate(-20 41 46)" />
				{/* Anular + meñique — debajo de la rendija */}
				<rect
					x="24"
					y="44"
					width="6.5"
					height="10"
					rx="3.2"
					fill={CP}
					transform="rotate(-32 27 49)"
				/>
				<rect
					x="30"
					y="42"
					width="6.5"
					height="10"
					rx="3.2"
					fill={CP}
					transform="rotate(-18 33 47)"
				/>
				{/* Índice + medio — arriba de la rendija (separados ~7px) */}
				<rect
					x="36"
					y="28"
					width="6.5"
					height="10"
					rx="3.2"
					fill={CP}
					transform="rotate(-4 39 33)"
				/>
				<rect
					x="42"
					y="27"
					width="6.5"
					height="10"
					rx="3.2"
					fill={CP}
					transform="rotate(10 45 32)"
				/>

				{/* ── MANO DERECHA con rendija ── */}
				<path
					d="M 86 108 Q 96 76 76 50"
					stroke={C}
					strokeWidth="14"
					strokeLinecap="round"
					fill="none"
				/>
				<ellipse cx="79" cy="46" rx="12" ry="9" fill={CP} transform="rotate(20 79 46)" />
				{/* Anular + meñique — debajo */}
				<rect
					x="90"
					y="44"
					width="6.5"
					height="10"
					rx="3.2"
					fill={CP}
					transform="rotate(32 93 49)"
				/>
				<rect
					x="84"
					y="42"
					width="6.5"
					height="10"
					rx="3.2"
					fill={CP}
					transform="rotate(18 87 47)"
				/>
				{/* Índice + medio — arriba */}
				<rect
					x="72"
					y="27"
					width="6.5"
					height="10"
					rx="3.2"
					fill={CP}
					transform="rotate(-10 75 32)"
				/>
				<rect
					x="78"
					y="28"
					width="6.5"
					height="10"
					rx="3.2"
					fill={CP}
					transform="rotate(4 81 33)"
				/>
			</g>
		</svg>
	);
}

/* ============================================================
   ANIMACIÓN DE CARGA — CONDOMINIO NOCTURNO ANIMADO
============================================================ */
export function AnimacionCarga({ mensaje }) {
	const [frame, setFrame] = useState(0);
	const [puntos, setPuntos] = useState(0);

	useEffect(() => {
		const iv = setInterval(() => setFrame((f) => f + 1), 400);
		return () => clearInterval(iv);
	}, []);
	useEffect(() => {
		const iv = setInterval(() => setPuntos((p) => (p + 1) % 4), 500);
		return () => clearInterval(iv);
	}, []);

	const ventanas = Array.from({ length: 30 }, (_, i) => ({
		x: 14 + (i % 6) * 16,
		y: 28 + Math.floor(i / 6) * 14,
		encendida: (i * 7 + frame * 3) % 11 > 3,
	}));
	const ventanasTorre = Array.from({ length: 15 }, (_, i) => ({
		x: 52 + (i % 3) * 12,
		y: 10 + Math.floor(i / 3) * 14,
		encendida: (i * 5 + frame * 2) % 9 > 3,
	}));

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				width: '100%',
				height: '100%',
				background: '#09090b',
				position: 'relative',
				overflow: 'hidden',
			}}
		>
			{/* Grid de fondo */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					backgroundImage:
						'linear-gradient(rgba(63,63,70,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(63,63,70,0.12) 1px, transparent 1px)',
					backgroundSize: '40px 40px',
				}}
			/>
			{/* Glow */}
			<div
				style={{
					position: 'absolute',
					top: '30%',
					left: '50%',
					transform: 'translate(-50%,-50%)',
					width: '400px',
					height: '300px',
					background: 'radial-gradient(ellipse, rgba(250,250,250,0.04) 0%, transparent 70%)',
					filter: 'blur(60px)',
					pointerEvents: 'none',
				}}
			/>

			{/* Edificios SVG */}
			<div style={{ position: 'relative', zIndex: 10, marginBottom: '32px' }}>
				<svg viewBox="0 0 160 130" width="200" height="162" xmlns="http://www.w3.org/2000/svg">
					{/* Edificio izquierdo */}
					<rect
						x="8"
						y="22"
						width="60"
						height="98"
						rx="3"
						fill="#18181b"
						stroke="#3f3f46"
						strokeWidth="1.5"
					/>
					<rect
						x="6"
						y="18"
						width="64"
						height="6"
						rx="2"
						fill="#27272a"
						stroke="#3f3f46"
						strokeWidth="1"
					/>
					{ventanas.map((v, i) => (
						<rect
							key={i}
							x={v.x}
							y={v.y}
							width="9"
							height="7"
							rx="1.5"
							fill={v.encendida ? '#fef08a' : '#27272a'}
							style={{
								transition: 'fill 0.4s ease',
								filter: v.encendida ? 'drop-shadow(0 0 3px #fde047)' : 'none',
							}}
						/>
					))}
					{/* Torre central */}
					<rect
						x="46"
						y="6"
						width="34"
						height="114"
						rx="3"
						fill="#1c1c1f"
						stroke="#3f3f46"
						strokeWidth="1.5"
					/>
					<rect
						x="44"
						y="2"
						width="38"
						height="6"
						rx="2"
						fill="#27272a"
						stroke="#3f3f46"
						strokeWidth="1"
					/>
					<line x1="63" y1="2" x2="63" y2="-10" stroke="#52525b" strokeWidth="1.5" />
					<circle
						cx="63"
						cy="-11"
						r="2"
						fill={frame % 3 === 0 ? '#ef4444' : '#7f1d1d'}
						style={{ transition: 'fill 0.4s' }}
					/>
					{ventanasTorre.map((v, i) => (
						<rect
							key={i}
							x={v.x}
							y={v.y}
							width="8"
							height="6"
							rx="1.5"
							fill={v.encendida ? '#bfdbfe' : '#27272a'}
							style={{
								transition: 'fill 0.35s ease',
								filter: v.encendida ? 'drop-shadow(0 0 2px #93c5fd)' : 'none',
							}}
						/>
					))}
					{/* Edificio derecho */}
					<rect
						x="92"
						y="34"
						width="52"
						height="86"
						rx="3"
						fill="#18181b"
						stroke="#3f3f46"
						strokeWidth="1.5"
					/>
					<rect
						x="90"
						y="30"
						width="56"
						height="6"
						rx="2"
						fill="#27272a"
						stroke="#3f3f46"
						strokeWidth="1"
					/>
					{Array.from({ length: 20 }, (_, i) => ({
						x: 98 + (i % 4) * 12,
						y: 40 + Math.floor(i / 4) * 14,
						enc: (i * 11 + frame * 4) % 13 > 5,
					})).map((v, i) => (
						<rect
							key={i}
							x={v.x}
							y={v.y}
							width="7"
							height="6"
							rx="1.5"
							fill={v.enc ? '#bbf7d0' : '#27272a'}
							style={{
								transition: 'fill 0.45s ease',
								filter: v.enc ? 'drop-shadow(0 0 2px #86efac)' : 'none',
							}}
						/>
					))}
					{/* Suelo */}
					<rect x="0" y="118" width="160" height="4" rx="2" fill="#27272a" />
					<rect
						x="55"
						y="118"
						width="16"
						height="12"
						rx="1"
						fill="#1c1c1f"
						stroke="#3f3f46"
						strokeWidth="0.5"
					/>
					{/* Luna y estrellas */}
					<circle cx="142" cy="16" r="8" fill="#27272a" stroke="#3f3f46" strokeWidth="1" />
					<circle cx="145" cy="14" r="6" fill="#09090b" />
					{[
						[20, 8],
						[30, 4],
						[8, 16],
						[150, 30],
						[132, 8],
					].map(([sx, sy], i) => (
						<circle
							key={i}
							cx={sx}
							cy={sy}
							r="1"
							fill={(i + frame) % 3 === 0 ? '#fafafa' : '#52525b'}
							style={{ transition: 'fill 0.6s' }}
						/>
					))}
				</svg>
			</div>

			{/* Barra de progreso */}
			<div
				style={{
					width: '220px',
					height: '3px',
					background: '#27272a',
					borderRadius: '999px',
					overflow: 'hidden',
					marginBottom: '20px',
					position: 'relative',
					zIndex: 10,
				}}
			>
				<div
					style={{
						height: '100%',
						borderRadius: '999px',
						background: 'linear-gradient(90deg, #fafafa, #71717a)',
						animation: 'barraProgreso 1.5s ease-in-out infinite',
					}}
				/>
			</div>

			<p
				style={{
					fontSize: '15px',
					fontWeight: 700,
					color: '#fafafa',
					letterSpacing: '-0.3px',
					position: 'relative',
					zIndex: 10,
					marginBottom: '6px',
				}}
			>
				{mensaje}
				{''.padEnd(puntos, '.')}
			</p>
			<p style={{ fontSize: '12px', color: '#52525b', position: 'relative', zIndex: 10 }}>
				Condominio PuraFé
			</p>
		</div>
	);
}
