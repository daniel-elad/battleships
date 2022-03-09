import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-grid',
	templateUrl: './grid.component.html',
	styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit {
	xAxis: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
	yAxis: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
	battleshipsIDs: string[] = [];
	constructor() {}

	ngOnInit(): void {
		this.battleshipsIDs = this.initRandomBattleshipsIDs();
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

	onTdClick(event: any) {
		event.preventDefault();
		const cell: HTMLElement = event.target;
		if (cell.classList.contains('clicked')) return;
		if (this.battleshipsIDs.includes(cell.id)) {
			cell.style.backgroundColor = 'rgb(255, 0, 0)';
		} else {
			cell.style.backgroundColor = 'rgb(0, 255, 0)';
		}
		cell.classList.add('clicked');
	}
}
