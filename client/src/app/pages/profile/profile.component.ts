import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../../services/auth-service.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AvatarService } from '../../services/avatar.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AvatarComponent } from '../../components/avatar/avatar.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    AvatarComponent
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  private authService = inject(AuthService);
  username: string | null = this.authService.getUsername();
  avatarSvg: string | null = null;
  avatarUrl: string | null = null;

  onAvatarUpdated(newAvatar: { avatarSvg?: string; avatarUrl?: string }) {
    if (newAvatar.avatarSvg) {
      this.avatarSvg = newAvatar.avatarSvg;
      this.avatarUrl = null;
    }
    if (newAvatar.avatarUrl) {
      this.avatarUrl = newAvatar.avatarUrl;
      this.avatarSvg = null;
    }
  }
}