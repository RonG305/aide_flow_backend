import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { GetPaginatedResponseDto } from 'src/common/dto';
import { ReminderStatus } from 'src/generated/prisma/enums';

export class GetRemindersDto extends GetPaginatedResponseDto {
  @ApiPropertyOptional({ enum: ReminderStatus })
  @IsOptional()
  @IsEnum(ReminderStatus)
  status?: ReminderStatus;
}
