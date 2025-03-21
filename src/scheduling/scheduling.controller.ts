import { Controller, Get, Param } from '@nestjs/common';
import { SchedulingService } from './scheduling.service';

@Controller('scheduling')
export class SchedulingController {
  constructor(private readonly schedulingService: SchedulingService) {}

  @Get('available/:userPJId')
  async getAvailableTimes(@Param('userPJId') userPJId: string) {
    return this.schedulingService.getAvailableTimes(userPJId);
  }
}
