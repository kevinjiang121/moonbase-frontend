import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.scss']
})
export class CreateGameComponent {
  title = '';
  version = '';
  description = '';
  scaling = '';
  winCondition = '';
  lossCondition = '';

  mechanics: { name: string; automated: boolean }[] = [];
  optionalRules: string[] = [];
  houseRules: string[] = [];
  enemies: string[] = [];

  constructor(private router: Router) {}

  addMechanic(): void {
    this.mechanics.push({ name: '', automated: false });
  }

  removeMechanic(index: number): void {
    this.mechanics.splice(index, 1);
  }

  addEnemy(): void {
    this.enemies.push('');
  }

  removeEnemy(index: number): void {
    this.enemies.splice(index, 1);
  }

  addOptionalRule(): void {
    this.optionalRules.push('');
  }

  removeOptionalRule(index: number): void {
    this.optionalRules.splice(index, 1);
  }

  addHouseRule(): void {
    this.houseRules.push('');
  }

  removeHouseRule(index: number): void {
    this.houseRules.splice(index, 1);
  }

  onSubmit(): void {
    const automatedMechanics: Record<string, boolean> = {};
    const mechanicsObject: Record<string, boolean> = {};

    this.mechanics.forEach(m => {
      mechanicsObject[m.name] = true;
      automatedMechanics[m.name] = m.automated;
    });

    const payload = {
      game: {
        title: this.title,
        version: this.version,
        rules: {
          description: this.description,
          mechanics: mechanicsObject,
          scaling: this.scaling,
          scoring: {
            winCondition: this.winCondition,
            lossCondition: this.lossCondition
          }
        },
        automatedMechanics: automatedMechanics,
        ruleCustomization: {
          optionalRules: this.optionalRules,
          houseRules: this.houseRules
        },
        enemyLibrary: this.enemies
      }
    };

    console.log('Create Game Payload:', payload);
    this.router.navigate(['/create-layout']);
  }
}
