import * as mongoose from 'mongoose';


export const UserSystemSchema = new mongoose.Schema({

    defaultRoleId: { type: Number, required: false },
    userRoles: { type: [Number], required: false }

}, { strict: false } );