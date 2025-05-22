import { Component } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule, Router } from '@angular/router';
import { NgIf } from '@angular/common'; // ✅ Import NgIf

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, RouterModule, NgIf],
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(public router: Router) { }
}