import { Injectable, Logger } from '@nestjs/common';
import { Observable, from, of } from 'rxjs';
import { UserDto } from './users/user.dto';
import { UserRepositoryService } from 'usr/users.infrastructure/users/user-repository.service';
import { User, SimpleUser, UserException } from 'usr/users.domain';
import { SaveUserCommand } from './useCases/saveUser/saveUser.command';
import { AppNotFoundException, AppBadRequestException } from 'utils';
import { AppConfigService } from './configuration/appConfig.service';
import { ApiResultBase } from 'utils/dist/application/dataTransferObjects/apiResultBase.model';
import { EnvironmentTypes } from 'utils/dist/application/Enums/environmentTypes.enum';
import { Langs } from 'utils/dist/application/Enums/langs.enum';
import { Message } from 'utils/dist/domain/models/message.model';
import { MessagesRepositoryService } from 'utils/dist/persistence/mongodb/repositories/messagesRepository.service';
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
     * Convierte un arrglo de usuarios de dominio a un arreglo de usuarios dtos
     * @param users arreglo de usuarios de dominio
     */
    private convertToUsersDtos(users: User[], callSource = 0) {

        return users.map(user => this.convertToUserDto(user, callSource));
    }

    /**
     * 
     * @param user Usuario de dominio
     * @param callSource origen de la llamada
     */
    private convertToUserDto(user: User, callSource = 0): UserDto {

        if (!user) { return null; }
        if (callSource === 0) {
            return {id: user.id, username: user.username };
        } else {
            return { id: user.id, username: user.username, password : user.password };
        }
    }

    /**
     * Obtiene los usuarios
     * @param source
     */
    async Get(callSource = 0): Promise<UserDto[]> {
        const users: User[] = await this.usersRepository.getAll();
        return of(this.convertToUsersDtos(users, callSource)).toPromise();
    }

    /**
     * Obtiene un usuario mediante su nombre de usuario (propiedad username)
     * @param username Nombre de usuario
     * @param callSource origen de la llamada. Un cero indica que la llamada ha sido hecha por un cliente web, un valor
     * diferente de cero indica que llamada la hizo un cluente que no es web, por ejemplo algun microservicio por lo tanto,
     * se puede devolver el usuario con todas sus propiedades incluidas en el dto
     */
    async getByUsernameAndSystemId(username: string, systemId: string, callSource = 0): Promise<any> {
     try {
        const simpleUser: SimpleUser = new SimpleUser(username, systemId);
        const user: User = await this.usersRepository.findByUsernameAndSystemId(username, systemId);
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
    async save(saveUserCommand: SaveUserCommand, callSource = 0) {
     try {
            const user: User = new User (saveUserCommand.username, saveUserCommand.password, saveUserCommand.name, saveUserCommand.lastName, saveUserCommand.systemId);
            if ( saveUserCommand.othersProperties != undefined ) {
                const userWithCustomProperties: any = { };
                Object.keys(user).forEach(key => userWithCustomProperties[key] = user[key]);
                Object.keys(saveUserCommand.othersProperties).forEach(key => userWithCustomProperties[key] = saveUserCommand.othersProperties[key]);
                return await this.usersRepository.addGeneric(userWithCustomProperties);
            } else {
                const newUser = await this.usersRepository.add(user);
                return of(this.convertToUserDto(newUser, callSource)).toPromise();
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
    async update(username: string, systemId: string, update: any, callSource = 0): Promise<ApiResultBase> {
        try {

           const user: User = await this.usersRepository.update( username, systemId, update);

           if (!user) {
               throw new AppNotFoundException();
           }

           return of(this.generateSuccessApiResultBase(user, ApiResultBase.SUCCESS, ApiResultBase.SUCCESS, 0)).toPromise();
       } catch (exception) {

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
