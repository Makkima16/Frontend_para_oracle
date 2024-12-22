import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Equipo } from '../../../models/equipo.model';
import { PartidosService } from '../../../services/partidos.service';
import { EquiposService } from '../../../services/equipos.service';
import { Partido } from '../../../models/partido.model';
import Swal from 'sweetalert2';  // Importa Swal para los mensajes

 // Asegúrate de tener el modelo de Equipo

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  form: FormGroup;
  equipos: Equipo[] = [];
  
  trySend: boolean = false;

  constructor(
    private fb: FormBuilder,
    private partidosService: PartidosService,
    private equipoService: EquiposService,  // Servicio para equipos
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.form = this.fb.group({
      equipo1: ['', Validators.required],
      equipo2: ['', Validators.required],
      fecha: ['', Validators.required],
      fin: ['', Validators.required],  // Nuevo campo para la fecha de fin
      estadio: ['', Validators.required],
      estado: ['', Validators.required]  
    });
    this.form.get('equipo')?.valueChanges.subscribe((selectEquipoId) => {
      console.log('ID del curso seleccionado:', selectEquipoId);
    });
    this.loadEquipos();  // Cargar los equipos

  }
  loadEquipos() {
    this.equipoService.list().subscribe({
      next: (response: any) => {
        if ('data' in response) {
          this.equipos = response['data'];
        } else {
          this.equipos = response;
        }
      },
      error: (err) => {
        Swal.fire("Error", "No se pudieron cargar los cursos", "error");
        console.error(err);
      }
    });
  }
  
  // Manejar el envío del formulario
  submit() {
    this.trySend = true;
  
    // Verificar si el formulario es válido
    if (this.form.invalid) {
      Swal.fire("Error", "Por favor complete todos los campos correctamente", "error");
      return;
    }
  
    // Transformar las fechas al formato requerido por el backend
    const transformDate = (date: string): string => {
      if (!date) return '';
      const [datePart, timePart] = date.split('T');
      return `${datePart} ${timePart}:00`;
    };
  
    // Crear el objeto partido con los datos transformados
    const partidoData: Partido = {
      equipo1: this.form.value.equipo1,
      equipo2: this.form.value.equipo2,
      fecha: transformDate(this.form.value.fecha), // Transformar fecha
      estadio: this.form.value.estadio,
      estado: this.form.value.estado,
      fin: transformDate(this.form.value.fin) // Transformar fecha de fin
    };
  
    // Enviar los datos al servidor
    this.partidosService.create(partidoData).subscribe({
      next: (createdPartido) => {
        Swal.fire("Éxito", "El partido ha sido creado correctamente", "success");
        this.router.navigate(['#']); // Redirigir después de la creación
      },
      error: (err) => {
        console.error("Error al crear partido:", err);
        Swal.fire("Error", "No se pudo crear el partido", "error");
      }
    });
  }
}
