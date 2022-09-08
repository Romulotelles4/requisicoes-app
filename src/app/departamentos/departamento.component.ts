import { Component, OnInit, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Departamento } from './models/departamento.model';
import { DepartamentoService } from './services/departamento.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { validateEventsArray } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-departamento',
  templateUrl: './departamento.component.html',
  styleUrls: ['./departamento.component.css']
})
export class DepartamentoComponent implements OnInit {
  public departamentos$: Observable<Departamento[]>;
  public form: FormGroup;

  constructor(private toastr: ToastrService, private departamentoService: DepartamentoService, private fb: FormBuilder, private modalService: NgbModal) { }
  mensagemEdicao() {
    this.toastr.success('Departamento editado com sucesso');
  }
  mensagemExclusao() {
    this.toastr.warning('Departamento excluido');
  }
  ngOnInit(): void {
    this.departamentos$ = this.departamentoService.selecionarTodos();

    this.form = this.fb.group({
      id: new FormControl(""),
      nome: new FormControl("", [Validators.required, Validators.minLength(3)]),
      telefone: new FormControl("", [Validators.required])
    })
  }

  get tituloModal(): string {
    return this.id?.value ? "Atualização" : "Cadastro";
  }
  get id() {
    return this.form.get("id");
  }
  get nome() {
    return this.form.get("nome");
  }
  get telefone() {
    return this.form.get("telefone");
  }

  public async gravar(modal: TemplateRef<any>, departamento?: Departamento) {
    this.form.reset();

    if (departamento)
      this.form.setValue(departamento);

    try {
      await this.modalService.open(modal).result;

      if (!departamento)
        await this.departamentoService.inserir(this.form.value)
      else {
        await this.departamentoService.editar(this.form.value)
        this.mensagemEdicao();
      }

    }
    catch (_error) {

    }


  }

  public excluir(departamento: Departamento) {
    this.departamentoService.excluir(departamento);
    this.mensagemExclusao();
  }



}
