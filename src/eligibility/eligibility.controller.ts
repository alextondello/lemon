import { Body, Controller, Post } from '@nestjs/common';

import { VerifyClientEligibilityRequestDTO } from './eligibility.dto';
import { EligibilityService } from './eligibility.service';

@Controller('eligibility')
export class EligibilityController {
  constructor(private eligibilityService: EligibilityService) {}

  @Post('verify')
  verify(@Body() dto: VerifyClientEligibilityRequestDTO) {
    return this.eligibilityService.verifyClientEligibility(dto);
  }
}
