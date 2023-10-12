import {
	IsArray,
	IsBoolean,
	IsEmail,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator';
import { Pair } from '../type/chat.type';

export class MessageDTO {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    message: string;

    @IsNumber()
    @IsOptional()
    message_id: number;

    @IsNumber()
    @IsNotEmpty()
    channelId: number;
}

export class ChannelDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @IsBoolean()
    private: boolean;

    @IsBoolean()
    isProtected: boolean;

    @IsString()
    @IsOptional()
    password: string;

    @IsArray()
    @IsOptional()
    members: Array<Pair>;
}