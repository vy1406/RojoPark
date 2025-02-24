import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
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
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  parks = [
    { id: 1, name: 'Banff National Park' },
    { id: 2, name: 'Jasper National Park' },
    { id: 3, name: 'Yoho National Park' },
    { id: 4, name: 'Waterton Lakes National Park' }
  ]

  selectedParkId: number | null = null;

  constructor(private route: Router) { }

  onNavigateToPark() {
    if (this.selectedParkId) {
      console.log(`Navigating to park with id: ${this.selectedParkId}`);
      this.route.navigate([`/parks/${this.selectedParkId}`]);
    }
  }
}
