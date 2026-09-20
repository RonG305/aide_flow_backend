import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { TaskPriority, TaskStatus } from 'src/generated/prisma/enums';

export class CreateTaskDto {
  @ApiProperty({ example: 'Buy groceries' })
  @IsString()
  @IsNotEmpty({ message: 'title is required' })
  title!: string;

  @ApiPropertyOptional({ example: 'Milk, bread and eggs' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: '2026-09-25T17:00:00.000Z' })
  @IsOptional()
  @IsDateString({}, { message: 'due_date must be a valid date' })
  due_date?: string;

  @ApiPropertyOptional({ enum: TaskPriority, default: TaskPriority.medium })
  @IsOptional()
  @IsEnum(TaskPriority, {
    message: 'priority must be one of low, medium, high, urgent',
  })
  priority?: TaskPriority;

  @ApiPropertyOptional({ enum: TaskStatus, default: TaskStatus.pending })
  @IsOptional()
  @IsEnum(TaskStatus, {
    message: 'status must be one of pending, in_progress, completed, cancelled',
  })
  status?: TaskStatus;

  @ApiPropertyOptional({ example: ['errands', 'home'], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
