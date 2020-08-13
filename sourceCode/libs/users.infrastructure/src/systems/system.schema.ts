import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const SystemSchema = new mongoose.Schema({

    // id mongo se encarga de agregar la propiedad _id
    name: { type: String, required: true },
    code: { type: String, required: true },
    description: { type: String, required: true },
    accountId: { type: Number, required: true },

});
