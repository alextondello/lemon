import { Body, Controller, HttpCode, Post } from '@nestjs/common';

import { VerifyClientEligibilityRequestDTO } from './eligibility.dto';
import { EligibilityService } from './eligibility.service';

@Controller('eligibility')
export class EligibilityController {
  constructor(private eligibilityService: EligibilityService) {}

  @Post('verify')
  @HttpCode(200)
  verify(@Body() dto: VerifyClientEligibilityRequestDTO) {
    return this.eligibilityService.verifyClientEligibility(dto);
  }
}
