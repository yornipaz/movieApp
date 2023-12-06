import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],

  standalone: true,
  imports: [],
})
export class CardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
