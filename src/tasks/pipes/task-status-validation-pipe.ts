import { BadRequestException, PipeTransform } from '@nestjs/common';

import { TaskStatus } from '../task.model';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];

  transform(value: any) {
    if (typeof value !== 'string') {
      throw new BadRequestException(`The value provided is an invalid format.`);
    }

    value = value.toUpperCase();

    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`${value} is an invalid status.`);
    }

    return value;
  }

  private isStatusValid(status: any) {
    const index = this.allowedStatuses.indexOf(status);
    return index !== -1;
  }
}
