//codi principal pretèn ser el fitxer amb el que executarem

import mongoose from 'mongoose'; //importem la llibreria completa de mongoose, també podriem importar sols alguna part
import { User, IUser } from './user.js'; //de l'usuari que hem definit importo el model i la interfaç d'usuari
import { RutaModel, IRuta } from './ruta.js'; //de la ruta que hem definit importo el model i la interfaç de ruta



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
  const newUser= new User(user1); //agafem el model, li peguem dins la variable i acabem de crear un usuari nou
  const user2: IUser = await newUser.save(); //per guardar l'usuari nou a la base de dades, cridem a la funció save. ens torna exactament el mateix usuari que li estem posant (el usuari2 ara té el id de la base de dades)
  console.log("user2",user2);

  // findById devuelve un objeto usando el _id.
  //mètode per buscar un usuari per id, comprovant que el tenim dins la base de dades
  const user3: IUser | null = await User.findById(user2._id);
  console.log("user3",user3);
  //tenim moltes formes diferents de buscar dins la bbdd

  // findOne devuelve un objeto usando un filtro.
  const user4: IUser | null = await User.findOne({name: 'Bill'}); //buscar un document que tingui de nom Bill (només el primer que trobi)
  //en cas que Bill no estigui a la bbdd, ens tornarà null
  console.log("user4",user4);

  // Partial<IUser> Indica que el objeto puede tener solo algunos campos de IUser.
  // select('name email') solo devuelve name y email.
  // lean() devuelve un objeto plano de JS en lugar de un documento de Mongoose.
  const user5: Partial<IUser> | null  = await User.findOne({ name: 'Bill' })
    .select('name email').lean();  //de tot el post només ens interessa el nom i el correu. No compleix amb el contracte d'usuari, hem de utilitzar el tipus parcial
    //la funció lean ens deixarà sols un JSON amb el nom i email, farà neteja de la resta de coses --> més eficient
  console.log("user5",user5);


  //funcions CRUD per a les rutes

  //veure una ruta
  const getRutaByNom = async (nom: string): Promise<IRuta | null> => {
    return await RutaModel.findOne({nom}).populate('autor', 'name');
  }

  //crear una ruta
  const createRuta = async (ruta: IRuta) => {
    const novaRuta = new RutaModel(ruta).populate('autor', 'name');
    return await (await novaRuta).save();
  }

  //esborrar una ruta
  const deleteRuta = async (id: string) => {
    return await RutaModel.findByIdAndDelete(id);
  }

  //editar una ruta
  const updateRuta = async (id: string, ruta: Partial<IRuta>) => {
    return await RutaModel.findByIdAndUpdate(id, ruta, {new: true});
  }

  //contr el número de rutes utilitzant $count
  const countRutes = async () => {
    const result = await RutaModel.aggregate([{$count: 'total'}]);
    return result.length > 0 ? result[0].total : 0;
  }

  //llistar rutes
  const listRutes = async () =>{
    return await RutaModel.find().select('nom');
  }

  //exemple de ruta i ús de funcions CRUD
  const ruta1: IRuta = {
    "nom": "Ascenció Pica d'Estats",
    "tipus": "anada i tornada",
    "distancia": 17,
    "desnivellPositiu": 1613,
    "desnivellNegatiu": 1613,
    "dificultat": "moderat",
    "tempsEnMoviment": 8,
    "tempsTotal": 11,
    "altitudMaxima": 3143,
    "altitudMinima": 1900,
    "data": new Date(),
    "autor": newUser._id
  };

  const novaRuta = await createRuta(ruta1);
  console.log("Nova ruta", novaRuta);

  const trobarRuta = await getRutaByNom("Ascenció Pica d'Estats");
  console.log("Ruta trobada", trobarRuta);
  
  const modificarRuta = await updateRuta(novaRuta._id, {dificultat: "difícil"});
  console.log("Ruta modificada", modificarRuta);

  const totalRutes = await countRutes();
  console.log("Nombre total de rutes a la bbdd:", totalRutes);

  const llistaRutes = await listRutes();
  console.log("Llista de rutes", llistaRutes);

  const esborrarRuta = await deleteRuta(novaRuta._id);
  console.log("Ruta esborrada", esborrarRuta);
}

main()

    
