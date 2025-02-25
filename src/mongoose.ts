//codi principal pretèn ser el fitxer amb el que executarem

import mongoose from 'mongoose'; //importem la llibreria completa de mongoose, també podriem importar sols alguna part
import { UserModel, IUser } from './user.js'; //de l'usuari que hem definit importo el model i la interfaç d'usuari



async function main() {
  mongoose.set('strictQuery', true); // Mantiene el comportamiento actual

  await mongoose.connect('mongodb://127.0.0.1:27017/test') //primer pas, connectar-me a la base de dades (si la tenim en local posem direcció i si és del cloud posem la url)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar:', err));

  //com crear un usuari nou per posar a la base de dades?
  //creem una variable que compleixi amb la interfície d'usuari
  const user1:  IUser = {
    "name": 'Bill',
    "email": 'bill@initech.com',
    "avatar": 'https://i.imgur.com/dM7Thhn.png'
  };

  console.log("user1", user1); 
  const newUser= new UserModel(user1); //agafem el model, li peguem dins la variable i acabem de crear un usuari nou
  const user2: IUser = await newUser.save(); //per guardar l'usuari nou a la base de dades, cridem a la funció save. ens torna exactament el mateix usuari que li estem posant (el usuari2 ara té el id de la base de dades)
  console.log("user2",user2);

  // findById devuelve un objeto usando el _id.
  //mètode per buscar un usuari per id, comprovant que el tenim dins la base de dades
  const user3: IUser | null = await UserModel.findById(user2._id);
  console.log("user3",user3);
  //tenim moltes formes diferents de buscar dins la bbdd

  // findOne devuelve un objeto usando un filtro.
  const user4: IUser | null = await UserModel.findOne({name: 'Bill'}); //buscar un document que tingui de nom Bill (només el primer que trobi)
  //en cas que Bill no estigui a la bbdd, ens tornarà null
  console.log("user4",user4);

  // Partial<IUser> Indica que el objeto puede tener solo algunos campos de IUser.
  // select('name email') solo devuelve name y email.
  // lean() devuelve un objeto plano de JS en lugar de un documento de Mongoose.
  const user5: Partial<IUser> | null  = await UserModel.findOne({ name: 'Bill' })
    .select('name email').lean();  //de tot el post només ens interessa el nom i el correu. No compleix amb el contracte d'usuari, hem de utilitzar el tipus parcial
    //la funció lean ens deixarà sols un JSON amb el nom i email, farà neteja de la resta de coses --> més eficient
  console.log("user5",user5);
}

main()

    
