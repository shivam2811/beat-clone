import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from "../../shared/header/header.component";
import { FooterComponent } from "../../shared/footer/footer.component";

@Component({
  selector: 'app-playlist',
  imports: [CommonModule, HttpClientModule, FormsModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.scss'
})
export class PlaylistComponent {
  categories: string[] = [];
  genres: string[] = [];
  moods: string[] = [];

  activeCategory: string = 'all';
  activeGenre: string = 'all';
  activeMood: string = 'all';

  playlists: any[] = [];
  filteredPlaylists: any[] = [];
  activeFilter: string | undefined;
  preloder: boolean = false;


  constructor(private http: HttpClient , private router: Router) {}

  ngOnInit() {
    this.fetchPlaylists();
  }

  fetchPlaylists() {
    this.preloder = true; // Show loader before API call

    this.http.get<any>('/api/v2/playlist/trending')
      .subscribe({
        next: (response) => {
          this.playlists = response.playlists;
          this.extractFilters(this.playlists);
          this.applyFilters();
          this.preloder = false; // ✅ Hide loader after data is loaded
        },
        error: (error) => {
          console.error('Failed to fetch playlists:', error);
          this.preloder = false; // ✅ Also hide loader on error
        }
      });
  }

  extractFilters(playlists: any[]) {
    const categoriesSet = new Set<string>();
    const genresSet = new Set<string>();
    const moodsSet = new Set<string>();

    playlists.forEach(playlist => {
      playlist.beats.forEach((beat: any) => {
        if (beat.category) categoriesSet.add(beat.category);
        if (beat.genre) genresSet.add(beat.genre);
        if (Array.isArray(beat.mood)) beat.mood.forEach((m: string) => moodsSet.add(m));
      });
    });

    this.categories = Array.from(categoriesSet);
    this.genres = Array.from(genresSet);
    this.moods = Array.from(moodsSet);
  }


  setFilter(filter: string) {
    this.preloder = true; // Show the preloader before applying filter
    this.activeFilter = filter;

    if (filter === 'all') {
      this.filteredPlaylists = this.playlists;
      this.preloder = false; // Hide the preloader after applying filter
    } else {
      this.filteredPlaylists = this.playlists.filter((playlist) =>
        playlist.beats.some((beat: any) =>
          beat.category === filter ||
          beat.genre === filter ||
          (beat.mood && beat.mood.includes(filter))
        )
      );
      this.preloder = false; // Hide the preloader after applying filter
    }

  }

  setCategoryFilter(filter: string) {
    this.activeCategory = filter;
    this.applyFilters();
  }

  setGenreFilter(filter: string) {
    this.activeGenre = filter;
    this.applyFilters();
  }

  setMoodFilter(filter: string) {
    this.activeMood = filter;
    this.applyFilters();
  }

  applyFilters() {
    this.filteredPlaylists = this.playlists.filter(playlist =>
      playlist.beats.some((beat: any) =>
        (this.activeCategory === 'all' || beat.category === this.activeCategory) &&
        (this.activeGenre === 'all' || beat.genre === this.activeGenre) &&
        (this.activeMood === 'all' || (beat.mood && beat.mood.includes(this.activeMood)))
      )
    );
}

  goToArtistPage(id: number): void {
    this.router.navigate(['/artist', id]);
  }
}