import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from 'typeorm';
import { CreateTaskDto } from './dto/creat-task.dto';
import { getTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@Injectable()
export class TasksService {

  async getTasks(filterDto: getTaskFilterDto): Promise<Task[]> {
    if (filterDto.search) {
      return await Task.find({ where: [{ title: Like(`%${filterDto.search}%`) }, { description: Like(`%${filterDto.search}%`) }] })
    }
    if (filterDto.status) {
      return await Task.find({ where: { status: filterDto.status } })
    }
    return Task.find();
  }

  async getTaskById(id: any): Promise<Task> {
    const found = await Task.findOneBy({ id: id });
    if (!found) {
      throw new NotFoundException('Non-Existing Id, Please Try Again');
    }
    return found;
  }


  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    await task.save()
    return task;
  }

  async deleteTask(id: number): Promise<Task> {
    const chosenTask = await this.getTaskById(id);
    if (!chosenTask) {
      throw new NotFoundException(
        'Can not delete non-existing task, please try again!',
      );
    }
    Task.delete({ id: chosenTask.id })
    return chosenTask;
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    task.save();
    return task
  }
}
