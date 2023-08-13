import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})
export class EventoDetalheComponent implements OnInit {

  evento = {} as Evento;
  form!: FormGroup;
  estadoSalvar!: 'post';

  get f(): any {
    return this.form.controls;
  }

  constructor(private fb : FormBuilder,
              private localeService: BsLocaleService,
              private router : ActivatedRoute,
              private eventoService : EventoService,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService)
  { this.localeService.use('pt-br')}

  public carregarEvento() : any {
    const eventoIdParam = this.router.snapshot.paramMap.get('id');
    if(eventoIdParam !== null) {
      this.spinner.show();

      this.eventoService.getEventoById(+eventoIdParam).subscribe({
        next: (evento : Evento) => {
          this.evento = {...evento};
          this.form.patchValue(this.evento)
        },
        error: (error : any ) => {
          this.spinner.hide();
          this.toastr.error('Erro ao carregar o Evento selecionado.')
          console.error(error);
        },
        complete: () => this.spinner.hide(),
      })
    }
  }

  ngOnInit(): void {
    this.carregarEvento();
    this.validation();
  }

  public validation(): void {
    this.form = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(500)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      imageURL:['', Validators.required],
    });
  }

  public cssValidator(campoForm: FormControl): any {
    return { 'is-invalid': campoForm.errors && campoForm.touched };
  }

  resetForm(): void {
    this.form.reset();
  }

  public salvarAlteracao(): void {
    this.spinner.show();
    if(this.form.valid) {
      this.evento = (this.estadoSalvar === 'post')
                  ? {...this.form.value}
                  : {id: this.evento.id, ...this.form.value}

      this.eventoService[this.estadoSalvar](this.evento).subscribe({
        next: () => this.toastr.success('Evento adicionado com sucesso!', 'Sucesso'),
        error: (error : any) => {
          console.error();
          this.spinner.hide();
          this.toastr.error('Houve um erro ao tentar adicionar um novo evento!', 'Erro')
        },
        complete: () => this.spinner.hide()
      });
    }
  }
}
