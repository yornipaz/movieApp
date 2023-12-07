import { Routes, RouterModule } from '@angular/router';
import { MovieComponent } from './movie.component';
import { MovieListComponent } from './list/list.component';
import { MovieService } from './movie.service';
import { inject } from '@angular/core';
import { MovieDetailComponent } from './detail/detail.component';
import { movieResolver } from './movie.resolver';

export default [
  {
    path: '',
    component: MovieComponent,

    children: [
      {
        path: '',
        pathMatch: 'full',
        component: MovieListComponent,
        resolve: {
          movies: () => inject(MovieService).getMovies(),
          categories: () => inject(MovieService).getCategories(),
        },
      },
      {
        path: ':id',
        component: MovieDetailComponent,
        resolve: {
          movie: movieResolver,
        },
      },
    ],
  },
] as Routes;


