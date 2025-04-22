import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from "../../shared/header/header.component";
import { FooterComponent } from "../../shared/footer/footer.component";

@Component({
  selector: 'app-artist',
  imports: [CommonModule, HttpClientModule, HeaderComponent, FooterComponent],
  templateUrl: './artist.component.html',
  styleUrl: './artist.component.scss'
})
export class ArtistComponent {
  artist: any = null;
  beat: any = null;
  updatedAt: Date = new Date();
  @ViewChild('audioRef') audioElement!: ElementRef<HTMLAudioElement>;
  isPlaying: boolean = false;
  preloder: boolean = false;


  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const beatId = this.route.snapshot.paramMap.get('id');
    if (beatId) {
      this.fetchBeatData(beatId);
    }
  }

  fetchBeatData(beatId: string): void {
    this.preloder = true; // Show the preloader before fetching data
    const apiUrl = `/api/v2/playlist/trending`;

    this.http.get<any>(apiUrl).subscribe({
      next: (res) => {
        const playlist = res.playlists?.[0];
        const beats = playlist?.beats || [];

        const foundBeat = beats.find((b: any) => b._id === beatId);

        if (foundBeat) {
          this.beat = foundBeat;
          this.artist = playlist.authorName;
          this.updatedAt = new Date(playlist.updatedAt || Date.now());

          // Autoplay after small delay (audio load)
          setTimeout(() => {
            this.audioElement?.nativeElement?.play().catch(err => {
              console.warn('Autoplay prevented by browser:', err);
            });
          }, 300);
        }
        this.preloder = false; // Hide the preloader after fetching data
      },
      error: (err) => {
        console.error('Error fetching beats:', err);
        this.preloder = false; // Hide the preloader even on error
      },
    });
  }


  togglePlayPause(audio: HTMLAudioElement): void {
    if (this.isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }

    this.isPlaying = !this.isPlaying;

    // optional: handle when audio ends
    audio.onended = () => {
      this.isPlaying = false;
    };
  }

}
