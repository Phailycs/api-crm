import { connectToDatabase } from "./dbConnection";
const mongoose = require('mongoose');
const { Schema } = mongoose;


export async function addCustomer(customerList: any[]) {
    try {

        const myJson = JSON.stringify(customerList);

        console.log('PAYLOAD ICI --------------');
        console.log(myJson);

        let { db } = await connectToDatabase();

        for (let i = 0; i < customerList.length; i++) {
            const newCustomer = {
                ...customerList[i],
                id: new mongoose.Types.ObjectId(),
            };
            await db.collection('customers').insertOne(newCustomer);
        }


        console.log('Les clients ont été ajoutés avec succès.');
        return true;
    } catch (err) {
        console.error('Erreur lors de l\'ajout des clients : ', err);
        return false;
    }
}