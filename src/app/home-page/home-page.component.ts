import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CreateCharacterComponent } from '../create-character/create-character.component';
import { Observable } from 'rxjs';

type HomePagePhase = 'core' | 'create-options' | 'create-character';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, CreateCharacterComponent],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  phase: HomePagePhase = 'core';
  loggedIn$!: Observable<boolean>;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.loggedIn$ = this.authService.loggedIn$;
  }

  showCreateOptions(): void {
    this.phase = 'create-options';
  }

  showCreateCharacter(): void {
    this.phase = 'create-character';
  }

  cancelCreate(): void {
    this.phase = 'core';
  }

  createGame(): void {
    this.router.navigate(['/create-game']);
  }
}
