import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { PantryFormComponent } from '../pantry-form/pantry-form.component';
import { IngredientFormComponent } from '../ingredient-form/ingredient-form.component';
import { RecipesComponent } from '../recipes/recipes.component';
import { RecipesFormComponent } from '../recipes-form/recipes-form.component';
import { YummlyComponent } from '../yummly/yummly.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home',  component: HomeComponent },
  { path: 'ingredient/add',  component: PantryFormComponent },
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
