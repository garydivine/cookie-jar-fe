import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { DeleteConfimComponent } from './delete-confim/delete-confim.component';
import { HomeComponent } from './home/home.component';
import { NavigationComponent } from './navigation/navigation.component';
import { RoutingComponent } from './routing/routing.component';
import { StatusMessageComponent } from './status-message/status-message.component';
import { AnimationsComponent } from './animations/animations.component';


@NgModule({
  declarations: [
    AppComponent,
    DeleteConfimComponent,
    HomeComponent,
    NavigationComponent,
    RoutingComponent,
    StatusMessageComponent,
    AnimationsComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
