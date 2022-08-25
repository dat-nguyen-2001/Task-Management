import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { v1 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/creat-task.dto';
import { getTaskFilterDto } from './dto/get-task-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      id: '1',
      title: 'Learn NestJS',
      description: 'Learn NestJS to be a fullstack developer',
      status: TaskStatus.IN_PROGRESS,
    },
  ];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: getTaskFilterDto): Task[] {
    if (filterDto.status) {
      return this.tasks.filter((task) => task.status === filterDto.status);
    }
    if (filterDto.search) {
      return this.tasks.filter(
        (task) =>
          task.title.includes(filterDto.search) ||
          task.description.includes(filterDto.search),
      );
    }
  }

  getTaskById(id: string): Task {
    const found = this.tasks.find((task) => task.id === id);

    if (!found) {
      throw new NotFoundException('Non-Existing Id, Please Try Again');
    }

    return found;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  deleteTask(id: string): Task {
    const chosenTask = this.getTaskById(id);
    if (!chosenTask) {
      throw new NotFoundException(
        'Can not delete non-existing task, please try again!',
      );
    }
    this.tasks = this.tasks.filter((task) => task !== chosenTask);
    return chosenTask;
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.tasks.find((task) => task.id === id);
    task.status = status;
    return task;
  }
}
