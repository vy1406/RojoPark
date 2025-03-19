import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, inject, Inject, Input, Output, PLATFORM_ID } from '@angular/core';
import { AvatarService } from '../../services/avatar.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent {
  private avatarService = inject(AvatarService);
  private sanitizer = inject(DomSanitizer);
  private platformId: Object = inject(PLATFORM_ID);

  @Input() avatarSvg: string | null = null;
  @Input() avatarUrl: string | null = null;
  @Input() allowFileUpload: boolean = true;

  @Output() avatarUpdated = new EventEmitter<{ avatarSvg?: string; avatarUrl?: string }>();

  ngOnInit() {

    if (!this.avatarUrl && !this.avatarSvg) {
      this.generateAvatar();
    }
  }

  generateAvatar() {
    if (isPlatformBrowser(this.platformId)) {
      this.avatarService.generateRandomAvatar().subscribe(svg => {
        const utf8EncodedSvg = new TextEncoder().encode(svg);
        const base64Svg = btoa(String.fromCharCode(...utf8EncodedSvg));
        this.avatarSvg = `data:image/svg+xml;base64,${base64Svg}`;
        this.avatarUpdated.emit({ avatarSvg: this.avatarSvg });
      });
    }
  }

  onFileSelected(event: any) {
    if (!this.allowFileUpload) return;

    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarUrl = reader.result as string;
        this.avatarUpdated.emit({ avatarUrl: this.avatarUrl });
      };
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput(fileInput: HTMLInputElement) {
    if (this.allowFileUpload) {
      fileInput.click();
    }
  }
}
