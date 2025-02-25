import { Component, inject } from '@angular/core';
import { Park, ParkService } from '../../servicers/parks.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-post-form',
  imports: [],
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.scss'
})
export class PostFormComponent {
  private parkService = inject(ParkService);
  private route = inject(ActivatedRoute);

  park$!: Observable<Park>;

  ngOnInit() {
    this.park$ = this.route.paramMap.pipe(
      switchMap(params => {
        const parkId = params.get('id');
        return parkId ? this.parkService.fetchById(parkId) : [];
      })
    );
  }
}
