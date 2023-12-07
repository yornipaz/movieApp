import { DOCUMENT, NgClass, NgIf, NgStyle } from '@angular/common';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MovieService } from '../movie.service';
import { Subject, takeUntil } from 'rxjs';
import { Movie } from '../movie.type';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'movie-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  standalone: true,
  host: {
    '(window:resize)': 'onResize($event)'
  },
  imports: [NgStyle, NgIf, NgClass, RouterLink, YouTubePlayerModule, FormsModule]
})
export class MovieDetailComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  movie!: Movie;
  withVideo: number = 320;
  videoId: string | null = null;
  toggedMovie: boolean = false;
  constructor(private _movieService: MovieService, private _route: ActivatedRoute, @Inject(DOCUMENT) private document: Document, breakpointObserver: BreakpointObserver) {
    breakpointObserver.observe(
      [
        Breakpoints.Web,
        Breakpoints.Large,
        Breakpoints.Tablet,

      ]
    ).subscribe((state: BreakpointState) => {
      if (state.matches) {
        if (state.breakpoints[Breakpoints.Web] || state.breakpoints[Breakpoints.Large]) {
          this.withVideo = 640;

        } else {
          this.withVideo = 420;
        }

      }
    })

  }

  ngOnInit() {
    this._route.data.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {
      this.movie = data['movie'];
      this.videoId = new URL(this.movie.trailerLink).searchParams.get("v") || "";
      this.toggedMovie = this._movieService.isMovieInWatchList(this.movie.id)



    })


    const tag = this.document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    this.document.body.appendChild(tag);

  }



  onResize(event: any) {
    this.detectedDevice(event.target.innerWidth);

  }
  detectedDevice(width: number) {
    if (width < 768) {
      this.withVideo = 320;
    } else if (width >= 768 && width < 1024) {
      this.withVideo = 420;
    } else {
      this.withVideo = 640;

    }
  }
  /**
  * Show/hide on my watch  list movies
  *
  * @param change
  */
  toggleOnMyWatchList(event: any): void {
    if (event.target.checked) {
      this._movieService.addToWatchList(this.movie.id)

    } else {
      this._movieService.removeFromWatchList(this.movie.id);

    }
  }
  /**
    * On destroy
    */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }


}
