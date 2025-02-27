import { Schema, model, Types } from 'mongoose';

export interface IRuta{
    nom: string;
    tipus: string; //circular, només anada, anada i tornada
    distancia: number; //en km
    desnivellPositiu: number; //en m
    desnivellNegatiu: number; //en m
    dificultat: string; //fàcil, moderat, difícil, molt difícil, només experts
    tempsEnMoviment: number; //en hores
    tempsTotal: number; //en hores
    altitudMaxima: number; //en m
    altitudMinima: number; //en m
    data: Date; //data de creació de la ruta
    autor?: Types.ObjectId; //id de l'usuari que ha creat la ruta
    _id?: string;
}

const rutaSchema = new Schema<IRuta>({
    nom: { type: String, required: true },
    tipus: { type: String, required: true },
    distancia: { type: Number, required: true },
    desnivellPositiu: { type: Number, required: true },
    desnivellNegatiu: { type: Number, required: true },
    dificultat: { type: String, required: true },
    tempsEnMoviment: { type: Number, required: true },
    tempsTotal: { type: Number, required: true },
    altitudMaxima: { type: Number, required: true },
    altitudMinima: { type: Number, required: true },
    data: { type: Date, required: true },
    autor: {type: Schema.Types.ObjectId, ref: 'User', required: false}
});

export const RutaModel = model('Ruta', rutaSchema);