import { Injectable, NotFoundException } from '@nestjs/common';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/creat-task.dto';
import { getTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@Injectable()
export class TasksService {

  async getTasks(filterDto: getTaskFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = Task.createQueryBuilder('task')
    query.where('task.userId = :userId', { userId: user.id })
    if (status) {
      query.andWhere('task.status = :status', { status })
    }
    if (search) {
      query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` })
    }
    const tasks = await query.getMany();
    return tasks;
  }

  async getTaskById(id: any, user: User): Promise<Task> {
    const query = Task.createQueryBuilder('task')
    query.where('task.userId = :userId', { userId: user.id })
    query.andWhere('task.id = :id', { id })
    const task = query.getOne();
    return task
  }


  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;
    await task.save();

    // not to show user's information to the client
    delete task.user
    return task;
  }

  async deleteTask(id: number, user: User): Promise<Task> {
    const chosenTask = await this.getTaskById(id, user);
    if (!chosenTask) {
      throw new NotFoundException(
        'NOT YOUR TASK, BITCH',
      );
    }
    Task.delete({ id: chosenTask.id })
    return chosenTask;
  }

    async updateTaskStatus(id: number, status: TaskStatus, user: User): Promise < Task > {
    const task = await this.getTaskById(id, user);
    task.status = status;
    task.save();
    return task
  }
}
