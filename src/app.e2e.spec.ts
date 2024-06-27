import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from './app.module';
import { ClassesDeConsumo } from './shared/enums/classes-consumo.enum';
import { ModalidadesTarifarias } from './shared/enums/modalidades-tarifarias.enum';
import { RazoesDeInelegibilidade } from './shared/enums/razoes-inelegibilidade.enum';
import { TiposDeConexao } from './shared/enums/tipos-conexao.enum';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('POST /eligibility/verify', () => {
    it('should identify an eligible client correctly', () => {
      const eligibleClient = {
        numeroDoDocumento: '14041737706',
        tipoDeConexao: TiposDeConexao.BIFASICO,
        classeDeConsumo: ClassesDeConsumo.COMERCIAL,
        modalidadeTarifaria: ModalidadesTarifarias.CONVENCIONAL,
        historicoDeConsumo: [
          3878, // mes atual
          9760, // mes anterior
          5976, // 2 meses atras
          2797, // 3 meses atras
          2481, // 4 meses atras
          5731, // 5 meses atras
          7538, // 6 meses atras
          4392, // 7 meses atras
          7859, // 8 meses atras
          4160, // 9 meses atras
          6941, // 10 meses atras
          4597, // 11 meses atras
        ],
      };

      return request(app.getHttpServer()).post(`/eligibility/verify`).send(eligibleClient).expect(200).expect({
        elegivel: true,
        economiaAnualDeCO2: 5553.24,
      });
    });
  });

  describe('POST /eligibility/verify', () => {
    it('should identify an ineligible client correctly', () => {
      const ineligibleClient = {
        numeroDoDocumento: '14041737706',
        tipoDeConexao: TiposDeConexao.BIFASICO,
        classeDeConsumo: ClassesDeConsumo.RURAL,
        modalidadeTarifaria: ModalidadesTarifarias.VERDE,
        historicoDeConsumo: [
          3878, // mes atual
          9760, // mes anterior
          5976, // 2 meses atras
          2797, // 3 meses atras
          2481, // 4 meses atras
          5731, // 5 meses atras
          7538, // 6 meses atras
          4392, // 7 meses atras
          7859, // 8 meses atras
          4160, // 9 meses atras
        ],
      };

      return request(app.getHttpServer())
        .post(`/eligibility/verify`)
        .send(ineligibleClient)
        .expect(200)
        .expect({
          elegivel: false,
          razoesDeInelegibilidade: [
            RazoesDeInelegibilidade.CLASSE_CONSUMO,
            RazoesDeInelegibilidade.MODALIDADE_TARIFARIA,
          ],
        });
    });
  });
});
