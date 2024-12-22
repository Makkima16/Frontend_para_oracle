import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { User } from '../../models/user.model';
import { SecurityService } from '../../services/security.service';
import { ClientsService } from '../../services/clients.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  theUser: User;
  mode: number; // 0: normal user, 1: admin user
  token: string;
  isLoading: boolean = false; // Estado de carga agregado

  constructor(
    private service: SecurityService,
    private router: Router,
    private cliente: ClientsService,
    private admin:AdminService
  ) {
    this.mode = 0; // Por defecto, modo usuario normal
    this.theUser = {
      email: '',
      password: '',
      name: '',
      token: '',// Inicializa el token vacío
      tel: 0 ,
    };
  }

  ngOnInit() {}

  ngOnDestroy() {}

  changeMode(mode: number) {
    this.mode = +mode; // Asegúrate de convertir a número
    console.log('Mode changed to:', this.mode);
    if (this.mode === 0) {
      this.theUser.token = ''; // Limpia el token si es usuario normal
    }
    if (this.mode === 2) {
      this.theUser.token = ''; // Limpia el token si es usuario normal
    }
  }

  onSubmit() {
    this.isLoading = true;
    if (this.mode === 0) {
      // Crear usuario normal
      this.service.create(this.theUser).subscribe({
        next: (response) => {
          try {
            if (response && response._id) {
              // Crear el cliente asociado al usuario
              const newClient = {
                p_name: this.theUser.name,
                p_email: this.theUser.email,
                p_saldo: 0, // Saldo inicial
                p_tel: this.theUser.tel,
                p_user_id: response._id,
                p_estado: 'activo',
              };
  
              this.cliente.createUsingProcedure(newClient).subscribe({
                next: () => {
                  this.isLoading = false;
                  Swal.fire('Éxito', 'Usuario y cliente creados con éxito', 'success');
                  this.router.navigate(['/dashboard']);
                },
                error: (error) => {
                  this.isLoading = false;
                  console.error('Error al crear el cliente:', error);
                  Swal.fire('Error', 'Hubo un problema al crear el cliente', 'error');
                },
              });
            } else {
              Swal.fire('Error', 'Hubo un problema durante el registro', 'error');
            }
          } catch (err) {
            this.isLoading = false;
            console.error('Error:', err);
            Swal.fire('Error', err.message, 'error');
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error al crear el usuario:', error);
          Swal.fire('Error', 'El correo ya está asociado o hubo un problema al registrar el usuario', 'error');
        },
      });
    }else if (this.mode === 1) {
        // Crear administrador
        this.service.admin(this.theUser).subscribe({
          next: (response) => {
            this.isLoading = false;
            try {
              if (response && response._id) {
                // Crear el administrador asociado al usuario
                const newAdmin = {
                  email: this.theUser.email,
                  name: this.theUser.name,
                  user_id: response._id,
                  estado: "activo",
                  cuenta: 0,
                  saldo:0,
                  tel: this.theUser.tel
                };
                const newAlientAdmin={
                p_name: this.theUser.name,
                p_email: this.theUser.email,
                p_saldo: 0, // Saldo inicial
                p_tel: this.theUser.tel,
                p_user_id: response._id,
                p_estado: 'activo',
                }
                this.cliente.createUsingProcedure(newAlientAdmin).subscribe()
                this.admin.create(newAdmin).subscribe({
                  next: () => {
                    Swal.fire('Éxito', 'Administrador creado con éxito', 'success');
                    this.router.navigate(['/dashboard']);
                  },
                  error: (error) => {
                    this.isLoading = false;
  
                    console.error('Error al crear el administrador:', error);
                    Swal.fire('Error', 'Hubo un problema al crear el administrador', 'error');
                  }
                });
              } else {
                Swal.fire('Token Invalido', 'Hubo un error en el Registro del token', 'error');
              }
            } catch (err) {
              this.isLoading = false;
              console.error('Error en la lógica del administrador:', err);
              Swal.fire('Error', err.message, 'error');
            }
          },
          error: (error) => {
            this.isLoading = false;
            console.error('Error al crear el administrador:', error);
            Swal.fire('Error', 'El token es inválido o hubo un problema al registrar el administrador', 'error');
          }
        });
      }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
  
}
