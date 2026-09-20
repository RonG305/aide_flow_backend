import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { paginate } from 'src/common/pagination/paginate';
import { successResponse } from 'src/common/utils/api-response';
import { ReminderStatus } from 'src/generated/prisma/enums';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { GetRemindersDto } from './dto/get-reminders.dto';

@Injectable()
export class RemindersService {
  constructor(private readonly prisma: PrismaService) {}

  private async findOwnedReminder(id: string, userId: string) {
    const reminder = await this.prisma.reminder.findUnique({ where: { id } });
    if (!reminder) throw new NotFoundException('Reminder not found');
    if (reminder.user_id !== userId)
      throw new ForbiddenException('This reminder does not belong to you');
    return reminder;
  }

  async createReminder(userId: string, createReminderDto: CreateReminderDto) {
    const { remind_at, ...rest } = createReminderDto;

    const reminder = await this.prisma.reminder.create({
      data: {
        ...rest,
        remind_at: new Date(remind_at),
        user_id: userId,
        source: 'user',
      },
    });

    return successResponse('Reminder created succesifully', reminder);
  }

  async getAllReminders(
    userId: string,
    { search, limit, page, status }: GetRemindersDto,
  ) {
    if (!page) page = 1;
    if (!limit) limit = 10;

    const where = {
      user_id: userId,
      ...(status && { status }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { notes: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const totalReminders = await this.prisma.reminder.count({ where });
    const pagination = paginate(totalReminders, page, limit);

    const reminders = await this.prisma.reminder.findMany({
      where,
      skip: Number((page - 1) * limit),
      take: Number(limit),
      // Soonest first: what you are reminded of next matters most.
      orderBy: { remind_at: 'asc' },
    });

    return {
      data: reminders,
      ...pagination,
    };
  }

  async getReminderById(id: string, userId: string) {
    const reminder = await this.findOwnedReminder(id, userId);
    return successResponse('Reminder fetched succesifully', reminder);
  }

  async updateReminder(
    id: string,
    userId: string,
    updateReminderDto: UpdateReminderDto,
  ) {
    await this.findOwnedReminder(id, userId);

    const { remind_at, status, ...rest } = updateReminderDto;

    const reminder = await this.prisma.reminder.update({
      where: { id },
      data: {
        ...rest,
        ...(status && {
          status,
          completed_at:
            status === ReminderStatus.completed ? new Date() : null,
          cancelled_at:
            status === ReminderStatus.cancelled ? new Date() : null,
        }),
        ...(remind_at && { remind_at: new Date(remind_at) }),
      },
    });

    return successResponse('Reminder updated succesifully', reminder);
  }

  async deleteReminder(id: string, userId: string) {
    await this.findOwnedReminder(id, userId);
    const reminder = await this.prisma.reminder.delete({ where: { id } });
    return successResponse('Reminder deleted succesifully', reminder);
  }
}
