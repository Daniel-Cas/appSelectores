import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pais, paisSmall } from '../interfaces/paises.interface';
import { combineLatest, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaisesServiceService {

  private _url     : string = 'https://restcountries.eu/rest/v2'
  private _regiones: string[] =['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regiones(): string[] {
    return [...this._regiones];
  }

  constructor( private http: HttpClient) { }

  getPaisesPorRegion( region: string): Observable<paisSmall[]>{
    const url : string = `${ this._url }/region/${ region }?fields=alpha3Code;name`
    return this.http.get<paisSmall[]>(url);
  }

  getPaisPorCodigo( codigo: string ): Observable<Pais | null>{

    if(!codigo ){
      return of( null );
    }

    const url : string = `${ this._url }/alpha/${ codigo }`
    return this.http.get<Pais>(url);

  }


  getPaisPorCodigoSmall( codigo: string ): Observable<paisSmall>{


    const url : string = `${ this._url }/alpha/${ codigo }?fields=name;alpha3Code`
    return this.http.get<paisSmall>(url);

  }

  getPaisesPorCodigos( borders: string[]): Observable<paisSmall[]>{
  
    if(!borders ){
      return of([]);
    }
    const peticiones: Observable<paisSmall>[] = [];

    borders.forEach( codigo => {
      const peticion = this.getPaisPorCodigoSmall(codigo);
      peticiones.push( peticion );
    } );

    return combineLatest( peticiones );

  }




}
