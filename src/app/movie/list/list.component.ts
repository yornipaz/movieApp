

import { Movie } from '../movie.type';

import { MovieService } from '../movie.service';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { I18nPluralPipe, NgClass, NgFor, NgIf, NgStyle, PercentPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { BehaviorSubject, combineLatest, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'movie-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CdkScrollable, NgStyle, MatSelectModule, MatOptionModule, NgFor, MatIconModule, MatInputModule, MatSlideToggleModule, NgIf, NgClass, MatTooltipModule, MatButtonModule, RouterLink],
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];
  watchList: string[];
  categories: string[] = [];
  filteredMovies: Movie[] = [];
  filters: {
    categorySlug$: BehaviorSubject<string>;
    query$: BehaviorSubject<string>;
    hideWatchList$: BehaviorSubject<boolean>;
  } = {
      categorySlug$: new BehaviorSubject('all'),
      query$: new BehaviorSubject(''),
      hideWatchList$: new BehaviorSubject(false),
    };

  private _unsubscribeAll: Subject<any> = new Subject<any>();


  constructor(private _movieService: MovieService, private _route: ActivatedRoute, private _changeDetectorRef: ChangeDetectorRef,) {
    this.watchList = this._movieService.getWatchList();
  }

  ngOnInit() {
    // get data of movies and categories  for the movie list from the resolver.


    this._route.data.pipe(
      takeUntil(this._unsubscribeAll)
    ).subscribe(data => {
      this.filteredMovies = this.movies = data['movies'];
      this.categories = data['categories'];
      this._changeDetectorRef.markForCheck();

    });
    // Filter the movies
    combineLatest([this.filters.categorySlug$, this.filters.query$, this.filters.hideWatchList$])
      .subscribe(([categorySlug, query, hideWatchList]) => {
        // Reset the filtered movies
        this.filteredMovies = this.movies;

        // Filter by category
        if (categorySlug !== 'all') {
          this.filteredMovies = this.filteredMovies.filter(movie => movie.genre.split(',').includes(categorySlug));
        }

        // Filter by search query
        if (query !== '') {
          this.filteredMovies = this.filteredMovies.filter(movie => movie.title.toLowerCase().includes(query.toLowerCase())
            || movie.releasedDate.toLowerCase().includes(query.toLowerCase()));
        }
        // Filter by  watch list
        if (hideWatchList) {
          this.filteredMovies = this.filteredMovies.filter(movie => this.isMovieInWatchList(movie.id));
        }

      });

  }
  addMovieToWatchList(movieId: string) {
    this._movieService.addToWatchList(movieId);
    this._changeDetectorRef.markForCheck();
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Filter by search query
   *
   * @param query
   */
  filterByQuery(query: string): void {
    this.filters.query$.next(query);
  }

  /**
   * Filter by category
   *
   * @param change
   */
  filterByCategory(change: MatSelectChange): void {
    this.filters.categorySlug$.next(change.value);
  }

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
  /**
    * Show/hide on my watch  list movies
    *
    * @param change
    */
  toggleOnMyWatchList(event: any): void {
    this.filters.hideWatchList$.next(event.target.checked);
  }

  /**
   * Movie id is on my watch list
   * @param movieId
   * @returns boolean
   */
  isMovieInWatchList(movieId: string): boolean {
    return this.watchList.includes(movieId);

  }
}
