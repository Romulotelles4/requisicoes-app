import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { map, Observable, pipe } from 'rxjs';
import { Departamento } from 'src/app/departamentos/models/departamento.model';
import { Equipamento } from 'src/app/equipamentos/models/equipamento.model';
import { Requisicao } from '../models/requisicao.model';

@Injectable({
  providedIn: 'root'
})
export class RequisicaoService {
  private registros: AngularFirestoreCollection<Requisicao>

  constructor(private toastr: ToastrService, private firestore: AngularFirestore) { 
    this.registros = this.firestore.collection<Requisicao>("funcionarios");
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
    return this.registros.valueChanges();
    pipe(
      map((requisicoes: Requisicao[]) => {
        requisicoes.forEach(requisicao => {
          this.firestore
            .collection<Departamento>("departamentos")
            .doc(requisicao.departamentoId)
            .valueChanges()
            .subscribe(x => requisicao.departamento = x);
        });
        return requisicoes;
      })
    )
  }
}
