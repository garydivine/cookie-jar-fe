import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-yummly-details',
  templateUrl: './yummly-details.component.html',
  styleUrls: ['./yummly-details.component.css']
})
export class YummlyDetailsComponent implements OnInit {

  // This Component has nothing more than an input of yummlyRecipeDetails
  // From the yuymmly.component.ts
  @Input() yummlyRecipeDetails;

  constructor() { }

  ngOnInit() {
  }

}
