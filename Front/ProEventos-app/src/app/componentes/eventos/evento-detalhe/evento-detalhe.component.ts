import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';
import { Lote } from '@app/models/Lote';
import { LoteService } from '@app/services/lote.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})

export class EventoDetalheComponent implements OnInit {

  modalRef : BsModalRef;
  eventoId: number;
  evento = {} as Evento;
  lote = {} as Lote;
  form!: FormGroup;
  estadoSalvar = 'post';
  loteAtual = { id: 0, nome: '', indice: 0 };
  imagemURL = 'assets/cloud.png';
  file : File;

  get modoEditar() : boolean {
    return this.estadoSalvar === 'put';
  }

  get f(): any {
    return this.form.controls;
  }

  get lotes() : FormArray {
    return this.form.get('lotes') as FormArray;
  }
  constructor(private fb : FormBuilder,
              private toastr: ToastrService,
              private router : Router,
              private spinner: NgxSpinnerService,
              private loteService : LoteService,
              private localeService: BsLocaleService,
              private eventoService : EventoService,
              private activatedRouter : ActivatedRoute,
              private modalService : BsModalService)
  { this.localeService.use('pt-br')}

  public carregarEvento() : any {
    this.eventoId = +this.activatedRouter.snapshot.paramMap.get('id');

    if(this.eventoId !== null && this.eventoId !== 0) {
      this.spinner.show();

      this.estadoSalvar = 'put';

      this.eventoService.getEventoById(this.eventoId).subscribe({
        next: (evento : Evento) => {
          this.evento = {...evento};
          this.form.patchValue(this.evento);
          if(this.evento.imageURL !==  '') {
            this.imagemURL = environment.apiURL + 'recursos/Images/' + this.evento.imageURL;
          } 
          this.evento.lotes.forEach(lote => {
            this.lotes.push(this.criarLote(lote));
          });
          //this.carregarLotes();
        },
        error: (error : any ) => {
          this.toastr.error('Erro ao carregar o Evento selecionado.')
          console.error(error);
        }
      }).add(() => this.spinner.hide());
    }
  }
  /* public carregarLotes() : void {
    this.loteService.getLoteByEventoId(this.eventoId).subscribe(
      (lotesRetorno : Lote[]) => {
        lotesRetorno.forEach(lote => {
          this.lotes.push(this.criarLote(lote));
        });
      },
      (error : any ) => {
        this.toastr.error('Erro ao carregar o Lote selecionado.', 'Erro!')
        console.error(error);
      }
    ).add(() => this.spinner.hide());
  } */

  ngOnInit(): void {
    this.carregarEvento();
    this.validation();
  }

  public validation(): void {
    this.form = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(200)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      imageURL: [''],
      lotes: this.fb.array([])
    });
  }

  public adicionarLote(): void {
    this.lotes.push(this.criarLote({id: 0} as Lote));
  }

  criarLote(lote: Lote): FormGroup {
    return this.fb.group({
      id: [lote.id],
      nome: [lote.nome, Validators.required],
      quantidade: [lote.quantidade, Validators.required],
      preco: [lote.preco, Validators.required],
      dataInicio: [lote.dataInicio],
      dataFim: [lote.dataFim],
    });
  }

  public mudarValorData(value: Date, indice: number, campo: string): void {
    this.lotes.value[indice][campo] = value;
  }


  retornaTituloLote(nome: string): string {
   return nome === null || nome === '' ? 'Nome do lote'  : nome;
  }

  public cssValidator(campoForm: FormControl | AbstractControl | null): any {
    return { 'is-invalid': campoForm.errors && campoForm.touched };
  }

  public resetForm(): void {
    this.form.reset();
  }

  public salvarEvento(): void {
    this.spinner.show();
    if (this.form.valid) {
      this.evento = (this.estadoSalvar === 'post')
          ? { ...this.form.value }
          : { id: this.evento.id, ...this.form.value };

      this.eventoService[this.estadoSalvar](this.evento).subscribe(
        (eventoRetorno : Evento) => {
          this.toastr.success('Evento salvo com Sucesso!', 'Sucesso');
          this.router.navigate([`eventos/detalhe/${eventoRetorno.id}`]);
        },
        (error: any) => {
          console.error(error);
          this.spinner.hide();
          this.toastr.error('Error ao salvar evento', 'Erro');
        },
        () => this.spinner.hide()
      );
    }
  }
  public salvarLotes(): void {
    if (this.form.controls.lotes.valid){
      this.spinner.show();
        this.loteService.saveLote(this.eventoId, this.form.value.lotes).subscribe(
          () => {
            this.toastr.success('Lotes salvos com Sucesso!', 'Sucesso');
            //this.lotes.reset();
          },
          (error) => {
            this.toastr.error('Não foi possível salvar o lote', 'Erro');
            console.error(error);
          }
        ).add(() => this.spinner.hide());
    }
  }

  public removerLote(template: TemplateRef<any>, indice: number): void {
    this.loteAtual.id = this.lotes.get(indice + '.id').value;
    this.loteAtual.nome = this.lotes.get(indice + '.nome').value;
    this.loteAtual.indice = indice;

    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirmDeleteLote(): void {
    this.modalRef.hide();
    this.spinner.show();

    this.loteService
      .deleteLote(this.eventoId, this.loteAtual.id)
      .subscribe(
        () => {
          this.toastr.success('Lote deletado com sucesso', 'Sucesso');
          this.lotes.removeAt(this.loteAtual.indice);
        },
        (error: any) => {
          this.toastr.error(
            `Erro ao tentar deletar o Lote ${this.loteAtual.id}`,
            'Erro'
          );
          console.error(error);
        }
      )
      .add(() => this.spinner.hide());
  }

  declineDeleteLote(): void {
    this.modalRef.hide();
  }

  onFileChange(ev : any): void {
    const reader = new FileReader();

    reader.onload = (event: any) => this.imagemURL = event.target.result

    this.file = ev.target.files;
    reader.readAsDataURL(this.file[0]);
    this.uploadImagem();
  }

  uploadImagem(): void {
    this.spinner.show();
    this.eventoService.postUpload(this.eventoId, this.file).subscribe(
      () => {
        this.carregarEvento();
        this.toastr.success('Imagem atualizada com sucesso', 'Sucesso!')
      },
      (error: any ) => {
        this.toastr.error('Erro ao tentar atualizar a imagem', 'Erro!')
        console.log(error)
      }
    ).add(() => this.spinner.hide());
  }
}
