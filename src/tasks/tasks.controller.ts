import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CreateTaskDto, FindTasksDto } from './dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation-pipe';
import { Task, TaskStatus } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get(':id')
  findById(@Param('id') id: string): Task {
    return this.tasksService.findById(id);
  }

  @Get()
  find(@Query(ValidationPipe) findTasksDto: FindTasksDto): Task[] {
    if (!Object.keys(findTasksDto).length) {
      return this.tasksService.findAll();
    }

    return this.tasksService.find(findTasksDto);
  }

  @Get()
  findAll(): Task[] {
    return this.tasksService.findAll();
  }

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.create(createTaskDto);
  }

  @Patch(':id/status')
  @UsePipes(ValidationPipe)
  updateStatus(
    @Param('id') id: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ): Task {
    return this.tasksService.updateStatus(id, status);
  }

  @Delete(':id')
  delete(@Param('id') id: string): void {
    this.tasksService.delete(id);
  }
}
