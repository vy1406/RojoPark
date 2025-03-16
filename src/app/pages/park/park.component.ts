import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ParkService, Park } from '../../services/parks.service';
import { BehaviorSubject, switchMap } from 'rxjs';
import { Post, PostService } from '../../services/posts.service';
import { PostComponent } from '../../components/post-item/post.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-park',
  imports: [
    MatCardModule,
    CommonModule,
    MatButtonModule,
    PostComponent
  ],
  standalone: true,
  templateUrl: './park.component.html',
  styleUrl: './park.component.scss'
})
export class ParkComponent implements OnInit {
  private parkService = inject(ParkService);
  private postService = inject(PostService);

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  parkId: string | null = null;
  park: Park | null = null;
  loading$ = new BehaviorSubject<boolean>(false);

  parkPosts = this.postService.parkPosts;
  loading = this.postService.loading;

  selectedPark$ = this.parkService.selectedPark$;

  constructor() {
    this.selectedPark$.subscribe(park => {
      this.park = park;
    });
  }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap(params => {
        const parkId = params.get('id');
        if (parkId) {
          this.parkId = parkId;
          this.postService.fetchByParkId(parkId);
          return this.parkService.fetchById(parkId)
        }
        return [];
      })
    ).subscribe();
  }

  trackByPostId(index: number, post: Post) {
    return post.id;
  }

  newPost() {
    if (this.parkId) {
      this.router.navigate([`/parks/${this.parkId}/form`]);
    }
  }

  backToParks() {
    this.parkService.setSelectedPark(null);
    this.router.navigate(['/']);
  }

}
