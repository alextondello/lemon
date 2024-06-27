import { Test, TestingModule } from '@nestjs/testing';

import { ClassesDeConsumo } from '../shared/enums/classes-consumo.enum';
import { ModalidadesTarifarias } from '../shared/enums/modalidades-tarifarias.enum';
import { RazoesDeInelegibilidade } from '../shared/enums/razoes-inelegibilidade.enum';
import { TiposDeConexao } from '../shared/enums/tipos-conexao.enum';
import { VerifyClientEligibilityRequestDTO } from './eligibility.dto';
import { EligibilityService } from './eligibility.service';

describe('EligibilityService', () => {
  let service: EligibilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EligibilityService],
    }).compile();

    service = module.get<EligibilityService>(EligibilityService);
  });

  //#region : Data Mocks
  const request: VerifyClientEligibilityRequestDTO = {
    numeroDoDocumento: '14041737706',
    tipoDeConexao: TiposDeConexao.BIFASICO,
    classeDeConsumo: ClassesDeConsumo.COMERCIAL,
    modalidadeTarifaria: ModalidadesTarifarias.CONVENCIONAL,
    historicoDeConsumo: [3878, 9760, 5976],
  };

  const averageConsumption350M = [300, 350, 400];
  const averageConsumption450M = [400, 450, 500];
  const averageConsumption450B = [420, 450, 450, 450, 480];
  const averageConsumption550B = [500, 520, 540, 560, 580, 600];
  const averageConsumption700T = [650, 660, 670, 680, 690, 700, 710, 720, 730, 740, 750];
  const averageConsumption800T = [800, 800, 800, 800, 800];

  const energyConsumption1 = [3238, 3875, 4534, 2345, 5438, 5642, 4359, 3412];
  const energyConsumption2 = [800, 827, 956, 795, 882];
  const energyConsumption3 = [1500, 1600, 1510, 1620, 1580, 1590, 1570, 1560, 1540, 1510, 1530, 1520];
  //#endregion

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('verifyClientEligibility', () => {
    it('should verify whether a client qualifies to become a Lemon customer', () => {
      service.validateClasseConsumo = jest.fn();
      service.validateModalidadeTarifaria = jest.fn();
      service.validateConsumoMinimo = jest.fn();
      service.calculateCO2EmissionsSavings = jest.fn();
      service.checkIneligibility = jest.fn();

      // Function call
      service.verifyClientEligibility(request);

      expect(service.validateClasseConsumo).toHaveBeenCalledWith(request.classeDeConsumo);
      expect(service.validateModalidadeTarifaria).toHaveBeenCalledWith(request.modalidadeTarifaria);
      expect(service.validateConsumoMinimo).toHaveBeenCalledWith(request.tipoDeConexao, request.historicoDeConsumo);
      expect(service.calculateCO2EmissionsSavings).toHaveBeenCalledWith(request.historicoDeConsumo);
      expect(service.checkIneligibility).toHaveBeenCalled();
    });
  });

  describe('validateClasseConsumo', () => {
    it("should validate if the 'classe de consumo' qualifies to become a Lemon customer", () => {
      expect(service.validateClasseConsumo(ClassesDeConsumo.RESIDENCIAL)).toEqual(true);
      expect(service.validateClasseConsumo(ClassesDeConsumo.INDUSTRIAL)).toEqual(true);
      expect(service.validateClasseConsumo(ClassesDeConsumo.COMERCIAL)).toEqual(true);
      expect(service.validateClasseConsumo(ClassesDeConsumo.RURAL)).toEqual(false);
      expect(service.validateClasseConsumo(ClassesDeConsumo.PODER_PUBLICO)).toEqual(false);
    });
  });

  describe('validateModalidadeTarifaria', () => {
    it("should validate if the 'modalidade tarifaria' qualifies to become a Lemon customer", () => {
      expect(service.validateModalidadeTarifaria(ModalidadesTarifarias.AZUL)).toEqual(false);
      expect(service.validateModalidadeTarifaria(ModalidadesTarifarias.BRANCA)).toEqual(true);
      expect(service.validateModalidadeTarifaria(ModalidadesTarifarias.VERDE)).toEqual(false);
      expect(service.validateModalidadeTarifaria(ModalidadesTarifarias.CONVENCIONAL)).toEqual(true);
    });
  });

  describe('validateConsumoMinimo', () => {
    it("should validate if the client's average consumption qualifies them to become a Lemon customer", () => {
      // MONOFASICO
      expect(service.validateConsumoMinimo(TiposDeConexao.MONOFASICO, averageConsumption350M)).toEqual(false);
      expect(service.validateConsumoMinimo(TiposDeConexao.MONOFASICO, averageConsumption450M)).toEqual(true);
      // BIFASICO
      expect(service.validateConsumoMinimo(TiposDeConexao.BIFASICO, averageConsumption450B)).toEqual(false);
      expect(service.validateConsumoMinimo(TiposDeConexao.BIFASICO, averageConsumption550B)).toEqual(true);
      // TRIFASICO
      expect(service.validateConsumoMinimo(TiposDeConexao.TRIFASICO, averageConsumption700T)).toEqual(false);
      expect(service.validateConsumoMinimo(TiposDeConexao.TRIFASICO, averageConsumption800T)).toEqual(true);
    });
  });

  describe('calculateCO2EmissionsSavings', () => {
    it("should calculate annual CO2 emission savings based on the client's energy consumption history", () => {
      expect(service.calculateCO2EmissionsSavings(energyConsumption1)).toEqual(4138.22);
      expect(service.calculateCO2EmissionsSavings(energyConsumption2)).toEqual(858.82);
      expect(service.calculateCO2EmissionsSavings(energyConsumption3)).toEqual(1564.92);
    });
  });

  describe('calculateAverageConsumption', () => {
    it("should calculate the average energy consumption from the client's energy usage history", () => {
      expect(service.calculateAverageConsumption(energyConsumption1)).toEqual(4105.375);
      expect(service.calculateAverageConsumption(energyConsumption2)).toEqual(852);
      expect(service.calculateAverageConsumption(energyConsumption3)).toEqual(1552.5);
    });
  });

  describe('checkIneligibility', () => {
    it('should check if all eligibility conditions have been met and provides the reasons for ineligibility', () => {
      // checkIneligibility(validClasse, validModalidade, validConsumo)

      // No ineligibility
      expect(service.checkIneligibility(true, true, true)).toEqual([]);
      // Partial ineligibility
      expect(service.checkIneligibility(false, true, true)).toEqual([RazoesDeInelegibilidade.CLASSE_CONSUMO]);
      expect(service.checkIneligibility(true, false, true)).toEqual([RazoesDeInelegibilidade.MODALIDADE_TARIFARIA]);
      expect(service.checkIneligibility(true, true, false)).toEqual([RazoesDeInelegibilidade.BAIXO_CONSUMO]);
      expect(service.checkIneligibility(false, false, true)).toEqual([
        RazoesDeInelegibilidade.CLASSE_CONSUMO,
        RazoesDeInelegibilidade.MODALIDADE_TARIFARIA,
      ]);
      // Full ineligibility
      expect(service.checkIneligibility(false, false, false)).toEqual([
        RazoesDeInelegibilidade.CLASSE_CONSUMO,
        RazoesDeInelegibilidade.MODALIDADE_TARIFARIA,
        RazoesDeInelegibilidade.BAIXO_CONSUMO,
      ]);
    });
  });
});
