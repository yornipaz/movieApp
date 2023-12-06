

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
  imports: [CdkScrollable, NgStyle, MatSelectModule, MatOptionModule, NgFor, MatIconModule, MatInputModule, MatSlideToggleModule, NgIf, NgClass, MatTooltipModule, MatProgressBarModule, MatButtonModule, RouterLink, PercentPipe, I18nPluralPipe],
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];
  watchList: string[];
  filteredMovies: Movie[] = [];
  filters: {
    categorySlug$: BehaviorSubject<string>;
    query$: BehaviorSubject<string>;
    hideCompleted$: BehaviorSubject<boolean>;
  } = {
      categorySlug$: new BehaviorSubject('all'),
      query$: new BehaviorSubject(''),
      hideCompleted$: new BehaviorSubject(false),
    };

  private _unsubscribeAll: Subject<any> = new Subject<any>();


  constructor(private _movieService: MovieService, private _changeDetectorRef: ChangeDetectorRef,) {
    this.watchList = this._movieService.getWatchList();
  }

  ngOnInit() {
    this._movieService.getMovies().pipe(
      takeUntil(this._unsubscribeAll)
    ).subscribe(movies => {
      this.filteredMovies = movies;
      this.movies = movies;
      this._changeDetectorRef.markForCheck();

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

  // /**
  //  * Filter by category
  //  *
  //  * @param change
  //  */
  // filterByCategory(change: MatSelectChange): void {
  //   this.filters.categorySlug$.next(change.value);
  // }

  // /**
  //  * Show/hide completed courses
  //  *
  //  * @param change
  //  */
  // toggleCompleted(change: MatSlideToggleChange): void {
  //   this.filters.hideCompleted$.next(change.checked);
  // }

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
