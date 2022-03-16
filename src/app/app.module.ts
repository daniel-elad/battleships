import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GridComponent } from './components/grid/grid.component';
import { ModalComponent } from './components/modal/modal.component';
import { BattleshipListComponent } from './components/battleship-list/battleship-list.component';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    ModalComponent,
    BattleshipListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
