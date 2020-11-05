import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import { User } from 'usr/users.domain';
import * as mongoose from 'mongoose';
import { throws } from 'assert';


@Injectable()
export class UserRepositoryService {

    constructor(@InjectModel('User') private readonly userModel: Model<User & Document>) {

    }

    /**
     * Obtiene todos los usuarios
     */
    public async getAll(): Promise<User[]> {

        const users: User[] = await this.userModel.find();

        return users;

      }

    /**
     * Obtiene un usuario por su nombre de usuario (username)
     * @param username
     */
    public async findByUsername(username: string): Promise<User> {

      const user = await this.userModel.findOne( { username });

      if (!user) {
          throw new NotFoundException();
      }

      return user;
    }



    /**
     * Obtiene un usuario por su nombre de usuario (username) y el identificador del sistema que ese
     * usuario usa. Si el usuario no esa el sistema indicado entonces se considera que no existe.
     * @param username nombre de usuario
     * @param systemId identificador del sistema
     */
    public async findByUsernameAndSystemId(username: string, systemId: string): Promise<User> {
      try {
      return await this.userModel.findOne( { username, systems: { _id: systemId } });
    } catch (error) {
      throw error;
    }
  }



  public async findByPropertyValueAndSystemId(propertyNameAndValueObject: any, systemId: string): Promise<User> {
    try {
      const propertyNameAndValueObjectCopy =  { ...propertyNameAndValueObject }; // Object.assign({}, propertyNameAndValueObject);
      propertyNameAndValueObjectCopy.systems = { _id: systemId };
      const result = await this.userModel.findOne(propertyNameAndValueObjectCopy);
      return result;
    } catch (error) {
      throw error;
  }
}


    /**
     * 
     * @param user usuario a guardar
     */
    public async add(user: User): Promise<User & Document> {

      try {
      // tslint:disable-next-line: arrow-return-shorthand
        const systemIdsAsObjectsIds = user.systems.map(systemId =>  { return {_id: mongoose.Types.ObjectId(systemId._id) }; } );
        const newUser = new this.userModel( { username: user.username, password: user.password, systems: user.systems });
        return await newUser.save().catch(error => { throw error; });
      } catch (error) {
        throw error;
      }
    }


    public async addGeneric(user: any): Promise<any & Document> {

      try {
        const newUser = new this.userModel(user);
        return await newUser.save().catch(error => { throw error; });
      } catch (error) {
        throw error;
      }
    }

    /**
     * Actualiza un usuario / update a user
     * @param username nombre de usuario/username
     * @param systemId id del sistema / id system
     * @param update objeto que contiene las propiedades a actualizar / object that contains the properties to update
     */
    public async update(username: string, systemId: string, update: any) {

      try {

        // Para la actualizacion, se usan los metodos de la entidad obtenida, en este caso userToUpdate
        // es posible usar tambien los metodos del modelo (this.userModel)
        if ( update != null && update != undefined ) {

          // Se obtiene el usuario usando con el nombre de usuario e id del sistema
          const userToUpdate = await this.userModel.findOne( { username, systems: { _id: systemId } });

          // Si el usuario no existe se retorna null
          if ( userToUpdate == null && userToUpdate == undefined ) {
            return null;
        }

          // Se hace la actualizacion
          const updateResult = await userToUpdate.updateOne(update);
          if ( updateResult.ok === 1) {
            return userToUpdate;
          }
          // No se realizo la actualizacion, entonces se devuelve nulo
          return null;
        }

        // No se realizo la actualizacion, entonces se devuelve nulo
        return null;

      } catch (exception) {
        throw exception;
      }
    }
}
