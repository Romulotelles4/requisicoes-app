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
import { Movimentacao } from '../models/movimentacao.model';
import { Requisicao } from '../models/requisicao.model';
import { RequisicaoService } from '../services/requisicao.service';

@Component({
  selector: 'app-requisicoes-departamento',
  templateUrl: './requisicoes-departamento.component.html'
})
export class RequisicoesDepartamentoComponent implements OnInit {
  public requisicoes$: Observable<Requisicao[]>
  public funcionarios$: Observable<Funcionario>
  public departamentos$: Observable<Departamento[]>
  public equipamentos$: Observable<Equipamento[]>
  public processoAutenticado$: Subscription
  public funcionarioLogado: Funcionario;
  public requisicaoSelecionada: Requisicao;
  public listaStatus: string[] = ["Aberta", "Processando", "Não autorizada", "Fechada"]
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
    this.form = this.fb.group({
      status: new FormControl("", [Validators.required]),
      descricao: new FormControl("", [Validators.required, Validators.minLength(6)]),
      funcionario: new FormControl(""),
      data: new FormControl("")

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

  get id(): AbstractControl | null {
    return this.form.get("id");
  }

  get status(): AbstractControl | null {
    return this.form.get("status");
  }

  public async gravar(modal: TemplateRef<any>, requisicao: Requisicao) {
    this.requisicaoSelecionada = requisicao;
    this.requisicaoSelecionada.movimentacoes = requisicao.movimentacoes ? requisicao.movimentacoes : [];
    this.form.reset()
    this.configurarValoresPadrao()

    try {
      await this.modalService.open(modal).result;

      if (this.form.dirty && this.form.valid) {
        this.adcionariMovimentacao(this.form.value);
        await this.requisicaoService.editar(this.requisicaoSelecionada);
        this.toastr.success("A requisição foi salva com sucesso!");
      }
      else
        this.toastr.error("Verifique o preenchimento do formulário e tente novamente.");
    } catch (_error) {
      if (_error != "fechar" && _error != "1" && _error != "0")
        this.toastr.error("Ocorreu um erro.")
    }
  }

  private adcionariMovimentacao(movimentacao: Movimentacao) {
    this.requisicaoSelecionada.movimentacoes.push(movimentacao)
    this.requisicaoSelecionada.status = this.status?.value;
    this.requisicaoSelecionada.ultimaAtualizacao = new Date();
  }

  public configurarValoresPadrao(): void {
    this.form.patchValue({
      funcionario: this.funcionarioLogado,
      status: this.requisicaoSelecionada.status,
      data: new Date()
    });
  }
}


