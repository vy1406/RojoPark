import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Park, ParkService } from '../../servicers/parks.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private parkService = inject(ParkService);
  private router = inject(Router);
  parks = signal<Park[]>([]);
  search = signal('');
  selectedParkId = signal<number | null>(null);

  loading = this.parkService.loading$;

  constructor() {
    effect(() => {
      this.parkService.parks$.subscribe(parks => this.parks.set(parks));
    });
  }

  fetchParks = computed(() =>
    this.parks().filter(user =>
      user.name.toLowerCase().includes(this.search().toLowerCase())
    )
  );

  ngOnInit() {
    this.parkService.fetchParks();
  }


  trackById(index: number, park: Park) {
    return park.id;
  }

  navigateToPark() {
    this.router.navigate(['/parks', this.selectedParkId()]);
  }
}
