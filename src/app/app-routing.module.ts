import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // Redirect empty path to 'movie'
  { path: '', pathMatch: 'full', redirectTo: 'movie' },
  {
    path: 'movie',
    loadChildren: () =>
      import('@app/movie/movie.routing')
  },
  { path: '**', redirectTo: 'movie' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
