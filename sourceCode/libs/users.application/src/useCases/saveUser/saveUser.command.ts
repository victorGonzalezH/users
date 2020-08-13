import { Min, Max, IsNotEmpty, IsNumber } from 'class-validator';
export class SaveUserCommand {

    /**
     * nombre de usuario
     */
    @IsNotEmpty()
    username: string;

    /** Contrasena */
    @IsNotEmpty()
    password: string;

    /**
     * Nombre del usuario
     */
    @IsNotEmpty()
    name: string;

    /**
     * Apellido paterno
     */
    @IsNotEmpty()
    lastName: string;

    /**
     * Identificador del sistema. Para crear un usuario, este debe de pertener al menos a un sistema registrado
     * en la plataforma
     */
    @IsNotEmpty()
    @Min(24)
    @Max(24)
    systemId: string;

    @IsNumber()
    callSource: number;

    othersProperties: any;

}
