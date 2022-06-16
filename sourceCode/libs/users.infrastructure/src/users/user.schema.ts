import * as mongoose from 'mongoose';
import { SystemSchema } from '../systems/system.schema';
import { Schema } from 'mongoose';
import { UserSystemSchema } from './user-system.schema';

export const UserSchema = new mongoose.Schema( {
    // id mongo se encarga de agregar la propiedad _id
    username: { type: String, required: true },
    password: { type: String, required: true },
     systems: {type: [ UserSystemSchema ], required: false},
    //We let this comment to save how to
    // systems: [ { _id:  { type: Schema.Types.ObjectId, ref: 'System' } } ],

}, { strict: false });


export const GenericUserSchema = new mongoose.Schema( {
    }, { strict: false });
