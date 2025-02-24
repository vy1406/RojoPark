import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Park, ParkService } from '../../servicers/parks.service';

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
  parks$ = this.parkService.parks$;
  isLoading$ = this.parkService.loading$;
  selectedParkId = signal<number | null>(null);

  users = signal<Park[]>([]);
  search = signal('');
  loading = this.parkService.loading$;

  filteredUsers = computed(() =>
    this.users().filter(user =>
      user.name.toLowerCase().includes(this.search().toLowerCase())
    )
  );

  constructor(private userService: ParkService) { }

  ngOnInit() {
    this.userService.parks$.subscribe(users => this.users.set(users));
    this.userService.fetchUsers();
  }
}
