import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { DeleteConfimComponent } from './delete-confim/delete-confim.component';
import { HomeComponent } from './home/home.component';
import { NavigationComponent } from './navigation/navigation.component';
import { StatusMessageComponent } from './status-message/status-message.component';
import { DataService } from './data.service';
// import { AppRoutingModule } from './routing/routing.module';
// import { DeleteConfirmComponent } from './delete-confirm/delete-confirm.component';

import { IngredientComponent } from './ingredient/ingredient.component';
import { IngredientFormComponent } from './ingredient-form/ingredient-form.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    HomeComponent,
    // DeleteConfirmComponent,
    StatusMessageComponent
  ],
  imports: [
    BrowserModule,
    // AppRoutingModule,
    HttpModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  // entryComponents: [DeleteConfirmComponent],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
