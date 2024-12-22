import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';
import { Transacciones } from '../models/transacciones.model';

@Injectable({
  providedIn: 'root'
})
export class TransaccionesService {


  

  constructor(
    private http: HttpClient
  ) { 
  }

  list(): Observable<Transacciones[]> {
    return this.http.get<Transacciones[]>(`${environment.url_ms_modulos}transaccion`);
  }

  view(id: number): Observable<Transacciones> {
    return this.http.get<Transacciones>(`${environment.url_ms_modulos}transaccion/${id}`);
  }

  create(titular: Transacciones): Observable<Transacciones> {
    return this.http.post<Transacciones>(`${environment.url_ms_modulos}transaccion`, titular);
  }


  update(titular:Transacciones): Observable<Transacciones> {
    return this.http.put<Transacciones>(`${environment.url_ms_modulos}transaccion/${titular.id}`, titular);
  }
  // Método para cargar saldo
  cargarSaldo(payload: { p_id_usuario: number; pnuevo: number }): Observable<any> {
    return this.http.post(`${environment.url_ms_modulos}cargar-saldo`, payload);
  }

  retirarSaldo(payload: { pid_usuario: number; pmonto: number }): Observable<any> {
    return this.http.post(`${environment.url_ms_modulos}retirar-saldo`, payload);
  }



  delete(id: number): Observable<Transacciones> {
    return this.http.delete<Transacciones>(`${environment.url_ms_modulos}transaccion/${id}`);
  }

}
