import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class BattleshipService {
	constructor() {}

	paintBattleship(battleship: string[]) {
		battleship.forEach((battleshipID, i) => {
			const element = document.getElementById(battleshipID);
			element?.classList.add('battleship-light');
			if (battleship.length === 1) {
				element?.classList.add('battleship-1');
			}
			if (battleship.length === 2) {
				i === 0
					? element?.classList.add('battleship-start')
					: element?.classList.add('battleship-end');
			}
			if (battleship.length === 3) {
				i === 0
					? element?.classList.add('battleship-start')
					: i === 1
					? element?.classList.add('battleship-middle')
					: element?.classList.add('battleship-end');
			}
		});
	}

	createBattleship(emptyCells: string[]) {
		const size = Math.ceil(Math.random() * 3);
		const randomCell =
			emptyCells[Math.floor(Math.random() * emptyCells.length)].split(
				'_'
			);
		const randomCellSplitted = {
			letter: randomCell[0],
			number: Number.parseInt(randomCell[1]),
		};
		if (!(randomCellSplitted['number'] + size > 9)) {
			let battleship = [];
			for (let i = 0; i < size; i++) {
				const battleshipId = `${randomCellSplitted['letter']}_${
					randomCellSplitted['number'] + i
				}`;
				if (!emptyCells.includes(battleshipId)) {
					return null;
				}
				battleship.push(battleshipId);
			}
			battleship.sort();
			this.paintBattleship(battleship);
			return battleship;
		}
		if (!(randomCellSplitted['number'] - size < 0)) {
			let battleship = [];
			for (let i = 0; i < size; i++) {
				const battleshipId = `${randomCellSplitted['letter']}_${
					randomCellSplitted['number'] - i
				}`;
				if (!emptyCells.includes(battleshipId)) {
					return null;
				}
				battleship.push(battleshipId);
			}
			battleship.sort();
			this.paintBattleship(battleship);
			return battleship;
		}
		return null;
	}
}
