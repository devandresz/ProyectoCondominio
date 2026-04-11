// ============================================================
// 📁 RUTA: frontend/src/App.jsx
// ============================================================

import { useEffect } from 'react';
import EnrutadorPrincipal from './rutas/EnrutadorPrincipal.jsx';
import useStore from './estado/useStore.js';
import { Toaster } from 'sonner';

export default function App() {
	const temaOscuro = useStore((s) => s.temaOscuro);

	// Aplica o quita la clase 'claro' en el <html> cada vez que cambia el tema
	// Las variables CSS en index.css reaccionan a :root.claro
	useEffect(() => {
		const root = document.documentElement;
		if (temaOscuro) {
			root.classList.remove('claro');
		} else {
			root.classList.add('claro');
		}
	}, [temaOscuro]);

	return (
		<>
			{/* El Toaster va aquí, junto a tu enrutador */}
			<Toaster position="top-right" richColors />
			<EnrutadorPrincipal />
		</>
	);
}
