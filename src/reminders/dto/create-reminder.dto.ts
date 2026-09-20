import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ReminderStatus } from 'src/generated/prisma/enums';

export class CreateReminderDto {
  @ApiProperty({ example: 'Take medication' })
  @IsString()
  @IsNotEmpty({ message: 'title is required' })
  title!: string;

  @ApiPropertyOptional({ example: 'One tablet after breakfast' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: '2026-09-25T08:00:00.000Z' })
  @IsNotEmpty({ message: 'remind_at is required' })
  @IsDateString({}, { message: 'remind_at must be a valid date' })
  remind_at!: string;

  @ApiPropertyOptional({
    example: 'FREQ=DAILY;INTERVAL=1',
    description: 'iCalendar RRULE describing how the reminder repeats',
  })
  @IsOptional()
  @IsString()
  recurrence_rule?: string;

  @ApiPropertyOptional({ enum: ReminderStatus, default: ReminderStatus.pending })
  @IsOptional()
  @IsEnum(ReminderStatus, {
    message: 'status must be one of pending, completed, cancelled',
  })
  status?: ReminderStatus;
}
