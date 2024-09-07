import { IsString,IsNotEmpty, IsNumber } from "class-validator"

export class CreateTaskDTO {
    @IsString()
    @IsNotEmpty()
    public name:string

    @IsNumber()
    public onChainId:number
}

export class ClientDataDTO {
    @IsString()
    @IsNotEmpty()
    public address:string
}