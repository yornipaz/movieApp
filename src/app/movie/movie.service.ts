import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor() { }


  getMovies(): Observable<any> {
    return new Observable();
  }
  getMovieById(id: string): Observable<any> {
    return new Observable();

  }

}
