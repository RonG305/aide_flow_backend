import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { Gender } from "src/generated/prisma/enums";

export class CreateUserDto {
    @ApiProperty({ example: "john.doe@example.com"})
    @IsEmail({}, { message: "email must be a valid email address"})
    @IsNotEmpty()
    email!: string;

    @ApiProperty({example: "Password123!"})
    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: "Password must be atleast 6 characters"})
    password!: string;

    @ApiProperty({ example: 'StrongPass123!' })
    @IsNotEmpty({ message: 'confirm_password is required' })
    @IsString()
    @MinLength(6)
    confirm_password!: string;

    @ApiPropertyOptional({ example: 'John' })
    @IsOptional()
    @IsString()
    first_name?: string;

    @ApiPropertyOptional({ example: 'Doe' })
    @IsOptional()
    @IsString()
    last_name?: string;

    @ApiPropertyOptional({ enum: Gender, example: Gender.male })
    @IsOptional()
    @IsEnum(Gender, { message: 'gender must be one of male, female, other' })
    gender?: Gender;

    @ApiPropertyOptional({ example: '1995-04-17' })
    @IsOptional()
    @IsDateString({}, { message: 'date_of_birth must be a valid date string' })
    date_of_birth?: string;

    @ApiPropertyOptional({ example: 'Africa/Kampala', default: 'UTC' })
    @IsOptional()
    @IsString()
    timezone?: string;

    @ApiPropertyOptional({ example: true, default: false })
    @IsOptional()
    @IsBoolean()
    accept_terms_conditions?: boolean;
}
