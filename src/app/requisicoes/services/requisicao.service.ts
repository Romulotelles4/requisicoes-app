import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { map, Observable, pipe, take } from 'rxjs';
import { Departamento } from 'src/app/departamentos/models/departamento.model';
import { Equipamento } from 'src/app/equipamentos/models/equipamento.model';
import { Funcionario } from 'src/app/funcionarios/models/funcionario.model';
import { Requisicao } from '../models/requisicao.model';
import { RequisicoesDepartamentoComponent } from '../requisicoes-departamento/requisicoes-departamento.component';

@Injectable({
  providedIn: 'root'
})
export class RequisicaoService {
  private registros: AngularFirestoreCollection<Requisicao>

  constructor(private toastr: ToastrService, private firestore: AngularFirestore) {
    this.registros = this.firestore.collection<Requisicao>("requisicoes");
  }

  public async inserir(registro: Requisicao): Promise<any> {
    const res = await this.registros.add(registro).then(res => {
      registro.id = res.id;
      this.registros.doc(res.id).set(registro);
    })
    this.toastr.success('Requisição inserida com sucesso');
  }

  public async editar(registro: Requisicao): Promise<void> {
    return this.registros.doc(registro.id).set(registro);
  }

  public excluir(registro: Requisicao): Promise<void> {
    return this.registros.doc(registro.id).delete();
  }

  public selecionarTodos(): Observable<Requisicao[]> {
    return this.registros.valueChanges()
    .pipe(
      map((requisicoes: Requisicao[]) => {
        requisicoes.forEach(requisicao => {
          this.firestore
            .collection<Departamento>("departamentos")
            .doc(requisicao.departamentoId)
            .valueChanges()
            .subscribe(d => requisicao.departamento = d);
          this.firestore
            .collection<Funcionario>("funcionarios")
            .doc(requisicao.funcionarioId)
            .valueChanges()
            .subscribe(f => requisicao.funcionario = f);
          if (requisicao.equipamentoId) {
            this.firestore
              .collection<Equipamento>("equipamentos")
              .doc(requisicao.equipamentoId)
              .valueChanges()
              .subscribe(e => requisicao.equipamento = e);
          }
        });
        return requisicoes;
      })
    )
  }
  public selecionarRequisicoesFuncionarioAtual(id: string) {
    return this.selecionarTodos()
      .pipe(
        map(requisicoes => {
          return requisicoes.filter(req => req.funcionarioId === id);
        }
        ))
  }

  public selecionarRequisicoesPorDepartamentoId(departamentoId: string) {
    return this.selecionarTodos()
      .pipe(
        map(requisicoes => {
          return requisicoes.filter(req => req.departamentoId === departamentoId);
        }
        ))
  }

  public selecionarPorId(id: string): Observable<Requisicao> {
    return this.selecionarTodos()
      .pipe(
        take(1),
        map(requisicoes => {
          return requisicoes.filter(req => req.id === id)[0];
        }
        ))
  }

}
