import { Component, OnInit } from '@angular/core';
import { YummlyService } from '../yummly.service';
import { fadeInAnimation } from '../animations/fade-in.animation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': '' }
})
export class HomeComponent implements OnInit {

  yummlyRecipe: any;

  successMessage: string;
  errorMessage: string;

  user = null;

  constructor(private yummlyService: YummlyService) { }

  getFeaturedRecipeFromYummly() {

    this.yummlyService.getFeaturedRecipe()
        .subscribe(
          yummlyRecipe => this.yummlyRecipe = yummlyRecipe.matches,
      error => this.errorMessage = <any>error
    );
  }

  checkForUser() {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit() {
    this.checkForUser();
    this.getFeaturedRecipeFromYummly();
  }
}
