import { Controller, Post } from '@nestjs/common';

import { EligibilityService } from './eligibility.service';

@Controller('eligibility')
export class EligibilityController {
  constructor(private eligibilityService: EligibilityService) {}

  @Post('verify')
  verify() {
    return this.eligibilityService.verifyClientEligibility();
  }
}
