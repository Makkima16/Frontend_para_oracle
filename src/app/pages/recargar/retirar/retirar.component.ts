import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TransaccionesService } from '../../../services/transacciones.service';
import { ClientsService } from '../../../services/clients.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-retirar',
  templateUrl: './retirar.component.html',
  styleUrls: ['./retirar.component.css']
})
export class RetirarComponent implements OnInit {
  email_client: string;
  cliente_id: number;
  monto_retiro: number; // Variable para almacenar el monto a retirar
  mensaje: string = ''; // Mensaje para mostrar resultado

  constructor(
    private router: Router,
    private services: TransaccionesService,
    private clienteServices:ClientsService
  ) {}

  ngOnInit(): void {
    this.guardarid();
  }

  decodeToken(token: string): any {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Token inválido');
    }

    const payload = parts[1]; // El payload es la segunda parte
    const decoded = atob(payload); // Decodificamos de base64
    return JSON.parse(decoded); // Retornamos el payload como un objeto
  }

  guardarid() {
    const token = sessionStorage.getItem('sesion') ? JSON.parse(sessionStorage.getItem('sesion')).token : null;

    if (token) {
      const decodedToken = this.decodeToken(token);
      this.email_client = decodedToken.email;

      if (this.email_client) {
        this.clienteServices.list().subscribe((data) => {
          const clientes = data['data'];
          const ClienteEncontrado = clientes.find((cliente) => cliente.email === this.email_client);
          
          if (ClienteEncontrado) {
            this.cliente_id = ClienteEncontrado.id;
            console.log('ID del cliente:', this.cliente_id);
          } else {
            sessionStorage.removeItem('sesion');
            console.error('Cliente no encontrado');
          }
        });
      } else {
        console.error('No hay email almacenado en el token');
      }
    } else {
      console.error('No existe una sesión');
    }
  }

  retirarSaldo(): void {
    if (this.monto_retiro && this.monto_retiro > 0 && this.cliente_id) {
      const payload = {
        pid_usuario: this.cliente_id,
        pmonto: this.monto_retiro,
      };
  
      console.log('Iniciando el retiro con payload:', payload);
  
      this.services.retirarSaldo(payload).subscribe(
        (response) => {
          // Si el retiro fue exitoso
          Swal.fire({
            icon: 'success',
            title: '¡Retiro exitoso!',
            text: `Se han retirado ${this.monto_retiro} de tu saldo.`,
            confirmButtonText: 'OK',
          }).then(() => {
            this.monto_retiro = null; // Limpia el input
            this.mensaje = ''; // Limpia el mensaje
          });
  
          console.log('Respuesta del servidor:', response);
        },
        (error) => {
          // Si ocurrió un error durante el retiro
          Swal.fire({
            icon: 'error',
            title: 'Error al retirar',
            text: 'No se pudo completar el retiro. Verifica tu saldo o intenta nuevamente.',
            confirmButtonText: 'OK',
          });
  
          console.error('Error al procesar el retiro:', error);
        }
      );
    } else {
      // Validación del input vacío o inválido
      Swal.fire({
        icon: 'warning',
        title: 'Datos inválidos',
        text: 'Por favor, ingresa un monto válido para retirar.',
        confirmButtonText: 'Entendido',
      });
    }
  }
  volver(){
    this.router.navigate[('/dashboard')]
  }
}
