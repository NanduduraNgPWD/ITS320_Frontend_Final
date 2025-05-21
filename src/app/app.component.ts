import { Component } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, HeroSectionComponent, FooterComponent],
  templateUrl: './app.component.html',
})
export class AppComponent { }