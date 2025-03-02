import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-img',
  imports: [],
  standalone: true,
  templateUrl: './img.component.html',
  styleUrl: './img.component.scss'
})
export class ImgComponent {
  @Input() src!: string;
  @Input() alt!: string;

}
