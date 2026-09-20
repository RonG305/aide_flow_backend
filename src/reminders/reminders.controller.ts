import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
  Req,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.gurads';
import { RemindersService } from './reminders.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { GetRemindersDto } from './dto/get-reminders.dto';

@ApiBearerAuth('jwt-auth')
@UseGuards(AuthGuard)
@Controller('reminders')
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Post()
  createReminder(@Body() createReminderDto: CreateReminderDto, @Req() req) {
    return this.remindersService.createReminder(
      req.user.sub,
      createReminderDto,
      req.user.is_agent,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  getAllReminders(@Query() getRemindersDto: GetRemindersDto, @Req() req) {
    return this.remindersService.getAllReminders(req.user.sub, getRemindersDto);
  }

  // Declared before ':id' so that "next" is not swallowed as an id.
  @HttpCode(HttpStatus.OK)
  @Get('next')
  getNextReminder(@Req() req) {
    return this.remindersService.getNextReminder(req.user.sub);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getReminderById(@Param('id') id: string, @Req() req) {
    return this.remindersService.getReminderById(id, req.user.sub);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id/update')
  updateReminder(
    @Param('id') id: string,
    @Body() updateReminderDto: UpdateReminderDto,
    @Req() req,
  ) {
    return this.remindersService.updateReminder(
      id,
      req.user.sub,
      updateReminderDto,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id/delete')
  deleteReminder(@Param('id') id: string, @Req() req) {
    return this.remindersService.deleteReminder(id, req.user.sub);
  }
}
