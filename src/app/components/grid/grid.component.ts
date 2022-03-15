import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	OnInit,
} from '@angular/core';
import { nestedInclude, nestedLength } from 'src/app/extensions/nested-include';
import { BattleshipService } from 'src/app/services/battleship.service';

@Component({
	selector: 'app-grid',
	templateUrl: './grid.component.html',
	styleUrls: ['./grid.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent implements OnInit, AfterViewInit {
	xAxis: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
	yAxis: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
	battleships: string[][] = [];
	bombedBattleships: string[] = [];
	isWin: boolean = false;
	cells: Element[] = [];

	constructor(private battleshipService: BattleshipService) {}

	ngAfterViewInit(): void {
		this.startNewGame();
	}

	ngOnInit(): void {}

	startNewGame(): void {
		this.isWin = false;
		this.cells = Array.from(document.querySelectorAll('.container button'));
		this.resetCells();
		this.createBattleShip();
	}

	resetCells() {
		this.battleships = [];
		this.bombedBattleships = [];
		this.cells.forEach((cell) => {
			cell.classList.remove(
				'battleship',
				'battleship-light',
				'no-battleship',
				'clicked',
				'won',
				'battleship-start',
				'battleship-end',
				'battleship-middle',
				'battleship-1'
			);
			cell.removeAttribute('disabled');
			cell.removeAttribute('aria-disabled');
			cell.setAttribute('aria-label', `${cell.id}`);
		});
	}

	// initRandomBattleshipsIDs() {
	// 	let battleships: string[] = [];
	// 	for (let i = 0; i < 10; i++) {
	// 		const x = this.xAxis[Math.floor(Math.random() * this.xAxis.length)];
	// 		const y = this.yAxis[Math.floor(Math.random() * this.yAxis.length)];
	// 		const battleshipId = `${y}_${x}`;
	// 		if (battleships.includes(battleshipId)) {
	// 			i--;
	// 			continue;
	// 		}
	// 		battleships.push(battleshipId);
	// 	}
	// 	return battleships;
	// }

	createBattleShip() {
		for (let i = 0; i < 10; i++) {
			let battleship = this.battleshipService.createBattleship(
				this.getEmptyCells()
			);
			if (!battleship) {
				i--;
				continue;
			}
			this.battleships.push(battleship);
		}
	}

	getEmptyCells() {
		const emptyCells: HTMLElement[] = [...this.cells] as HTMLElement[];
		this.battleships.forEach((battleship) => {
			battleship.forEach((id) => {
				var index = emptyCells.indexOf(
					document.getElementById(id) as HTMLElement
				);
				if (index !== -1) {
					emptyCells.splice(index, 1);
				}
			});
		});
		return emptyCells.map((emptyCell) => emptyCell.id);
	}

	onCellClick(event: any) {
		const cell: HTMLElement = event.target;
		if (cell.classList.contains('clicked') || this.isWin) return;
		if (nestedInclude(this.battleships, cell.id)) {
			cell.classList.add('battleship');
			this.bombedBattleships.push(cell.id);
			cell.setAttribute('aria-label', `${cell.id} Battleship`);
		} else {
			cell.classList.add('no-battleship');
			cell.setAttribute('aria-label', `${cell.id} No battleship`);
		}
		cell.classList.add('clicked');
		cell.setAttribute('aria-disabled', 'true');

		this.checkWin();
	}

	checkWin() {
		if (this.bombedBattleships.length < nestedLength(this.battleships))
			return false;

		this.isWin = true;
		this.resetCells();
		this.cells.forEach((cell) => {
			cell.classList.add('won');
			cell.setAttribute('disabled', 'true');
			cell.setAttribute('aria-disabled', 'true');
		});
		setTimeout(() => {
			document.getElementById('win-title')?.focus();
		});
		return true;
	}
}
