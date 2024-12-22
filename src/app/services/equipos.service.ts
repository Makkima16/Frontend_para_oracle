import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';
import { Equipo } from '../models/equipo.model';

@Injectable({
  providedIn: 'root'
})
export class EquiposService {


  

  constructor(
    private http: HttpClient
  ) { 
  }

  list(): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(`${environment.url_ms_modulos}equipo`);
  }
  
  getEquipos(): Observable<{ data: Equipo[] }> {
    return this.http.get<{ data: Equipo[] }>(`${environment.url_ms_modulos}equipo`);
  }
  view(id: number): Observable<Equipo> {
    return this.http.get<Equipo>(`${environment.url_ms_modulos}equipo/${id}`);
  }

  create(titular: Equipo): Observable<Equipo> {
    return this.http.post<Equipo>(`${environment.url_ms_modulos}equipo`, titular);
  }


  update(titular:Equipo): Observable<Equipo> {
    return this.http.put<Equipo>(`${environment.url_ms_modulos}equipo/${titular.id}`, titular);
  }





  delete(id: number): Observable<Equipo> {
    return this.http.delete<Equipo>(`${environment.url_ms_modulos}equipo/${id}`);
  }

}
