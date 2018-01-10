import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { IngredientComponent } from '../ingredient/ingredient.component';
import { IngredientFormComponent } from '../ingredient-form/ingredient-form.component';
import { RecipesComponent } from '../recipes/recipes.component';
import { RecipesFormComponent } from '../recipes-form/recipes-form.component';
import { YummlyComponent } from '../yummly/yummly.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home',  component: HomeComponent },
  { path: 'ingredient',  component: IngredientComponent },
  { path: 'ingredient/add', component: IngredientFormComponent },
  { path: 'recipe',  component: RecipesComponent },
  { path: 'recipe/edit/:id', component: RecipesComponent },
  { path: 'recipe/add', component: RecipesFormComponent },
  { path: 'yummly',  component: YummlyComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
