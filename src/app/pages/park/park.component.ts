import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ParkService, Park } from '../../servicers/parks.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-park',
  imports: [
    MatCardModule,
    CommonModule
  ],
  standalone: true,
  templateUrl: './park.component.html',
  styleUrl: './park.component.scss'
})
export class ParkComponent implements OnInit {
  private parkService = inject(ParkService);
  private route = inject(ActivatedRoute);

  parkId: string | null = null;
  park: Park | null = null;
  loading$ = new BehaviorSubject<boolean>(false);

  ngOnInit() {
    this.parkId = this.route.snapshot.paramMap.get('id');

    if (this.parkId) {
      this.loading$.next(true);
      this.parkService.fetchById(this.parkId).subscribe({
        next: (park) => {
          this.park = park;
          this.loading$.next(false);
        },
        error: () => this.loading$.next(false)
      });
    }
  }
}
