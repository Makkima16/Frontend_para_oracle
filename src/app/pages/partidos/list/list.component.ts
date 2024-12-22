import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Partido } from '../../../models/partido.model';
import { PartidosService } from '../../../services/partidos.service';
import { EquiposService } from '../../../services/equipos.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  equipo: Partido[] = [];
  equiposMap = new Map<number, string>();

  constructor(
    private service: PartidosService,
    private equipoServices: EquiposService,
    private router: Router,
    private activateRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadEquipos();
  }

  loadEquipos() {
    this.equipoServices.list().subscribe({
      next: (data: any) => {
        const equipos = data['data'];
        equipos.forEach((equipo: any) => {
          this.equiposMap.set(equipo.id, equipo.nombre);
        });
        this.listPartidos();
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudieron cargar los equipos', 'error');
        console.error(err);
      }
    });
  }

  listPartidos() {
    this.service.list().subscribe({
      next: (data: any) => {
        this.equipo = data['data'].map((partido: Partido) => ({
          ...partido,
          nombre_1: this.equiposMap.get(partido.equipo1) || 'Desconocido',
          nombre_2: this.equiposMap.get(partido.equipo2) || 'Desconocido'
        }));
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudieron cargar los partidos', 'error');
        console.error(err);
      }
    });
  }

  redirectToApuestas(partidoId: number) {
    this.router.navigate(['/apuesta/apostar'], {
      queryParams: {
        partido_id: partidoId,

      },
    });
  }
}
