import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];
  transform(value: any, metadata: ArgumentMetadata) {
    value = value.toUpperCase();
    if (!this.statusIsValid(value)) {
      throw new BadRequestException(`"${value}" is not a valid status`);
    }
    return value;
  }

  private statusIsValid(status: any) {
    return this.allowedStatuses.indexOf(status) !== -1;
  }
}
