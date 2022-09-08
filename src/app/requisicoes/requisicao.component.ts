import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Departamento } from '../departamentos/models/departamento.model';
import { DepartamentoService } from '../departamentos/services/departamento.service';
import { Equipamento } from '../equipamentos/models/equipamento.model';
import { EquipamentoService } from '../equipamentos/services/equipamento.service';
import { Requisicao } from './models/requisicao.model';
import { RequisicaoService } from './services/requisicao.service';

@Component({
  selector: 'app-requisicao',
  templateUrl: './requisicao.component.html',
  styleUrls: ['./requisicao.component.css']
})
export class RequisicaoComponent implements OnInit {
  public requisicoes$: Observable<Requisicao[]>
  public departamentos$: Observable<Departamento[]>
  public equipamentos$: Observable<Equipamento[]>
  public form: FormGroup

  constructor(
    private fb: FormBuilder,
    private requisicaoService: RequisicaoService,
    private departamentoService: DepartamentoService,
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
      departamentoId: new FormControl("", [Validators.required]),
      departamento: new FormControl(""),
      equipamentoId: new FormControl("", [Validators.required]),
      equipamento: new FormControl("")
    })
    this.requisicoes$ = this.requisicaoService.selecionarTodos();
    this.departamentos$ = this.departamentoService.selecionarTodos();
    this.equipamentos$ = this.equipamentoService.selecionarTodos();
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
    this.form.reset();

    if (requisicao)
      this.form.setValue(requisicao);

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
    }
  }

  public excluir(requisicao: Requisicao) {
    this.requisicaoService.excluir(requisicao);
    this.mensagemExclusao();
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
