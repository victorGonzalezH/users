import { Controller, Get, Param, Query, InternalServerErrorException, BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersApplicationService } from 'usa/users.application';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { Observable, from, of } from 'rxjs';
import { UserDto } from 'usa/users.application/users/user.dto';
import { SaveUserCommand } from 'usa/users.application/useCases/saveUser/saveUser.command';
import { ApiResultBaseDto, AppBadRequestException, DomainException, AppNotFoundException } from 'utils';
import { AppConfigService } from 'usa/users.application/configuration/appConfig.service';
import { UserException } from 'usr/users.domain';
import { ApiResultBase } from 'utils/dist/application/dataTransferObjects/apiResultBase.model';

@Controller('users')
export class UsersController {
  constructor(private usersApplication: UsersApplicationService, private appConfigService: AppConfigService) {
  }

  // @Get()
  // @MessagePattern({ command: 'get' })
  //   getMs(source = 0): Observable<UserDto[]> {
  //     return from(this.usersApplication.Get(source));
  //   }


  @Get(':username')
  getByUsername(@Param() params, @Query('systemId') systemId: string): Observable<UserDto> {
    return from(this.usersApplication.getByUsernameAndSystemId(params.username, systemId)
    .catch(error => {
      throw error;
   }));
}


  /**
   * Gets a user from the database. This method is used by other microservices to retrieve
   * a user. Due that this method is used by other microservices, the return type is any,i.e. the
   * microservice caller needs all the properties from the user   * @param payload
   */
  @MessagePattern({ command: 'getByUsername' })
    msGetByUsername(payload: { username: string, systemId: string, callSource: number }): Observable<any> {
      return from(this.usersApplication.getByUsernameAndSystemId(payload.username, payload.systemId, payload.callSource)
      .catch(exception => {
        if ( exception instanceof AppBadRequestException) {
          const message = (exception as AppBadRequestException).Message;
          throw new RpcException('BadRequest: ' + message);
      }
        if ( exception instanceof AppNotFoundException) {
          return null;
      }

        throw new RpcException('InternalServerError: ' + exception);
       }));
    }



  /**
   * 
   * @param payload
   */
  @MessagePattern({ command: 'getByPropertyNameValue' })
  msGetByProperty(payload: { propertyName: string, propertyValue: any, propertyType: number, systemId: string, callSource: number }): Observable<UserDto> {
    return from(this.usersApplication.getByPropertyNameValueAndSystemId(payload.propertyName, payload.propertyValue, payload.propertyType, payload.systemId, payload.callSource)
    .catch(exception => {
      if ( exception instanceof AppBadRequestException) {
        const message = (exception as AppBadRequestException).Message;
        throw new RpcException('BadRequest: ' + message);
    }
      if ( exception instanceof AppNotFoundException) {
        return null;
    }

      throw new RpcException('InternalServerError: ' + exception);
     }));
  }


    /**
     * 
     * @param payload
     */
    @MessagePattern({ command: 'save' })
    msSave(payload: { saveUserCommand: SaveUserCommand }): Observable<UserDto> {
      const userPromise = this.usersApplication.save(payload.saveUserCommand, payload.saveUserCommand.callSource)
      .catch(exception => {
        throw new RpcException('InternalServerError: ' + exception);
    });

      return from(userPromise);
    }


    @MessagePattern({ command: 'update' })
    msUpdate(payload: { username: string, systemId: string, update: any, callSource: number }): Observable<ApiResultBase> {
      const userPromise = this.usersApplication.update(payload.username, payload.systemId, payload.update, payload.callSource)
      .catch(exception => {
        throw new RpcException('InternalServerError: ' + exception);
    });

      return from(userPromise);
    }
}
