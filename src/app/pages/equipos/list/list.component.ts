import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Equipo } from '../../../models/equipo.model';
import { EquiposService } from '../../../services/equipos.service';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit{
  equipo: Equipo[];



  constructor(private service: EquiposService, private router: Router, private activateRoute: ActivatedRoute,) {

  }

  ngOnInit(): void {
    this.list();
  }

  list() {
    this.service.list().subscribe(data => {
      this.equipo = data["data"];
    });
  }


}