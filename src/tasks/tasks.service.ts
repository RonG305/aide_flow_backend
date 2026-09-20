import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { paginate } from 'src/common/pagination/paginate';
import { successResponse } from 'src/common/utils/api-response';
import { TaskStatus } from 'src/generated/prisma/enums';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksDto } from './dto/get-tasks.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  private async findOwnedTask(id: string, userId: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');
    if (task.user_id !== userId)
      throw new ForbiddenException('This task does not belong to you');
    return task;
  }

  async createTask(userId: string, createTaskDto: CreateTaskDto) {
    const { due_date, ...rest } = createTaskDto;

    const task = await this.prisma.task.create({
      data: {
        ...rest,
        due_date: due_date ? new Date(due_date) : undefined,
        user_id: userId,
        source: 'user',
      },
    });

    return successResponse('Task created succesifully', task);
  }

  async getAllTasks(userId: string, { search, limit, page, status, priority }: GetTasksDto) {
    if (!page) page = 1;
    if (!limit) limit = 10;

    const where = {
      user_id: userId,
      ...(status && { status }),
      ...(priority && { priority }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { notes: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const totalTasks = await this.prisma.task.count({ where });
    const pagination = paginate(totalTasks, page, limit);

    const tasks = await this.prisma.task.findMany({
      where,
      skip: Number((page - 1) * limit),
      take: Number(limit),
      orderBy: { created_at: 'desc' },
    });

    return {
      data: tasks,
      ...pagination,
    };
  }

  async getTaskById(id: string, userId: string) {
    const task = await this.findOwnedTask(id, userId);
    return successResponse('Task fetched succesifully', task);
  }

  async updateTask(id: string, userId: string, updateTaskDto: UpdateTaskDto) {
    await this.findOwnedTask(id, userId);

    const { due_date, status, ...rest } = updateTaskDto;

    const task = await this.prisma.task.update({
      where: { id },
      data: {
        ...rest,
        ...(status && {
          status,
          completed_at: status === TaskStatus.completed ? new Date() : null,
          cancelled_at: status === TaskStatus.cancelled ? new Date() : null,
        }),
        ...(due_date !== undefined && {
          due_date: due_date ? new Date(due_date) : null,
        }),
      },
    });

    return successResponse('Task updated succesifully', task);
  }

  async deleteTask(id: string, userId: string) {
    await this.findOwnedTask(id, userId);
    const task = await this.prisma.task.delete({ where: { id } });
    return successResponse('Task deleted succesifully', task);
  }
}
