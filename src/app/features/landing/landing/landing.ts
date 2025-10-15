import { Component } from '@angular/core';
import { Navbar } from '../../../shared/components/navbar/navbar';

@Component({
  selector: 'app-landing',
  imports: [Navbar],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {}
