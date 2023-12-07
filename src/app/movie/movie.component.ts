import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CdkScrollable } from '@angular/cdk/scrolling';

@Component({
  selector: 'movie',
  templateUrl: './movie.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterOutlet, CdkScrollable],
})
export class MovieComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
