import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	ElementRef,
	ViewChild,
} from '@angular/core';
import { gridLetters, gridNumbers } from 'src/app/extensions/grid-helper';
import {
	nestedInclude,
	nestedLength,
} from 'src/app/extensions/nested-extensions';
import { BattleshipService } from 'src/app/services/battleship.service';

@Component({
	selector: 'app-grid',
	templateUrl: './grid.component.html',
	styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements AfterViewInit {
	xAxis: string[] = gridNumbers;
	yAxis: string[] = gridLetters;
	battleships: string[][] = [];
	bombedBattleships: string[] = [];
	isWin: boolean = false;
	cells: Element[] = [];
	@ViewChild('container') container!: ElementRef;
	smallBattleships: number;
	mediumBattleships: number;
	largeBattleships: number;
	@ViewChild('list', { read: ElementRef }) list!: ElementRef;

	constructor(
		private battleshipService: BattleshipService,
		private cdRef: ChangeDetectorRef
	) {
		this.smallBattleships = 0;
		this.mediumBattleships = 0;
		this.largeBattleships = 0;
	}

	ngAfterViewInit(): void {
		this.startNewGame();
		this.cdRef.detectChanges();
	}

	startNewGame(): void {
		this.isWin = false;
		this.cells = (
			Array.from(this.container.nativeElement.children) as Element[]
		).filter((node) => node.nodeName === 'BUTTON');
		this.resetCells();
		this.createBattleShip();
		this.list.nativeElement.firstChild.firstChild.firstChild.focus();
	}
	resetCells() {
		this.battleships = [];
		this.bombedBattleships = [];
		this.smallBattleships = 0;
		this.mediumBattleships = 0;
		this.largeBattleships = 0;
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

	createBattleShip() {
		for (let i = 0; i < 10; i++) {
			let battleship = this.battleshipService.createBattleship(
				this.getEmptyCells(),
				this.container.nativeElement.children
			);
			if (!battleship) {
				i--;
				continue;
			}
			switch (battleship.length) {
				case 1:
					this.smallBattleships++;
					break;
				case 2:
					this.mediumBattleships++;
					break;
				case 3:
					this.largeBattleships++;
					break;
				default:
					break;
			}
			this.battleships.push(battleship);
		}
	}

	getEmptyCells() {
		const emptyCells: HTMLElement[] = [...this.cells] as HTMLElement[];
		this.battleships.forEach((battleship) => {
			battleship.forEach((id) => {
				var index = emptyCells.indexOf(
					this.container.nativeElement.children[id]
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
			this.checkBombedShip(cell.id);
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
		return true;
	}

	checkBombedShip(battleshipId: string) {
		const battleshipIndex = this.battleships.findIndex((battleship) =>
			battleship.includes(battleshipId)
		);
		const battleshipCell = this.cells.find(
			(cell) => (cell.id = battleshipId)
		);
		const battleshipSize = this.battleships[battleshipIndex].length;
		if (
			this.battleships[battleshipIndex].every((id) =>
				this.bombedBattleships.includes(id)
			)
		) {
			switch (battleshipSize) {
				case 1:
					this.smallBattleships--;
					break;
				case 2:
					this.mediumBattleships--;
					break;
				case 3:
					this.largeBattleships--;
					break;
				default:
					break;
			}
		}
	}
}
