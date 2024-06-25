import { Injectable } from '@nestjs/common';

@Injectable()
export class EligibilityService {
  verifyClientEligibility() {
    return { success: true };
  }
}
