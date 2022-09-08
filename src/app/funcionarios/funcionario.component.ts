import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../auth/services/authentication.service';
import { Departamento } from '../departamentos/models/departamento.model';
import { DepartamentoService } from '../departamentos/services/departamento.service';
import { Funcionario } from './models/funcionario.model';
import { FuncionaioService } from './services/funcionaio.service';

@Component({
  selector: 'app-funcionario',
  templateUrl: './funcionario.component.html',
  styleUrls: ['./funcionario.component.css']
})
export class FuncionarioComponent implements OnInit {
  public funcionarios$: Observable<Funcionario[]>
  public departamentos$: Observable<Departamento[]>
  public form: FormGroup

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private fb: FormBuilder,
    private funcionarioService: FuncionaioService,
    private departamentoService: DepartamentoService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) { }

  mensagemEdicao() {
    this.toastr.success('Funcionário editado com sucesso');
  }
  mensagemExclusao() {
    this.toastr.warning('Funcionário excluido');
  }

  ngOnInit(): void {
    this.form = this.fb.group({
        funcionario: new FormGroup({
        id: new FormControl(""),
        nome: new FormControl("", [Validators.required, Validators.minLength(3)]),
        email: new FormControl("", [Validators.required, Validators.email]),
        funcao: new FormControl("", [Validators.required, Validators.minLength(3)]),
        departamentoId: new FormControl("", [Validators.required]),
        departamento: new FormControl("")
      }),
      senha: new FormControl("", [Validators.required, Validators.minLength(6)])
    });
    this.funcionarios$ = this.funcionarioService.selecionarTodos();
    this.departamentos$ = this.departamentoService.selecionarTodos();
  }

  get tituloModal(): string {
    return this.id?.value ? "Atualização" : "Cadastro";
  }

  get senha(): AbstractControl | null {
    return this.form.get("senha")
  }

  get id(): AbstractControl | null {
    return this.form.get("funcionario.id");
  }

  get nome(): AbstractControl | null {
    return this.form.get("funcionario.nome");
  }
  get email(): AbstractControl | null {
    return this.form.get("funcionario.email");
  }
  get funcao(): AbstractControl | null {
    return this.form.get("funcionario.funcao");
  }
  get departamentoId(): AbstractControl | null {
    return this.form.get("funcionario.departamentoId");
  }
  get departamento(): AbstractControl | null {
    return this.form.get("funcionario.departamento");
  }

  public async gravar(modal: TemplateRef<any>, funcionario?: Funcionario) {
    this.form.reset();

    if (funcionario)
      this.form.get("funcionario")?.setValue(funcionario);

    try {
      await this.modalService.open(modal).result;
      if (this.nome?.invalid) {
        this.toastr.error("O nome do funcionário está inválido!", "Cadastro de funcionários")
        return
      }

      if (!funcionario) {
        await this.authService.cadastrar(this.email?.value, this.senha?.value)
        await this.funcionarioService.inserir(this.form.get("funcionario")?.value)

        await this.authService.logout()
        await this.router.navigate(["/login"]);
      }

      else {
        await this.funcionarioService.editar(this.form.get("funcionario")?.value)
        this.mensagemEdicao();
      }

    }
    catch (_error) {
    }
  }

  public excluir(funcionario: Funcionario) {
    this.funcionarioService.excluir(funcionario);
    this.mensagemExclusao();
  }

}
