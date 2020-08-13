import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { EnvironmentTypes } from 'utils/dist/application/Enums/environmentTypes.enum';

@Injectable()
export class AppConfigService {
    public static readonly PROD = 'prod';
    public static readonly DEV  = 'dev';
    private environmentDescription: string;
    private environment: EnvironmentTypes;
    private envTag: string;

    // ms significa microservice
    private msProtocol: Transport;
    private msPort: number;
    private msHost: string;

    private webPort: number;

    constructor(private configService: ConfigService) {
        this.environmentDescription = process.env.NODE_ENV === 'production' ? 'production' : 'development' ;
        if (this.environmentDescription === 'production') { this.environment = EnvironmentTypes.prod; } else if (this.environmentDescription === 'quality') { this.environment = EnvironmentTypes.qa; } else { this.environment = EnvironmentTypes.dev; }
        this.envTag = process.env.NODE_ENV === 'production' ? 'prod' : 'dev' ;
        this.webPort = this.configService.get<number>(this.envTag + '.web.port');
        this.msProtocol = this.converStringProtocol(configService.get<number>(this.envTag + '.microservice.protocol'));
        this.msPort = this.configService.get<number>(this.envTag + '.microservice.port');
        this.msHost = this.configService.get<string>(this.envTag + '.microservice.host');
    }

     /**
     * Obtiene el ambiente de ejecucion
     */
    public getEnvironment(): EnvironmentTypes {
        return this.environment;
    }

    /**
     * Devuelve el protocolo a usar para el microservicio
     */
    public getMicroserviceProtocol(): number {
        return this.msProtocol;
    }

    /**
     * Devuelve el nombre del host
     */
    public getMicroserviceHost(): string {
        return this.msHost;
    }

    /**
     * Devuelve el puerto del microservicio
     */
    public getMicroservicePort(): number {
        return this.msPort;
    }

    /**
     * Obtiene el puerto web
     */
    public getWebPort(): number {

        return this.webPort;
    }

    /**
     *   TCP = 0,
     * REDIS = 1,
     * NATS = 2,
     * MQTT = 3,
     * GRPC = 4,
     * RMQ = 5,
     * KAFKA = 6
     */
    private converStringProtocol(protocolNumber: number): Transport {
        return protocolNumber;
    }

}
