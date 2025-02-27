//pretèn ser la configuració

import { Schema, Types, model } from 'mongoose';

//necessitem una interfaç (tots els objectes JSON que compleixin aquesta interfície podran ser tractats com a IUser)

// 1. Create an interface representing a TS object.
export interface IUser {
  name: string;
  email: string;
  avatar?: string;
  _id?: Types.ObjectId;
}

//també necessitem guardar quina és la estructura de dades que jo vull guardar dins el mongo, esquema

// 2. Create a Schema corresponding to the document in MongoDB.
const userSchema = new Schema<IUser>({ //(condicions que ha de complir el document)
  name: { type: String, required: true }, //definim nom, afegim tipus i si és obligatori o no
  email: { type: String, required: true },
  avatar: String
});

//ajuntem les dues peces i generem un model d'usuari nou

// 3. Create a Model.
export const User = model('User', userSchema);


//és un esquema de mongo i és una interfaç de usuari de typescript, per tant podem utilitzar-lo per a les dues coses (mongo i js)