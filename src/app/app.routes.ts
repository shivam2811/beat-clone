import { Routes } from '@angular/router';
import { LandingComponent } from './auth/landing/landing.component';
import { PlaylistComponent } from './pages/playlist/playlist.component';
import { ArtistComponent } from './pages/artist/artist.component';
import { ContactComponent } from './shared/contact/contact.component';

export const routes: Routes = [
    { path: '', component: LandingComponent , pathMatch: 'full' },
    { path: 'playlist', component: PlaylistComponent },
    { path: 'artist/:id', component: ArtistComponent },
    { path: 'contact', component: ContactComponent },
];
