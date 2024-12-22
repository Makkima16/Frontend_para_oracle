import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';
import { Partido } from '../models/partido.model';

@Injectable({
  providedIn: 'root'
})
export class PartidosService {


  

  constructor(
    private http: HttpClient
  ) { 
  }

  list(): Observable<Partido[]> {
    return this.http.get<Partido[]>(`${environment.url_ms_modulos}partido`);
  }

  getPartidos(): Observable<Partido[]> {
    return this.http.get<Partido[]>(`${environment.url_ms_modulos}topPartidos`);
  }

  view(id: number): Observable<Partido> {
    return this.http.get<Partido>(`${environment.url_ms_modulos}partido/${id}`);
  }

  create(titular: Partido): Observable<Partido> {
    return this.http.post<Partido>(`${environment.url_ms_modulos}partido`, titular);
  }


  update(titular:Partido): Observable<Partido> {
    return this.http.put<Partido>(`${environment.url_ms_modulos}partido/${titular.id}`, titular);
  }


  getEquiposPorPartido(partidoId: number): Observable<any> {
    return this.http.get<any>(`${environment.url_ms_modulos}partidos/${partidoId}/equipos`);
  }



  delete(id: number): Observable<Partido> {
    return this.http.delete<Partido>(`${environment.url_ms_modulos}partido/${id}`);
  }

  actualizarPartidos(): Observable<any> {
    return this.http.post<any>(`${environment.url_ms_modulos}actualizarPartidos`, {});
  }

}
