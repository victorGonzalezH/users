import { Injectable, Logger } from '@nestjs/common';
import { Observable, from, of } from 'rxjs';
import { UserDto } from './users/user.dto';
import { UserRepositoryService } from 'usr/users.infrastructure/users/user-repository.service';
import { User, BaseUser, UserException } from 'usr/users.domain';
import { SaveUserCommand } from './useCases/saveUser/saveUser.command';
import { AppNotFoundException, AppBadRequestException, DataTypes, CallSources } from 'utils';
import { AppConfigService } from './configuration/appConfig.service';
import { ApiResultBase, EnvironmentTypes, Langs, Message, MessagesRepositoryService } from 'utils';
import { UserSystem } from 'usr/users.domain/models/user-system.model';

// import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersApplicationService {

    constructor(private usersRepository: UserRepositoryService,
                private logger: Logger, private appConfigService: AppConfigService,
                private messagesRepository: MessagesRepositoryService) {

    }

    private isUserException(exception: any): exception is UserException  {
        return (exception as UserException).Message !== undefined;
    }

    /**
     * Convierte un arreglo de usuarios de dominio a un arreglo de usuarios dtos
     * @param users arreglo de usuarios de dominio
     */
    private convertToUsersDtos(users: User[], callSource = CallSources.WebClient, systemId: string) {

        return users.map(user => this.convertToUserDto(user, callSource, systemId));
    }

    /**
     * Converts a domain user to a user dto entity
     * @param user Usuario de dominio
     * @param callSource origen de la llamada
     */
    private convertToUserDto(user: User, callSource = CallSources.WebClient, systemId: string): UserDto {

        const system: UserSystem = user.systems.filter(systemLocal => systemLocal._id == systemId)[0];
        //console.log(system);
        //console.log(user.systems[0].userRoles);
        if (!user) { return null; }
        if (callSource === CallSources.WebClient) {
            return {id: user.id, username: user.username, roles: system.userRoles.map(rol => rol.toString()) };
        } else {
            
            return { id: user.id, username: user.username, password : user.password, roles: system.userRoles.map(rol => rol.toString()) };
        }
    }

    /**
     * Obtiene los usuarios
     * @param source
     */
    // async Get(callSource = CallSources.WebClient): Promise<UserDto[]> {
    //     const users: User[] = await this.usersRepository.getAll();
    //     return of(this.convertToUsersDtos(users, callSource, )).toPromise();
    // }

    /**
     * Gets a user using its username
     * Obtiene un usuario mediante su nombre de usuario (propiedad username)
     * @param username Nombre de usuario
     * @param callSource origen de la llamada. Un cero indica que la llamada ha sido hecha por un cliente web, un valor
     * diferente de cero indica que llamada la hizo un cluente que no es web, por ejemplo algun microservicio por lo tanto,
     * se puede devolver el usuario con todas sus propiedades incluidas en el dto
     */
    async getByUsernameAndSystemId(username: string, systemId: string, callSource = CallSources.WebClient): Promise<any> {
     try {
         
         // aqui se hace esta instanciacion para verificar que el username y el systemId cumplen con las especificaciones
         // de que estipula la clase User, si ocurre un error de validacion, la clase Simple user lanzara una excepcion
        const simpleUser: BaseUser = new BaseUser(username, systemId);
        const user: User = await this.usersRepository.findByUsernameAndSystemId(username, systemId);
        if (!user) {
            throw new AppNotFoundException();
        }

        //if callSource is a microservice, then return the complete user, otherwise return
        // the userDto
        return callSource === CallSources.Microservice ? of(user).toPromise(): of(this.convertToUserDto(user, callSource, systemId)).toPromise();

    } catch (exception) {
            console.log('Error');
            console.log(exception);
            this.logger.error(exception);
            if ( exception instanceof UserException) {
                const message = (exception as UserException).Message;
                throw new AppBadRequestException(message);
            }
            if (exception instanceof AppNotFoundException ) {
                throw exception;
            }

            const error = this.appConfigService.getEnvironment() === EnvironmentTypes.dev || callSource === CallSources.Microservice ? exception : {};
            throw error;
        }
    }


    /**
     * 
     * @param propertyName 
     * @param propertyValue 
     * @param propertyType 
     * @param systemId 
     * @param callSource 
     * @returns 
     */
    async getByPropertyNameValueAndSystemId(propertyName: string, propertyValue: any, propertyType: DataTypes, systemId: string, callSource = CallSources.WebClient): Promise<any> {
        try {
           const propertyAndValueObject = {};
           switch(propertyType)
           {
               case DataTypes.string: 
                propertyAndValueObject[propertyName] = propertyValue;
               break;

               case DataTypes.number:
                propertyAndValueObject[propertyName] = Number.parseInt(propertyValue, 10);
               break;

               case DataTypes.date: 
                propertyAndValueObject[propertyName] = Date.parse(propertyValue);
               break;
           }
           
           const user: User = await this.usersRepository.findByPropertyValueAndSystemId(propertyAndValueObject, systemId);
           if (!user) {
               throw new AppNotFoundException();
           }
           // return of(this.convertToUserDto(user, callSource)).toPromise();
           return of(user).toPromise();
       } catch (exception) {
               this.logger.error(exception);
               if ( exception instanceof UserException) {
                   const message = (exception as UserException).Message;
                   throw new AppBadRequestException(message);
               }
               if (exception instanceof AppNotFoundException ) {
                   throw exception;
               }

               const error = this.appConfigService.getEnvironment() === EnvironmentTypes.dev || callSource === 1 ? exception : {};
               throw error;
           }
       }


    /**
     * 
     * @param saveUserCommand comando para guardar un usuario
     * @param callSource origen de la llamada. Un cero indica que la llamada ha sido hecha por un cliente web, un valor
     * diferente de cero indica que llamada la hizo un cliente que no es web, por ejemplo algun microservicio, por lo tanto,
     * se puede devolver el usuario con todas sus propiedades incluidas en el dto
     */
    async save(saveUserCommand: SaveUserCommand, callSource = CallSources.WebClient) {
     try {
            const user: User = 
                new User (saveUserCommand.username,
                saveUserCommand.password,
                saveUserCommand.name, saveUserCommand.lastName, 
                saveUserCommand.systemId,
                saveUserCommand.roleId);
            if ( saveUserCommand.othersProperties != undefined ) {
                const userWithCustomProperties: any = { };
                Object.keys(user).forEach(key => userWithCustomProperties[key] = user[key]);
                Object.keys(saveUserCommand.othersProperties).forEach(key => userWithCustomProperties[key] = saveUserCommand.othersProperties[key]);
                return await this.usersRepository.addGeneric(userWithCustomProperties);
            } else {
                const newUser = await this.usersRepository.add(user);
                return of(this.convertToUserDto(newUser, callSource, saveUserCommand.systemId)).toPromise();
            }

    } catch (exception) {
        throw exception;
        }
    }


    /**
     * 
     * @param username 
     * @param systemId 
     * @param update 
     * @param callSource 
     */
    async update(username: string, systemId: string, update: any, callSource = CallSources.WebClient): Promise<ApiResultBase> {
        try {

           const user: User = await this.usersRepository.update( username, systemId, update);

           if (!user) {
               throw new AppNotFoundException();
           }

           return of(this.generateSuccessApiResultBase(user, ApiResultBase.SUCCESS, ApiResultBase.SUCCESS, ApiResultBase.SUCCESS_CODE)).toPromise();
       } catch (exception) {
                console.log(exception);
               if ( exception instanceof UserException) {
                   const message = (exception as UserException).Message;
                   throw new AppBadRequestException(message);
               }
               if (exception instanceof AppNotFoundException ) {
                   throw exception;
               }

               const error = this.appConfigService.getEnvironment() === EnvironmentTypes.dev || callSource === CallSources.Microservice ? exception : {};
               throw error;
           }
       }


        private async generateSuccessApiResultBase(data: any, userMessageCode: string, applicationMessage: string, resultCode: number, lang: Langs = Langs.es_MX) {
        const result = new ApiResultBase();
        result.data = data;
        result.isSuccess = true;
        result.applicationMessage = this.appConfigService.getEnvironment() !== EnvironmentTypes.prod ? applicationMessage : ApiResultBase.SUCCESS;
        result.resultCode = resultCode;
        const userMessage: Message = await this.messagesRepository.getMessageByLanguageAndCode(lang, userMessageCode);
        result.userMessage = userMessage != null && userMessage != undefined ? userMessage.value : ApiResultBase.SUCCESS;
        return result;
    }
}
