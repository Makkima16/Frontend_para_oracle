import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importar el FormBuilder y Validators
import { EquiposService } from '../../../services/equipos.service';
import { Equipo } from '../../../models/equipo.model';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent {

  equipoForm: FormGroup; // Formulario reactivo
  equipo: Equipo; // Modelo del equipo

  constructor(
    private equiposService: EquiposService,
    private fb: FormBuilder // Inyectamos el FormBuilder
  ) { 
    // Inicializamos el formulario
    this.equipoForm = this.fb.group({
      nombre: ['', Validators.required],
      favor: [0, [Validators.required, Validators.min(0)]],
      contra: [0, [Validators.required, Validators.min(0)]],
      npartidos: [0, [Validators.required, Validators.min(0)]]
    });
  }

  // Método para crear un equipo
  onSubmit() {
    if (this.equipoForm.valid) {
      const equipoData: Equipo = this.equipoForm.value; // Obtener los datos del formulario

      // Llamamos al servicio para crear el equipo
      this.equiposService.create(equipoData).subscribe({
        next: (equipo) => {
          alert('Equipo creado con éxito');
          this.equipoForm.reset(); // Limpiamos el formulario
        },
        error: (error) => {
          console.error('Error al crear el equipo:', error);
          alert('Error al crear el equipo');
        }
      });
    } else {
      alert('Formulario no válido');
    }
  }
}
