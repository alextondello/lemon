import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDecimal,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Length,
  Max,
  Min,
} from 'class-validator';

import { ClassesDeConsumo } from '../shared/enums/classes-consumo.enum';
import { ModalidadesTarifarias } from '../shared/enums/modalidades-tarifarias.enum';
import { RazoesDeInelegibilidade } from '../shared/enums/razoes-inelegibilidade.enum';
import { TiposDeConexao } from '../shared/enums/tipos-conexao.enum';

export class VerifyClientEligibilityRequestDTO {
  @IsNotEmpty()
  @IsDecimal()
  @Length(11, 14)
  numeroDoDocumento: string;

  @IsNotEmpty()
  @IsEnum(TiposDeConexao)
  tipoDeConexao: TiposDeConexao;

  @IsNotEmpty()
  @IsEnum(ClassesDeConsumo)
  classeDeConsumo: ClassesDeConsumo;

  @IsNotEmpty()
  @IsEnum(ModalidadesTarifarias)
  modalidadeTarifaria: ModalidadesTarifarias;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(3)
  @ArrayMaxSize(12)
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(9999, { each: true })
  historicoDeConsumo: number[];
}

export class VerifyClientEligibilityResponseDTO {
  @IsNotEmpty()
  @IsBoolean()
  elegivel: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  economiaAnualDeCO2?: number;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @IsEnum(RazoesDeInelegibilidade, { each: true })
  razoesDeInelegibilidade?: RazoesDeInelegibilidade[];
}
