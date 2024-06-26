import { Injectable } from '@nestjs/common';

import { VerifyClientEligibilityRequestDTO } from './eligibility.dto';

@Injectable()
export class EligibilityService {
  verifyClientEligibility(dto: VerifyClientEligibilityRequestDTO) {
    return { success: true };
  }
}
