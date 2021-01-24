import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateTaskDto, FindTasksDto } from './dto';
import { TaskStatus } from './interfaces';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
  ) {}

  async findOne(id: number, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found!`);
    }

    return task;
  }

  find(findTasksDto: FindTasksDto, user: User): Promise<Task[]> {
    return this.taskRepository.findTasks(findTasksDto, user);
  }

  create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async updateStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.findOne(id, user);
    task.status = status;
    await task.save();

    return task;
  }

  async delete(id: number, user: User): Promise<void> {
    const result = await this.taskRepository.delete({ id, userId: user.id });

    if (!result.affected) {
      throw new NotFoundException(`Task with ID ${id} not found!`);
    }
  }
}
