import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';
import { Apuestas } from '../models/apuestas.model';

@Injectable({
  providedIn: 'root'
})
export class ApuestasService {


  

  constructor(
    private http: HttpClient
  ) { 
  }

  list(): Observable<Apuestas[]> {
    return this.http.get<Apuestas[]>(`${environment.url_ms_modulos}apuesta`);
  }

  view(id: number): Observable<Apuestas> {
    return this.http.get<Apuestas>(`${environment.url_ms_modulos}apuesta/${id}`);
  }

  create(titular: Apuestas): Observable<Apuestas> {
    return this.http.post<Apuestas>(`${environment.url_ms_modulos}apuesta`, titular);
  }


  update(titular:Apuestas): Observable<Apuestas> {
    return this.http.put<Apuestas>(`${environment.url_ms_modulos}apuesta/${titular.id}`, titular);
  }





  delete(id: number): Observable<Apuestas> {
    return this.http.delete<Apuestas>(`${environment.url_ms_modulos}Apuesta/${id}`);
  }





  
  // Función para registrar una apuesta
  registrarApuesta(
    p_id_cliente: number,
    p_id_partido: number,
    p_tipo_apuesta: string,
    p_resultado: string,  // Aquí es donde se guarda el equipo ganador
    p_goles_equipo1: number,  // Goles del equipo 1 (si es necesario)
    p_goles_equipo2: number,  // Goles del equipo 2 (si es necesario)
    p_monto: number,
    p_cuota: number
  ): Observable<any> {
    return this.http.post(`${environment.url_ms_modulos}registrar-apuesta`, {
      p_id_cliente,
      p_id_partido,
      p_tipo_apuesta,
      p_resultado,
      p_goles_equipo1,
      p_goles_equipo2,
      p_monto,
      p_cuota
    });
  }
  
  
}
