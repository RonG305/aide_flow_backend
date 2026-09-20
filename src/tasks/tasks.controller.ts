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
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksDto } from './dto/get-tasks.dto';

@ApiBearerAuth('jwt-auth')
@UseGuards(AuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto, @Req() req) {
    return this.tasksService.createTask(req.user.sub, createTaskDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  getAllTasks(@Query() getTasksDto: GetTasksDto, @Req() req) {
    return this.tasksService.getAllTasks(req.user.sub, getTasksDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getTaskById(@Param('id') id: string, @Req() req) {
    return this.tasksService.getTaskById(id, req.user.sub);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id/update')
  updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req,
  ) {
    return this.tasksService.updateTask(id, req.user.sub, updateTaskDto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id/delete')
  deleteTask(@Param('id') id: string, @Req() req) {
    return this.tasksService.deleteTask(id, req.user.sub);
  }
}
