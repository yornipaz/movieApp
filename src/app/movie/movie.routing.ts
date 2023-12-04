import { Routes, RouterModule } from '@angular/router';
import { MovieComponent } from './movie.component';
import { MovieListComponent } from './list/list.component';
import { MovieService } from './movie.service';
import { inject } from '@angular/core';
import { MovieDetailComponent } from './detail/detail.component';

const routes: Routes = [
  {
    path: '',
    component: MovieComponent,

    children: [
      {
        path: '',
        pathMatch: 'full',
        component: MovieListComponent,
        resolve: {
          courses: () => inject(MovieService).getMovies(),
        },
      },
      {
        path: ':id',
        component: MovieDetailComponent,
        // resolve: {
        //   course: courseResolver,
        // },
      },
    ],
  },
];

export const MovieRoutes = RouterModule.forChild(routes);
