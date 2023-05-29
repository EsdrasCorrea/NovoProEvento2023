import { Component, OnInit, TemplateRef } from '@angular/core';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { Evento } from '../../models/Evento';
import { EventoService } from '../../services/evento.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {

  constructor(){}

  ngOnInit(): void {

  }
}
