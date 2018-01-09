import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { IngredientComponent } from '../ingredient/ingredient.component';
import { IngredientFormComponent } from '../ingredient-form/ingredient-form.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home',  component: HomeComponent },
  { path: 'ingredient',  component: IngredientComponent },
  { path: 'ingredient/add', component: IngredientFormComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
