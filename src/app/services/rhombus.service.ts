import { Injectable } from '@angular/core';
import { gridLetters } from '../extensions/grid-helper';

@Injectable({
	providedIn: 'root',
})
export class RhombusService {
	constructor() {}

	createHorizontalRhombus(horizontal: number, vertical: number) {
		const horizontalCenter = Math.floor(horizontal / 2);
		const verticalCenter = Math.floor(vertical / 2);
		const step = Math.round(horizontal / vertical);
		const cells = [];
		if (vertical % 2 == 0) {
			for (let i = 0; i < verticalCenter - 1; i++) {
				let cellsToRemove = horizontalCenter - i * step;
				cells.push(
					this.TopRemovableCells(
						Math.abs(cellsToRemove),
						i,
						horizontal
					)
				);
				cells.push(
					this.BottomRemovableCells(
						Math.abs(cellsToRemove),
						i,
						horizontal,
						vertical
					)
				);
			}
		} else {
			for (let i = 0; i < verticalCenter; i++) {
				let cellsToRemove = horizontalCenter - i * step;
				cells.push(
					this.TopRemovableCells(
						Math.abs(cellsToRemove),
						i,
						horizontal
					)
				);
				cells.push(
					this.BottomRemovableCells(
						Math.abs(cellsToRemove),
						i,
						horizontal,
						vertical
					)
				);
			}
		}
		cells.sort();
		return cells.reduce((accumulator, currentValue) =>
			accumulator.concat(currentValue)
		);
	}

	TopRemovableCells(num: number, iterationNum: number, horizontal: number) {
		const letter = gridLetters[iterationNum];
		const left = [];
		const right = [];
		if (horizontal % 2 == 0) {
			for (let i = 0; i < num - 1; i++) {
				const cell = `${letter}_${i}`;
				left.push(cell);
			}
			for (let i = 0; i < num - 1; i++) {
				const cell = `${letter}_${horizontal - 1 - i}`;
				right.push(cell);
			}
		} else {
			for (let i = 0; i < num; i++) {
				const cell = `${letter}_${i}`;
				left.push(cell);
			}
			for (let i = 0; i < num; i++) {
				const cell = `${letter}_${horizontal - 1 - i}`;
				right.push(cell);
			}
		}
		const row = left.concat(right);
		return row;
	}
	BottomRemovableCells(
		num: number,
		iterationNum: number,
		horizontal: number,
		vertical: number
	) {
		const letter = gridLetters[vertical - 1 - iterationNum];
		const left = [];
		const right = [];
		if (horizontal % 2 == 0) {
			for (let i = 0; i < num - 1; i++) {
				const cell = `${letter}_${i}`;
				left.push(cell);
			}
			for (let i = 0; i < num - 1; i++) {
				const cell = `${letter}_${horizontal - 1 - i}`;
				right.push(cell);
			}
		} else {
			for (let i = 0; i < num; i++) {
				const cell = `${letter}_${i}`;
				right.push(cell);
			}
			for (let i = 0; i < num; i++) {
				const cell = `${letter}_${horizontal - 1 - i}`;
				left.push(cell);
			}
		}
		const row = left.concat(right);
		return row;
	}

	createVerticalRhombus(horizontal: number, vertical: number) {
		const horizontalCenter = Math.floor(horizontal / 2);
		const verticalCenter = Math.floor(vertical / 2);
		const step = Math.round(vertical / horizontal);
		const cells = [];
		if (horizontal % 2 == 0) {
			for (let i = 0; i < horizontalCenter - 1; i++) {
				let log = verticalCenter - i * step;
				cells.push(
					this.LeftRemovableCellsVertical(Math.abs(log), i, vertical)
				);
				cells.push(
					this.RightRemovableCellsVertical(
						Math.abs(log),
						i,
						vertical,
						horizontal
					)
				);
			}
		} else {
			for (let i = 0; i < horizontalCenter; i++) {
				let log = verticalCenter - i * step;
				cells.push(
					this.LeftRemovableCellsVertical(Math.abs(log), i, vertical)
				);
				cells.push(
					this.RightRemovableCellsVertical(
						Math.abs(log),
						i,
						vertical,
						horizontal
					)
				);
			}
		}
		cells.sort();
		return cells.reduce((accumulator, currentValue) =>
			accumulator.concat(currentValue)
		);
	}

	LeftRemovableCellsVertical(
		num: number,
		iterationNum: number,
		vertical: number
	) {
		const iNum = iterationNum;
		const top = [];
		const bottom = [];
		if (vertical % 2 == 0) {
			for (let i = 0; i < num - 1; i++) {
				const cell = `${gridLetters[i]}_${iNum}`;
				top.push(cell);
			}
			for (let i = 0; i < num - 1; i++) {
				const cell = `${gridLetters[vertical - 1 - i]}_${iNum}`;
				bottom.push(cell);
			}
		} else {
			for (let i = 0; i < num; i++) {
				const cell = `${gridLetters[i]}_${iNum}`;
				top.push(cell);
			}
			for (let i = 0; i < num; i++) {
				const cell = `${gridLetters[vertical - 1 - i]}_${iNum}`;
				bottom.push(cell);
			}
		}
		const row = bottom.concat(top);
		return row;
	}

	RightRemovableCellsVertical(
		num: number,
		iterationNum: number,
		vertical: number,
		horizontal: number
	) {
		const iNum = horizontal - 1 - iterationNum;
		const bottom = [];
		const top = [];
		if (vertical % 2 == 0) {
			for (let i = 0; i < num - 1; i++) {
				const cell = `${gridLetters[i]}_${iNum}`;

				top.push(cell);
			}
			for (let i = 0; i < num - 1; i++) {
				const cell = `${gridLetters[vertical - 1 - i]}_${iNum}`;
				bottom.push(cell);
			}
		} else {
			for (let i = 0; i < num; i++) {
				const cell = `${gridLetters[i]}_${iNum}`;

				top.push(cell);
			}
			for (let i = 0; i < num; i++) {
				const cell = `${gridLetters[vertical - 1 - i]}_${iNum}`;
				bottom.push(cell);
			}
		}
		const row = bottom.concat(top);
		return row;
	}
}
