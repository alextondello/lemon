import { Module } from '@nestjs/common';

import { EligibilityController } from './eligibility.controller';
import { EligibilityService } from './eligibility.service';

@Module({
  providers: [EligibilityService],
  controllers: [EligibilityController],
})
export class EligibilityModule {}
