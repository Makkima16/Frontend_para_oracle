import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { PartidosService } from '../../services/partidos.service';  // Importar el servicio
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isMenuOpen: boolean = false;
  isUserMenuOpen: boolean = false;
  isAdminMenuOpen: boolean = false;
  isCreateMenuOpen: boolean = false;
  isListMenuOpen: boolean = false;
  isOptionsMenuOpen: boolean = false; // Nueva variable para el menú de opciones
  userName: string | null = null;
  userRole: string | null = null;
  isAdminMode: boolean = false;

  constructor(
    private router: Router,
    private partidosService: PartidosService // Inyectar el servicio
  ) {}

  ngOnInit(): void {
    const token = sessionStorage.getItem('sesion') ? JSON.parse(sessionStorage.getItem('sesion')).token : null;

    if (token) {
      const decodedToken = this.decodeToken(token);
      this.userName = decodedToken.name;
      this.userRole = decodedToken && decodedToken.role && decodedToken.role.name; // Obtener el nombre del rol del usuario
      this.isAdminMode = this.userRole === 'Administrador'; // Activa el modo admin si el rol es "Administrador"
    }
  }

  decodeToken(token: string): any {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Token inválido');
    }

    const payload = parts[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  toggleAdminMenu() {
    this.isAdminMenuOpen = !this.isAdminMenuOpen;
  }

  toggleCreateMenu() {
    this.isCreateMenuOpen = !this.isCreateMenuOpen;
  }

  toggleListMenu() {
    this.isListMenuOpen = !this.isListMenuOpen;
  }
  
  toggleOptionsMenu() {
    this.isOptionsMenuOpen = !this.isOptionsMenuOpen;
  }
  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    sessionStorage.clear();
    this.userName = null;
    this.userRole = null;
    this.isAdminMode = false;
    this.router.navigate(['dashboard']);
  }

  goToLogin() {
    this.router.navigate(['login']);
  }

  gotorecargarSaldo() {
    this.router.navigate(['transacciones/create']);
  }

  // Nuevo método para actualizar partidos desde el header
  actualizarPartidos() {
    this.partidosService.actualizarPartidos().subscribe({
      next: (response) => {
        Swal.fire('Éxito', 'Partidos y apuestas actualizados con éxito', 'success');
      },
      error: (error) => {
        console.error('Error al actualizar los partidos:', error);
        Swal.fire('Error', 'Hubo un problema al actualizar los partidos', 'error');
      }
    });
  }
}
