import { Departamento } from "src/app/departamentos/models/departamento.model";
import { Equipamento } from "src/app/equipamentos/models/equipamento.model";

export class Requisicao {
        id: string;
        dataAbertura: Date = new Date();
        descricao: string;
        departamentoId: string;
        departamento?: Departamento;
        equipamentoId: string;
        equipamento?: Equipamento;
}