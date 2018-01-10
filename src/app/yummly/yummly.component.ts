import { Component, OnInit} from '@angular/core';
import { YummlyService } from '../yummly.service';
import { fadeInAnimation } from '../animations/fade-in.animation';

@Component({
  selector: 'app-yummly',
  templateUrl: './yummly.component.html',
  styleUrls: ['./yummly.component.css']
})
export class YummlyComponent implements OnInit {

  yummlyRecipes: any[];

  constructor(private yummlyService: YummlyService) {

  }

  getRecipeFromYummly() {
    this.yummlyService.getRecipes()
      .subscribe(
        yummlyRecipes => this.yummlyRecipes = yummlyRecipes.matches,
      );
  }

  ngOnInit() {
    this.getRecipeFromYummly();
  }

}
