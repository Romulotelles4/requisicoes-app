import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { DepartamentoService } from '../departamentos/services/departamento.service';
import { Equipamento } from './models/equipamento.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EquipamentoService } from './services/equipamento.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-equipamento',
  templateUrl: './equipamento.component.html',
  styleUrls: ['./equipamento.component.css']
})
export class EquipamentoComponent implements OnInit {
  public equipamentos$: Observable<Equipamento[]>
  public form: FormGroup;

  constructor(private toastr: ToastrService, private equipamentoService: EquipamentoService, private fb: FormBuilder, private modalService: NgbModal) { }
  mensagemEdicao() {
    this.toastr.success('Equipamento editado com sucesso');
  }
  mensagemExclusao() {
    this.toastr.warning('Equipamento excluido');
  }
  ngOnInit(): void {
    this.equipamentos$ = this.equipamentoService.selecionarTodos();

    this.form = this.fb.group({
      numeroDeSerie: new FormControl(""),
      nome: new FormControl(""),
      precoAquisicao: new FormControl(""),
      dataDeFabricacao: new FormControl("")
    })
  }
  get tituloModal(): string {
    return this.numeroDeSerie?.value ? "Atualização" : "Cadastro";
  }

  get numeroDeSerie() {
    return this.form.get("numeroDeSerie");
  }
  get nome() {
    return this.form.get("nome");
  }
  get precoAquisicao() {
    return this.form.get("precoAquisicao");
  }
  get dataDeFabricacao() {
    return this.form.get("dataDeFabricacao");
  }

  public async gravar(modal: TemplateRef<any>, equipamento?: Equipamento) {
    this.form.reset();

    if (equipamento)
      this.form.setValue(equipamento);

    try {
      await this.modalService.open(modal).result;

      if (!equipamento)
        await this.equipamentoService.inserir(this.form.value)
      else {
        await this.equipamentoService.editar(this.form.value)
        this.mensagemEdicao();
      }

    }
    catch (_error) {
    }
  }

  public excluir(equipamento: Equipamento) {
    this.equipamentoService.excluir(equipamento);
    this.mensagemExclusao();
  }

}
