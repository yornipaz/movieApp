import { Router, type ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Movie } from './movie.type';
import { MovieService } from './movie.service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

export const movieResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const movieService = inject(MovieService);
  const router = inject(Router);

  return movieService.getMovieById(route.paramMap.get('id') || '').pipe(
    // Error here means the requested course is not available
    catchError((error) => {
      // Log the error
      console.error(error);



      // Navigate to there
      router.navigate(['/movie']);;

      // Throw an error
      return throwError(() => error);
    }),
  );
};
