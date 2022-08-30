import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../auth/services/authentication.service';

@Component({
  selector: 'app-painel',
  templateUrl: './painel.component.html',
  styleUrls: ['./painel.component.css']
})
export class PainelComponent implements OnInit, OnDestroy {
  emailUsuario?: string | null;
  ususarioLogado$: Subscription;

  constructor(private authService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
    this.ususarioLogado$ = this.authService.usuarioLogado
      .subscribe(usuario => this.emailUsuario = usuario?.email);
  }

  ngOnDestroy(): void {
    this.ususarioLogado$.unsubscribe();
  }

  public sair() {
    this.authService.logout().then(() => this.router.navigate(['/login']))
  }

}
