import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Movie } from './movie.type';
import { movies } from './data';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private _movies: Movie[] = movies;


  constructor() {
  }


  private setWatchList(watchList: string[]) {
    localStorage.setItem('watchList', JSON.stringify(watchList));


  }
  getWatchList(): string[] {
    return JSON.parse(localStorage.getItem('watchList') as string) || [];
  }


  getMovies(): Observable<Movie[]> {
    const movies: Movie[] = structuredClone(this._movies);
    return of(movies);
  }
  getMovieById(id: string): Observable<Movie> {
    const movies: Movie[] = structuredClone(this._movies);
    const movie = movies.find(m => m.id === id);
    if (movie === undefined) {
      throwError(() => new Error('This movie is not exist for this id '));
    }
    return of(movie as Movie);
  }
  addToWatchList(movieId: string): void {
    let watchList: string[] = this.getWatchList()
    const isMovieInWatchList = watchList.some(id => id === movieId);
    if (!isMovieInWatchList) {
      watchList.push(movieId);
      this.setWatchList(watchList);
    }
  }
  removeFromWatchList(movieId: string): void {
    let watchList: string[] = this.getWatchList()
    const isMovieInWatchList = watchList.some(id => id === movieId);
    if (isMovieInWatchList) {
      watchList = watchList.filter(id => id !== movieId);
      this.setWatchList(watchList);
    }
    return;
  }
  /**
   * Movie id is on my watch list
   * @param movieId
   * @returns boolean
   */
  isMovieInWatchList(movieId: string): boolean {
    return this.getWatchList().some(id => id === movieId);
  }
  getCategories(): Observable<string[]> {
    let categories: string[] = []

    this._movies.forEach(movie => {
      movie.genre.split(',').forEach(category => {
        if (!categories.includes(category)) {
          categories.push(category)
        }

      })
    })


    return of(categories)
  }



}
