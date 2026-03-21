import { PropiedadModel } from '../models/propiedad.js';

export const propiedadesController = {
    obtenerTodas: async (req, res) => {
        try {
            const propiedades = await PropiedadModel.obtenerTodas();
            res.json(propiedades);
        } catch (error) {
            console.error(error);
            res.status(500).json({ mensaje: 'Error interno del servidor al consultar Oracle' });
        }
    },

    obtenerPorId: async (req, res) => {
        try {
            const { id } = req.params;
            const propiedad = await PropiedadModel.obtenerPorId({ id });
            if (!propiedad) return res.status(404).json({ mensaje: 'Propiedad no encontrada' });
            res.json(propiedad);
        } catch (error) {
            console.error(error);
            res.status(500).json({ mensaje: 'Error interno del servidor' });
        }
    },

    crear: async (req, res) => {
        try {
            const nuevaPropiedad = await PropiedadModel.crear({ datos: req.body });
            res.status(201).json(nuevaPropiedad);
        } catch (error) {
            console.error(error);
            // Manejar error de número de propiedad duplicado
            if (error.errorNum === 1) { 
                return res.status(400).json({ mensaje: 'El número de propiedad ya existe en el sistema' });
            }
            res.status(500).json({ mensaje: 'Error interno al crear la propiedad' });
        }
    },

    actualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const propiedadActualizada = await PropiedadModel.actualizar({ id, datos: req.body });
            
            if (!propiedadActualizada) {
                return res.status(404).json({ mensaje: 'Propiedad no encontrada o sin cambios enviados' });
            }
            res.json(propiedadActualizada);
        } catch (error) {
            console.error(error);
            res.status(500).json({ mensaje: 'Error interno al actualizar la propiedad' });
        }
    }
};