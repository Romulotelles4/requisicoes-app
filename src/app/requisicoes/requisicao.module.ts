import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequisicaoRoutingModule } from './requisicao-routing.module';
import { RequisicaoComponent } from './requisicao.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { RequisicoesFuncionarioComponent } from './requisicoes-funcionario/requisicoes-funcionario.component';
import { RequisicoesDepartamentoComponent } from './requisicoes-departamento/requisicoes-departamento.component';
import { DetalhesComponent } from './detalhes/detalhes.component';
import { RequisicaoDetalhesComponent } from './detalhes/requisicao-detalhes/requisicao-detalhes.component';
import { RequisicoesDepartamentoPipe } from './pipes/requisicoes-departamento.pipe';
import { RequisicoesFuncionarioPipe } from './pipes/requisicoes-funcionario.pipe';


@NgModule({
  declarations: [
    RequisicaoComponent,
    RequisicoesFuncionarioComponent,
    RequisicoesDepartamentoComponent,
    DetalhesComponent,
    RequisicaoDetalhesComponent,
    RequisicoesDepartamentoPipe,
    RequisicoesFuncionarioPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
    RequisicaoRoutingModule
  ]
})
export class RequisicaoModule { }
