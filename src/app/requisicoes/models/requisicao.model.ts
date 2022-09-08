import { Departamento } from "src/app/departamentos/models/departamento.model";
import { Equipamento } from "src/app/equipamentos/models/equipamento.model";
import { Funcionario } from "src/app/funcionarios/models/funcionario.model";

export class Requisicao {
        id: string;
        dataAbertura: Date | any;
        descricao: string;

        funcionarioId: string;
        funcionario?: Funcionario;

        departamentoId: string;
        departamento?: Departamento;

        equipamentoId?: string;
        equipamento?: Equipamento;
}