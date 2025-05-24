import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-navbar',
  standalone: true,
  // imports: [RouterLink],
  imports: [RouterModule, NgIf],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  isLoggedIn = true;

}