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

  newImageUrl: string;

  user = null;

  constructor(private yummlyService: YummlyService) { }

  getFeaturedRecipeFromYummly() {

    this.yummlyService.getFeaturedRecipe()
      .subscribe(
      yummlyRecipe => {
        this.yummlyRecipe = yummlyRecipe.matches;
        this.newImageUrl = this.yummlyRecipe[0]['smallImageUrls'][0];
        this.newImageUrl = this.newImageUrl.replace(/(=[^=]*$)/g, '');
      },
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
