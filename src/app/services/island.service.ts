import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class IslandService {
	constructor() {}

	createIsland(emptyCells: string[], cells: Element[]) {
		const randomCell =
			emptyCells[Math.floor(Math.random() * emptyCells.length)];
		const cell = cells.find((cell) => cell.id == randomCell);
		cell?.classList.add('island');
	}
}
