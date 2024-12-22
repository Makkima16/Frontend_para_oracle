import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';  // Para notificaciones
import { ApuestasService } from '../../../services/apuestas.service';
import { ClientsService } from '../../../services/clients.service';
import { PartidosService } from '../../../services/partidos.service';  // Asegúrate de tener este servicio

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  form: FormGroup;
  partidos: any[] = [];  // Aquí deberías obtener los partidos disponibles
  clientes: any[] = [];  // Aquí deberías obtener los clientes disponibles
  equiposDelPartido: any[] = [];
  equipo1: any;  // Equipo 1
  equipo2: any;  // Equipo 2  
  email_client: string;
  nombre_ganador: string;
  cliente_id: number;
  partido_id: number;
  saldo_cliente: number = 0;  // Almacenaremos el saldo del cliente
  isClientLoaded: boolean = false; // Bandera para asegurar que el cliente esté cargado
  tipoApuestaOptions: string[] = ['Marcador Exacto', 'Ganador del Partido']; // Opciones para el tipo de apuesta

  // Variables para manejar goles y selección de ganador
  goles_equipo1: number;
  goles_equipo2: number;
  equipo_ganador: number;

  constructor(
    private fb: FormBuilder,
    private apuestasService: ApuestasService,
    private router: Router,
    private service: ClientsService,
    private route: ActivatedRoute,
    private partidosService: PartidosService  // Servicio para obtener datos de partidos
  ) { }

  ngOnInit(): void {
    // Crear el formulario sin el campo de cuota
    this.form = this.fb.group({
      p_tipo_apuesta: ['', Validators.required],
      p_monto: ['', [Validators.required, Validators.min(1)]],
      p_goles_equipo1: [0, [Validators.min(0)]],
      p_goles_equipo2: [0, [Validators.min(0)]],
      p_equipo_ganador: ['', Validators.required]
    });

    // Obtener el id del partido desde la URL
    this.route.queryParams.subscribe((params) => {
      this.partido_id = params['partido_id']; // Captura el id del partido
      this.loadEquiposDelPartido(); // Cargar los equipos del partido
    });

    // Cargar el cliente
    this.guardarid();
  }

  loadEquiposDelPartido(): void {
    this.partidosService.getEquiposPorPartido(this.partido_id).subscribe(
      (equipos) => {
        this.equipo1 = equipos.equipo1;
        this.equipo2 = equipos.equipo2;
        this.equiposDelPartido = [this.equipo1, this.equipo2];
      },
      (error) => {
        console.error('Error al cargar los equipos del partido', error);
      }
    );
  }

  onTipoApuestaChange(): void {
    const tipoApuesta = this.form.get('p_tipo_apuesta')?.value;
  
    if (tipoApuesta === 'Marcador Exacto') {
      this.form.get('p_goles_equipo1')?.setValidators([Validators.required, Validators.min(0)]);
      this.form.get('p_goles_equipo2')?.setValidators([Validators.required, Validators.min(0)]);
      this.form.get('p_equipo_ganador')?.clearValidators();
    } else if (tipoApuesta === 'Ganador del Partido') {
      this.form.get('p_equipo_ganador')?.setValidators([Validators.required]);
      this.form.get('p_goles_equipo1')?.clearValidators();
      this.form.get('p_goles_equipo2')?.clearValidators();
    }
  
    this.form.get('p_goles_equipo1')?.updateValueAndValidity();
    this.form.get('p_goles_equipo2')?.updateValueAndValidity();
    this.form.get('p_equipo_ganador')?.updateValueAndValidity();
  }

  calcularCuota(golesEquipo1: number, golesEquipo2: number): number {
    const diferenciaGoles = Math.abs(golesEquipo1 - golesEquipo2);
    let cuota = 1; // Cuota base
    
    if (diferenciaGoles >= 5) {
      cuota = 10; // Cuota alta para grandes diferencias
    } else if (diferenciaGoles >= 3) {
      cuota = 5; // Cuota moderada
    } else if (diferenciaGoles >= 1) {
      cuota = 2; // Cuota baja
    }
    
    return cuota;
  }

  onSubmit(): void {
    if (!this.isClientLoaded) {
      Swal.fire('Error', 'Cliente no cargado correctamente. Intenta nuevamente.', 'error');
      return; // Detener el envío si el cliente no está cargado correctamente
    }

    if (this.form.invalid) {
      Swal.fire('Error', 'Por favor, completa todos los campos correctamente.', 'error');
      return;
    }

    const { p_tipo_apuesta, p_monto, p_goles_equipo1, p_goles_equipo2, p_equipo_ganador } = this.form.value;

    // Lógica para determinar el nombre del ganador
    if (p_goles_equipo1 > p_goles_equipo2) {
      this.nombre_ganador = this.equipo1.nombre;
    } else if (p_goles_equipo1 < p_goles_equipo2) {
      this.nombre_ganador = this.equipo2.nombre;
    } else {
      this.nombre_ganador = 'Empate';
    }

    // Calcular la cuota en base a la diferencia de goles
    const cuotaCalculada = this.calcularCuota(p_goles_equipo1, p_goles_equipo2);

    // Si es Marcador Exacto, pasamos los goles
    if (p_tipo_apuesta === 'Marcador Exacto') {
      this.apuestasService.registrarApuesta(
        this.cliente_id,
        this.partido_id,
        p_tipo_apuesta,
        this.nombre_ganador,  // Guardamos el equipo ganador o el marcador exacto
        p_goles_equipo1,
        p_goles_equipo2,
        p_monto,
        cuotaCalculada // Usamos la cuota calculada
      ).subscribe(
        (response) => {
          Swal.fire('Éxito', 'La apuesta ha sido registrada con éxito.', 'success');
        },
        (error) => {
          Swal.fire('Error', 'Hubo un problema al registrar la apuesta.', 'error');
        }
      );
    } 
    // Si es Ganador del Partido, pasamos el equipo ganador
    else if (p_tipo_apuesta === 'Ganador del Partido') {
      if (p_equipo_ganador == this.equipo1.id) {
        this.nombre_ganador = this.equipo1.nombre;
      } else if (p_equipo_ganador == this.equipo2.id) {
        this.nombre_ganador = this.equipo2.nombre;
      }
      const cuota_partido = 2
      this.apuestasService.registrarApuesta(
        this.cliente_id,
        this.partido_id,
        p_tipo_apuesta,
        this.nombre_ganador, // Guardamos el equipo ganador o el marcador exacto
        p_goles_equipo1,
        p_goles_equipo2,
        p_monto,
        cuota_partido // Implemente aqui su logica para apuestas de tipo Ganador del Partido
      ).subscribe(
        (response) => {
          Swal.fire('Éxito', 'La apuesta ha sido registrada con éxito.', 'success');
        },
        (error) => {
          Swal.fire('Error', 'Hubo un problema al registrar la apuesta.', 'error');
        }
      );
    }
  }

  guardarid() {
    const token = sessionStorage.getItem('sesion') ? JSON.parse(sessionStorage.getItem('sesion')).token : null;

    if (token) {
      const decodedToken = this.decodeToken(token);
      this.email_client = decodedToken.email;

      if (this.email_client) {
        this.service.list().subscribe(data => {
          const cliente = data['data'];
          cliente.password = ''; 
          const ClienteEncontrado = cliente.find(cliente => cliente.email === this.email_client);
          if (ClienteEncontrado) {
            this.cliente_id = ClienteEncontrado.id;
            this.saldo_cliente = ClienteEncontrado.saldo;  // Aquí asignamos el saldo
            this.isClientLoaded = true;

            // Establecer el valor máximo para el monto en el formulario
            this.form.get('p_monto')?.setValidators([Validators.required, Validators.min(1), Validators.max(this.saldo_cliente)]);
            this.form.get('p_monto')?.updateValueAndValidity();  // Actualiza las validaciones del formulario

          } else {
            sessionStorage.removeItem('sesion');
          }
        });
      } else {
        console.error('No hay email almacenado en el token');
      }
    } else {
      console.error('No existe una sesión');
    }
  }

  // Función que decodifica el token JWT manualmente
  decodeToken(token: string): any {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Token inválido');
    }

    const payload = parts[1];  // El payload es la segunda parte
    const decoded = atob(payload);  // Decodificamos de base64
    return JSON.parse(decoded);  // Retornamos el payload como un objeto
  }
}
