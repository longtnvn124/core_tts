import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  imports: [
    CommonModule 
  ],
  selector: 'app-table-loader',
  templateUrl: './table-loader.component.html',
  styleUrls: ['./table-loader.component.css'],
  standalone: true
})
export class TableLoaderComponent {
  @Input() tableCol : number;
  @Input() tableRow : number;

  constructor(){}
}
