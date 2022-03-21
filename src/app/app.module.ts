import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GridComponent } from './components/grid/grid.component';
import { ModalComponent } from './components/win-modal/win-modal.component';
import { BattleshipListComponent } from './components/battleship-list/battleship-list.component';
import { NewGameModalComponent } from './components/new-game-modal/new-game-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
	declarations: [
		AppComponent,
		GridComponent,
		ModalComponent,
		BattleshipListComponent,
		NewGameModalComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		ReactiveFormsModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
