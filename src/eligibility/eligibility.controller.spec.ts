import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { EligibilityController } from './eligibility.controller';
import { EligibilityService } from './eligibility.service';

describe('EligibilityController', () => {
  let app: INestApplication;
  let controller: EligibilityController;
  let service: EligibilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EligibilityController],
      providers: [{ provide: EligibilityService, useValue: jest.fn() }],
    }).compile();

    controller = module.get<EligibilityController>(EligibilityController);
    service = module.get<EligibilityService>(EligibilityService);

    app = module.createNestApplication();
    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /eligibility/verify', () => {
    it('should call verifyClientEligibility', () => {
      service.verifyClientEligibility = jest.fn();

      return request(app.getHttpServer())
        .post(`/eligibility/verify`)
        .then(() => {
          expect(service.verifyClientEligibility).toHaveBeenCalled();
        });
    });
  });
});
