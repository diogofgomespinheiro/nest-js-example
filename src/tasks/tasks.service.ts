import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { CreateTaskDto, FindTasksDto } from './dto';
import { Task, TaskStatus } from './task.model';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  findById(id: string): Task {
    const task = this.tasks.find((task) => task.id === id);

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found!`);
    }

    return task;
  }

  find(findTasksDto: FindTasksDto): Task[] {
    const { status, search } = findTasksDto;

    let tasks: Task[] = this.findAll();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(
        (task) =>
          task.title.includes(search) || task.description.includes(search),
      );
    }

    return tasks;
  }

  findAll(): Task[] {
    return this.tasks;
  }

  create(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuidv4(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  updateStatus(id: string, status: TaskStatus): Task {
    const task = this.findById(id);
    task.status = status;
    return task;
  }

  delete(id: string): void {
    const existingTask = this.findById(id);
    const newTasks = this.tasks.filter((task) => task.id !== existingTask.id);
    this.tasks = newTasks;
  }
}
