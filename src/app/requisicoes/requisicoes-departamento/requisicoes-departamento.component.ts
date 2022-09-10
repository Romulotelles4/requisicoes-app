import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { Departamento } from 'src/app/departamentos/models/departamento.model';
import { DepartamentoService } from 'src/app/departamentos/services/departamento.service';
import { FuncionarioService } from 'src/app/funcionarios/services/funcionario.service';
import { Requisicao } from '../models/requisicao.model';
import { RequisicaoService } from '../services/requisicao.service';

@Component({
  selector: 'app-requisicoes-departamento',
  templateUrl: './requisicoes-departamento.component.html'
})
export class RequisicoesDepartamentoComponent implements OnInit {
  public requisicoes$: Observable<Requisicao[]>
  public departamentos$: Observable<Departamento[]>
  public form: FormGroup


  constructor(
    private fb: FormBuilder,
    private requisicaoService: RequisicaoService,
    private departamentoService: DepartamentoService,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.requisicoes$ = this.requisicaoService.selecionarTodos();

    this.form = this.fb.group({
      id: new FormControl(""),

      dataAbertura: new FormControl(""),

      descricao: new FormControl("", [Validators.required, Validators.minLength(3)]),

      departamentoId: new FormControl("", [Validators.required]),
      departamento: new FormControl(""),
    })

    this.departamentos$ = this.departamentoService.selecionarTodos();
  }

  get id(): AbstractControl | null {
    return this.form.get("requisicao.id");
  }
  get dataAbertura(): AbstractControl | null {
    return this.form.get("requisicao.dataAbertura");
  }
  get descricao(): AbstractControl | null {
    return this.form.get("requisicao.descricao");
  }
  get departamentoId(): AbstractControl | null {
    return this.form.get("requisicao.departamentoId");
  }
  get departamento(): AbstractControl | null {
    return this.form.get("requisicao.departamento");
  }

  public ArrumarData() {
    var dataAbertura = new Date();
    var dia = dataAbertura.getDay();
    var mes = dataAbertura.getMonth();
    var ano = dataAbertura.getFullYear();
    var dataHoje: string = `${dia + 4}/${mes + 1}/${ano}`
    console.log(dataHoje)
    this.form.get("dataAbertura")?.setValue(dataHoje)
  }
}


