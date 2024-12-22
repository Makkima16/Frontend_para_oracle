import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TransaccionesService } from '../../../services/transacciones.service';
import { ClientsService } from '../../../services/clients.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
})
export class ManageComponent implements OnInit {
  email_client: string;
  cliente = {
    p_id_usuario: 0, // ID del usuario
    pnuevo: 0, // Monto de la recarga
  };

  recargas = [
    { monto: 50000, descripcion: 'Recarga de 50,000 COP - Recarga bastante modesta para gastar en lo que desees' },
    { monto: 100000, descripcion: 'Recarga de 100,000 COP - Una buena cantidad para tus compras diarias' },
    { monto: 500000, descripcion: 'Recarga de 500,000 COP - Ideal para compras más grandes o necesidades urgentes' },
    { monto: 1000000, descripcion: 'Recarga de 1,000,000 COP - Para una gran cantidad de gasto y emergencias' },
  ];

  // Variable para almacenar la transacción seleccionada
  selectedTransaction: { monto: number; descripcion: string } | null = null;

  constructor(
    private router: Router,
    private transaccionesService: TransaccionesService,
    private services: ClientsService
  ) {}

  ngOnInit(): void {
    // Recuperar el token de sesión
    const token = sessionStorage.getItem('sesion') ? JSON.parse(sessionStorage.getItem('sesion')).token : null;

    if (token) {
      // Si hay un token, decodificarlo para extraer la información del usuario
      const decodedToken = this.decodeToken(token);
      this.cliente.p_id_usuario = decodedToken.email; // Asignar el nombre del usuario desde el token
      this.guardarid();
    }
  }

  // Método para seleccionar la transacción
  onSelectTransaction(transaction: { monto: number; descripcion: string }): void {
    // Asignar la transacción seleccionada
    this.selectedTransaction = transaction;
    this.cliente.pnuevo = transaction.monto; // Asignar el monto al cliente
    this.guardarTransaccion(transaction);
    this.onCargarSaldo()
    // Redirigir a la página de pagos con los datos seleccionados
    this.router.navigate(['/pagar/create'], {
      queryParams: {
        monto: transaction.monto,
        transaccion_id: 65,
        descripcion: transaction.descripcion,

      },
    });

  }

  // Función que guarda los datos de la transacción seleccionada
  guardarTransaccion(transaction: { monto: number; descripcion: string }) {
    // Aquí puedes realizar alguna lógica para guardar los datos en el backend si es necesario
    console.log('Transacción seleccionada:', transaction);
    // Por ejemplo, podrías hacer un POST para registrar la transacción
  }

  // Método para cargar saldo (usando el cliente)
  onCargarSaldo(): void {
    if (this.cliente.pnuevo > 0) {
      this.transaccionesService.cargarSaldo(this.cliente).subscribe({
        next: (response) => {
          console.log('Saldo cargado con éxito:', response);
          console.log(response.id)
          alert('Saldo cargado con éxito.');
        },
        error: (error) => {
          console.error('Error al cargar saldo:', error);
          alert('Hubo un error al cargar el saldo.');
        },
      });
    } else {
      alert('Por favor, selecciona un monto de recarga válido.');
    }
  }

  // Método para obtener la descripción de una recarga según el monto
  obtenerDescripcion(monto: number): string {
    const recargaSeleccionada = this.recargas.find((recarga) => recarga.monto === monto);
    return recargaSeleccionada ? recargaSeleccionada.descripcion : '';
  }

  // Método para decodificar el token JWT
  decodeToken(token: string): any {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Token inválido');
    }

    const payload = parts[1]; // El payload es la segunda parte
    const decoded = atob(payload); // Decodificamos de base64
    return JSON.parse(decoded); // Retornamos el payload como un objeto
  }

  // Método para recuperar el ID del cliente desde el servicio
  guardarid() {
    const token = sessionStorage.getItem('sesion') ? JSON.parse(sessionStorage.getItem('sesion')).token : null;

    if (token) {
      const decodedToken = this.decodeToken(token);
      this.email_client = decodedToken.email;

      if (this.email_client) {
        // Recuperar los datos del cliente usando el email
        this.services.list().subscribe((data) => {
          const cliente = data['data'];
          cliente.password = ''; // Limpiamos el campo de password
          const ClienteEncontrado = cliente.find((cliente) => cliente.email === this.email_client);
          
          if (ClienteEncontrado) {
            this.cliente.p_id_usuario = ClienteEncontrado.id; // Asignamos el ID del cliente
            console.log('ID del cliente:', this.cliente.p_id_usuario);
          } else {
            sessionStorage.removeItem('sesion'); // Si no se encuentra el cliente, se elimina la sesión
          }
        });
      } else {
        console.error('No hay email almacenado en el token');
      }
    } else {
      console.error('No existe una sesión');
    }
  }
}
