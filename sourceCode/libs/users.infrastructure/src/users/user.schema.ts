import * as mongoose from 'mongoose';
import { SystemSchema } from '../systems/system.schema';
import { Schema } from 'mongoose';

export const UserSchema = new mongoose.Schema( {
    // id mongo se encarga de agregar la propiedad _id
    username: { type: String, required: false },
    password: { type: String, required: false },
    systems: [ { _id:  { type: Schema.Types.ObjectId, ref: 'System' } } ],

}, { strict: false });


export const GenericUserSchema = new mongoose.Schema( {
    }, { strict: false });
