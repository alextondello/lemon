import { Injectable } from '@nestjs/common';

import { ELIGIBLE_CLASSES_CONSUMO } from '../shared/consts/eligible-classes-consumo.const';
import { ELIGIBLE_MODALIDADES_TARIFARIAS } from '../shared/consts/eligible-modalidades-tarifarias.const';
import { ClassesDeConsumo } from '../shared/enums/classes-consumo.enum';
import { ModalidadesTarifarias } from '../shared/enums/modalidades-tarifarias.enum';
import { RazoesDeInelegibilidade } from '../shared/enums/razoes-inelegibilidade.enum';
import { TiposDeConexao } from '../shared/enums/tipos-conexao.enum';
import { VerifyClientEligibilityRequestDTO, VerifyClientEligibilityResponseDTO } from './eligibility.dto';

@Injectable()
export class EligibilityService {
  /**
   * Main function that verifies whether a client qualifies to become a Lemon customer
   */
  verifyClientEligibility(dto: VerifyClientEligibilityRequestDTO): VerifyClientEligibilityResponseDTO {
    const validClasse = this.validateClasseConsumo(dto.classeDeConsumo);
    const validModalidade = this.validateModalidadeTarifaria(dto.modalidadeTarifaria);
    const validConsumo = this.validateConsumoMinimo(dto.tipoDeConexao, dto.historicoDeConsumo);

    const elegivel = validClasse && validModalidade && validConsumo;
    const economiaAnualDeCO2 = this.calculateCO2EmissionsSavings(dto.historicoDeConsumo);
    const razoesDeInelegibilidade = this.checkIneligibility(validClasse, validModalidade, validConsumo);

    return elegivel ? { elegivel, economiaAnualDeCO2 } : { elegivel, razoesDeInelegibilidade };
  }

  /**
   * Function that validates if the 'classe de consumo' qualifies to become a Lemon customer
   */
  validateClasseConsumo(classeDeConsumo: ClassesDeConsumo): boolean {
    return ELIGIBLE_CLASSES_CONSUMO.includes(classeDeConsumo);
  }

  /**
   * Function that validates if the 'modalidade tarifaria' qualifies to become a Lemon customer
   */
  validateModalidadeTarifaria(modalidadeTarifaria: ModalidadesTarifarias): boolean {
    return ELIGIBLE_MODALIDADES_TARIFARIAS.includes(modalidadeTarifaria);
  }

  /**
   * Function that validates if the client's average consumption qualifies them to become a Lemon customer
   */
  validateConsumoMinimo(tipoDeConexao: TiposDeConexao, historicoDeConsumo: number[]): boolean {
    const averageConsumption = this.calculateAverageConsumption(historicoDeConsumo);

    switch (true) {
      case tipoDeConexao === TiposDeConexao.MONOFASICO:
        return averageConsumption >= 400;
      case tipoDeConexao === TiposDeConexao.BIFASICO:
        return averageConsumption >= 500;
      case tipoDeConexao === TiposDeConexao.TRIFASICO:
        return averageConsumption >= 750;
    }
  }

  /**
   * Function that calculates annual CO2 emission savings based on the client's energy consumption history
   */
  calculateCO2EmissionsSavings(historicoDeConsumo: number[]): number {
    const averageConsumption = this.calculateAverageConsumption(historicoDeConsumo); // Kwh
    const anualConsumption = averageConsumption * 12; // Kwh
    const CO2EmissionsPerKwh = 84 / 1000; // Kg/Kwh
    const CO2EmissionsSavings = CO2EmissionsPerKwh * anualConsumption; // Kg

    return Number(CO2EmissionsSavings.toFixed(2));
  }

  /**
   * Function that calculates the average energy consumption from the client's energy usage history
   */
  calculateAverageConsumption(historicoDeConsumo: number[]): number {
    const initialValue = 0;
    const arraySize = historicoDeConsumo.length;

    return (
      historicoDeConsumo.reduce((accumulator, currentValue) => accumulator + currentValue, initialValue) / arraySize
    );
  }

  /**
   * Function that checks if all eligibility conditions have been met and provides the reasons for ineligibility
   */
  checkIneligibility(validClasse: boolean, validModalidade: boolean, validConsumo: boolean): RazoesDeInelegibilidade[] {
    const razoesDeInelegibilidade: RazoesDeInelegibilidade[] = [];

    !validClasse && razoesDeInelegibilidade.push(RazoesDeInelegibilidade.CLASSE_CONSUMO);
    !validModalidade && razoesDeInelegibilidade.push(RazoesDeInelegibilidade.MODALIDADE_TARIFARIA);
    !validConsumo && razoesDeInelegibilidade.push(RazoesDeInelegibilidade.BAIXO_CONSUMO);

    return razoesDeInelegibilidade;
  }
}
