import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-grid',
	templateUrl: './grid.component.html',
	styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit {
	xAxis: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
	yAxis: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
	battleshipsIDs: string[];
	bombedBattleships: string[];
	isWin: boolean;
	cells: HTMLElement[] = [];

	constructor() {
		this.battleshipsIDs = [];
		this.bombedBattleships = [];
		this.isWin = false;
	}

	ngOnInit(): void {
		setTimeout(() => this.startNewGame());
	}

	startNewGame(): void {
		this.battleshipsIDs = [];
		this.bombedBattleships = [];
		this.isWin = false;
		this.battleshipsIDs = this.initRandomBattleshipsIDs();
		this.cells = Array.from(document.querySelectorAll('.container button'));
		this.cells.forEach((cell) => {
			cell.classList.remove(
				'battleship',
				'no-battleship',
				'clicked',
				'won'
			);
			cell.removeAttribute('disabled');
			cell.removeAttribute('aria-disabled');
		});
	}

	initRandomBattleshipsIDs() {
		let battleships: string[] = [];
		for (let i = 0; i < 10; i++) {
			const x = this.xAxis[Math.floor(Math.random() * this.xAxis.length)];
			const y = this.yAxis[Math.floor(Math.random() * this.yAxis.length)];
			const battleshipId = `${y}_${x}`;
			if (battleships.includes(battleshipId)) {
				i--;
				continue;
			}
			battleships.push(battleshipId);
		}
		return battleships;
	}

	onCellClick(event: any) {
		event.preventDefault();

		const cell: HTMLElement = event.target;
		if (cell.classList.contains('clicked') || this.isWin) return;
		if (this.battleshipsIDs.includes(cell.id)) {
			cell.classList.add('battleship');
			this.bombedBattleships.push(cell.id);
			cell.setAttribute('aria-label', 'Battleship');
		} else {
			cell.classList.add('no-battleship');
			cell.setAttribute('aria-label', 'No battleship');
		}
		cell.classList.add('clicked');
		cell.setAttribute('disabled', 'true');
		cell.setAttribute('aria-disabled', 'true');

		this.checkWin();
	}

	checkWin() {
		if (this.bombedBattleships.length < 10) return;

		this.isWin = true;
		this.cells.forEach((cell) => {
			cell.classList.add('won');
			cell.setAttribute('disabled', 'true');
			cell.setAttribute('aria-disabled', 'true');
		});
	}
}
