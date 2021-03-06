import { Injectable } from '@angular/core';
import { gridLetters } from '../extensions/grid-helper';

@Injectable({
	providedIn: 'root',
})
export class BattleshipService {
	constructor() {}

	private letters: string[] = gridLetters;

	paintBattleship(battleship: string[], cells: any, isHotizontal: Boolean) {
		const isFlipped = !!Math.round(Math.random());
		battleship.forEach((battleshipID, i) => {
			const element = cells[battleshipID];
			element?.classList.add('battleship-light');
			console.log();
			switch (battleship.length) {
				case 1:
					element?.classList.add('battleship-full');
					const randomNumber = Math.floor(Math.random() * 4);
					randomNumber === 0
						? element?.classList.add('right')
						: randomNumber === 1
						? element?.classList.add('top')
						: randomNumber === 2
						? element?.classList.add('bottom')
						: null;
					break;
				case 2:
					isHotizontal && !isFlipped
						? i === 0
							? element?.classList.add(
									'battleship-medium-left-horizontal-start'
							  )
							: element?.classList.add(
									'battleship-medium-left-horizontal-end'
							  )
						: isHotizontal && isFlipped
						? i === 0
							? element?.classList.add(
									'battleship-medium-right-horizontal-start'
							  )
							: element?.classList.add(
									'battleship-medium-right-horizontal-end'
							  )
						: !isHotizontal && isFlipped
						? i === 0
							? element?.classList.add(
									'battleship-medium-top-vertical-start'
							  )
							: element?.classList.add(
									'battleship-medium-top-vertical-end'
							  )
						: i === 0
						? element?.classList.add(
								'battleship-medium-bottom-vertical-start'
						  )
						: element?.classList.add(
								'battleship-medium-bottom-vertical-end'
						  );
					break;
				case 3:
					isHotizontal && !isFlipped
						? i === 0
							? element?.classList.add(
									'battleship-large-left-horizontal-start'
							  )
							: i === 1
							? element?.classList.add(
									'battleship-large-left-horizontal-middle'
							  )
							: element?.classList.add(
									'battleship-large-left-horizontal-end'
							  )
						: isHotizontal && isFlipped
						? i === 0
							? element?.classList.add(
									'battleship-large-right-horizontal-start'
							  )
							: i === 1
							? element?.classList.add(
									'battleship-large-right-horizontal-middle'
							  )
							: element?.classList.add(
									'battleship-large-right-horizontal-end'
							  )
						: !isHotizontal && !isFlipped
						? i === 0
							? element?.classList.add(
									'battleship-large-bottom-vertical-start'
							  )
							: i === 1
							? element?.classList.add(
									'battleship-large-bottom-vertical-middle'
							  )
							: element?.classList.add(
									'battleship-large-bottom-vertical-end'
							  )
						: i === 0
						? element?.classList.add(
								'battleship-large-top-vertical-start'
						  )
						: i === 1
						? element?.classList.add(
								'battleship-large-top-vertical-middle'
						  )
						: element?.classList.add(
								'battleship-large-top-vertical-end'
						  );
					break;
				default:
					break;
			}
		});
	}

	createBattleship(emptyCells: string[], cells: Element[]) {
		const size = Math.ceil(Math.random() * 3);
		const isHotizontal: Boolean = !!Math.round(Math.random());
		const randomCell =
			emptyCells[Math.floor(Math.random() * emptyCells.length)].split(
				'_'
			);
		const randomCellSplitted = {
			letter: randomCell[0],
			number: Number.parseInt(randomCell[1]),
		};
		if (isHotizontal) {
			if (!(randomCellSplitted['number'] + size > 9)) {
				return this.CreateHorizontal(
					size,
					randomCellSplitted['number'],
					randomCellSplitted['letter'],
					emptyCells,
					cells,
					true
				);
			}
			if (!(randomCellSplitted['number'] - size < 0)) {
				return this.CreateHorizontal(
					size,
					randomCellSplitted['number'],
					randomCellSplitted['letter'],
					emptyCells,
					cells,
					false
				);
			}
		} else {
			const letterIndex = this.letters.indexOf(
				randomCellSplitted['letter']
			);
			if (!(letterIndex + size > 9)) {
				return this.CreateVertical(
					size,
					randomCellSplitted['number'],
					letterIndex,
					emptyCells,
					cells,
					true
				);
			}
			if (!(letterIndex - size < 0)) {
				return this.CreateVertical(
					size,
					randomCellSplitted['number'],
					letterIndex,
					emptyCells,
					cells,
					false
				);
			}
		}
		return null;
	}

	private CreateHorizontal(
		size: number,
		number: number,
		letter: string,
		emptyCells: string[],
		cells: Element[],
		isToRight: Boolean
	) {
		let battleship = [];
		for (let i = 0; i < size; i++) {
			const battleshipId = isToRight
				? `${letter}_${number + i}`
				: `${letter}_${number - i}`;
			if (!emptyCells.includes(battleshipId)) {
				return null;
			}
			battleship.push(battleshipId);
		}
		battleship.sort();
		let a = ['B_10', 'B_11', 'B_8', 'B_5'];
		battleship.sort((a: string, b: string) => {
			return a.length - b.length;
		});
		this.paintBattleship(battleship, cells, true);
		return battleship;
	}

	private CreateVertical(
		size: number,
		number: number,
		letterIndex: number,
		emptyCells: string[],
		cells: Element[],
		isToTop: Boolean
	) {
		let battleship = [];
		for (let i = 0; i < size; i++) {
			const battleshipId = isToTop
				? `${this.letters[letterIndex + i]}_${number}`
				: `${this.letters[letterIndex - i]}_${number}`;
			if (!emptyCells.includes(battleshipId)) {
				return null;
			}
			battleship.push(battleshipId);
		}
		battleship.sort((a: string, b: string) => {
			return a.length - b.length;
		});
		battleship.sort();
		this.paintBattleship(battleship, cells, false);
		return battleship;
	}
}
