import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-park',
  imports: [
    MatCardModule
  ],
  standalone: true,

  templateUrl: './park.component.html',
  styleUrl: './park.component.scss'
})
export class ParkComponent {
  parkId: string | null = null;

  constructor(private route: ActivatedRoute) {
    this.parkId = this.route.snapshot.paramMap.get('id');
  }

}
