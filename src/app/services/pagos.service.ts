import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';
import { Pagos } from '../models/pagos.model';


@Injectable({
  providedIn: 'root'
})
export class PagosService {


  

  constructor(
    private http: HttpClient
  ) { 
  }

  list(): Observable<Pagos[]> {
    return this.http.get<Pagos[]>(`${environment.url_ms_modulos}pago`);
  }

  getPartidos(): Observable<Pagos[]> {
    return this.http.get<Pagos[]>(`${environment.url_ms_modulos}pago`);
  }

  view(id: number): Observable<Pagos> {
    return this.http.get<Pagos>(`${environment.url_ms_modulos}pago/${id}`);
  }

  create(titular: Pagos): Observable<Pagos> {
    return this.http.post<Pagos>(`${environment.url_ms_modulos}pago`, titular);
  }


  update(titular:Pagos): Observable<Pagos> {
    return this.http.put<Pagos>(`${environment.url_ms_modulos}pago/${titular.id}`, titular);
  }






  delete(id: number): Observable<Pagos> {
    return this.http.delete<Pagos>(`${environment.url_ms_modulos}pago/${id}`);
  }

}
