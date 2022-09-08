import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequisicaoComponent } from './requisicao.component';

const routes: Routes = [
  { path: "requisicoes", component: RequisicaoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequisicaoRoutingModule { }
