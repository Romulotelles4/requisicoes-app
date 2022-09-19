import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { Departamento } from 'src/app/departamentos/models/departamento.model';
import { DepartamentoService } from 'src/app/departamentos/services/departamento.service';
import { Equipamento } from 'src/app/equipamentos/models/equipamento.model';
import { EquipamentoService } from 'src/app/equipamentos/services/equipamento.service';
import { Funcionario } from 'src/app/funcionarios/models/funcionario.model';
import { FuncionarioService } from 'src/app/funcionarios/services/funcionario.service';
import { Requisicao } from '../models/requisicao.model';
import { RequisicaoService } from '../services/requisicao.service';

@Component({
  selector: 'app-requisicoes-funcionario',
  templateUrl: './requisicoes-funcionario.component.html'
})
export class RequisicoesFuncionarioComponent implements OnInit, OnDestroy {
  public requisicoes$: Observable<Requisicao[]>
  public funcionarios$: Observable<Funcionario>
  public departamentos$: Observable<Departamento[]>
  public equipamentos$: Observable<Equipamento[]>
  public processoAutenticado$: Subscription
  public funcionarioLogado: Funcionario;
  public form: FormGroup

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private requisicaoService: RequisicaoService,
    private departamentoService: DepartamentoService,
    private funcionarioService: FuncionarioService,
    private equipamentoService: EquipamentoService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) { }
  mensagemEdicao() {
    this.toastr.success('Requisição editada com sucesso');
  }
  mensagemExclusao() {
    this.toastr.warning('Requisição excluida');
  }

  ngOnInit(): void {
    this.requisicoes$ = this.requisicaoService.selecionarTodos();

    this.form = this.fb.group({
      id: new FormControl(""),
      dataAbertura: new FormControl(""),
      descricao: new FormControl("", [Validators.required, Validators.minLength(3)]),

      funcionarioId: new FormControl(""),
      funcionario: new FormControl(""),

      departamentoId: new FormControl("", [Validators.required]),
      departamento: new FormControl(""),

      equipamentoId: new FormControl("", [Validators.required]),
      equipamento: new FormControl(""),

      status: new FormControl(""),
      ultimaAtualizacao: new FormControl(""),
      movimentacoes: new FormControl("")
    })
    this.departamentos$ = this.departamentoService.selecionarTodos();
    this.equipamentos$ = this.equipamentoService.selecionarTodos();
    this.requisicoes$ = this.requisicaoService.selecionarTodos();

    this.processoAutenticado$ = this.authService.usuarioLogado.subscribe(usuario => {
      const email: string = usuario?.email!;
      this.funcionarioService.selecionarFuncionarioLogado(email)
        .subscribe(funcionario => {
          this.funcionarioLogado = funcionario;
        })
    })
  }

  ngOnDestroy(): void {
    this.processoAutenticado$.unsubscribe();
  }

  get tituloModal(): string {
    return this.id?.value ? "Atualização" : "Cadastro";
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
  get funcionarioId(): AbstractControl | null {
    return this.form.get("requisicao.funcionarioId");
  }
  get funcionario(): AbstractControl | null {
    return this.form.get("requisicao.funcionario");
  }
  get departamentoId(): AbstractControl | null {
    return this.form.get("requisicao.departamentoId");
  }
  get departamento(): AbstractControl | null {
    return this.form.get("requisicao.departamento");
  }
  get equipamentoId(): AbstractControl | null {
    return this.form.get("requisicao.equipamentoId");
  }
  get equipamento(): AbstractControl | null {
    return this.form.get("requisicao.equipamento");
  }

  public async gravar(modal: TemplateRef<any>, requisicao?: Requisicao) {
    this.form.reset()
    this.configurarValoresPadrao()

    if (requisicao) {
      const departamento = requisicao.departamento ? requisicao.departamento : null;
      const funcionario = requisicao.funcionario ? requisicao.funcionario : null;
      const equipamento = requisicao.equipamento ? requisicao.equipamento : null;

      const requisicaoCompleta = {
        ...requisicao,
        departamento,
        funcionario,
        equipamento
      }
      this.form.setValue(requisicaoCompleta);
    }

    try {
      await this.modalService.open(modal).result;

      if (!requisicao)
        await this.requisicaoService.inserir(this.form.value)
      else {
        await this.requisicaoService.editar(this.form.value)
        this.mensagemEdicao();
      }
    }
    catch (_error) {
      if (_error != "fechar" && _error != "1" && _error != "0")
        this.toastr.error("Ocorreu um erro.")
    }

  }

  public excluir(requisicao: Requisicao) {
    this.requisicaoService.excluir(requisicao);
    this.mensagemExclusao();
  }

  public configurarValoresPadrao(): void {
    this.form.patchValue({
      status: "Aberta",
      dataAbertura: new Date(),
      ultimaAtualizacao: new Date(),
      equipamentoId: null,
      funcionarioId: this.funcionarioLogado.id
    });
  }
}
