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
import { NewGame } from 'src/app/models/NewGame';
import { BattleshipService } from 'src/app/services/battleship.service';
import { RhombusService } from 'src/app/services/rhombus.service';

@Component({
	selector: 'app-grid',
	templateUrl: './grid.component.html',
	styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements AfterViewInit {
	battleships: string[][] = [];
	bombedBattleships: string[] = [];
	isWin: boolean = false;
	cells: Element[] = [];
	smallBattleships: number;
	mediumBattleships: number;
	largeBattleships: number;
	cellsToDissapear: string[] = [];
	@ViewChild('container') container!: ElementRef;
	@ViewChild('list', { read: ElementRef }) list!: ElementRef;
	@ViewChild('newGameModal', { read: ElementRef }) newGameModal!: ElementRef;
	xAxis: string[] = gridNumbers.slice(0, 10);
	yAxis: string[] = gridLetters.slice(0, 10);

	constructor(
		private battleshipService: BattleshipService,
		private cdRef: ChangeDetectorRef,
		private rhombusService: RhombusService
	) {
		this.smallBattleships = 0;
		this.mediumBattleships = 0;
		this.largeBattleships = 0;
	}

	ngAfterViewInit(): void {
		document.documentElement.style.setProperty('--columns', '10');
		document.documentElement.style.setProperty('--rows', '10');
		this.cdRef.detectChanges();
	}

	ParseInt(x: string) {
		return Number.parseInt(x);
	}

	startNewGame(data: NewGame): void {
		this.isWin = false;
		this.cells = this.initCells();
		this.resetCells();
		this.InvisibleCells(data.columns, data.rows);
		this.createBattleShip(data.battleships);
		this.list.nativeElement.firstChild.firstChild.firstChild.focus();
	}

	initCells() {
		return Array.from(this.container.nativeElement.children) as Element[];
	}

	InvisibleCells(horizontal: number, vertical: number) {
		this.cells.forEach((cell) => {
			if (this.cellsToDissapear.includes(cell.id)) {
				cell.classList.add('invisible');
			}
		});
	}

	setCellsToDissapear(cells: string[]) {
		this.cellsToDissapear = cells;
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
				'battleship-horizontal-start',
				'battleship-horizontal-end',
				'battleship-vertical-start',
				'battleship-vertical-end',
				'battleship-horizontal-middle',
				'battleship-vertical-middle',
				'battleship-full',
				'invisible'
			);
			cell.removeAttribute('disabled');
			cell.removeAttribute('aria-disabled');
			cell.setAttribute('aria-label', `${cell.id}`);
		});
	}

	createBattleShip(battleshipsNum: number) {
		for (let i = 0; i < battleshipsNum; i++) {
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
		const allCells: HTMLElement[] = Array.from(
			this.container.nativeElement.children
		);

		const emptyCells = allCells.filter((cell: HTMLElement) => {
			return !cell.classList.contains('invisible');
		});
		console.log(emptyCells.length);

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

	onStartNewGame(formInput: NewGame) {
		this.startNewGame(formInput);
		this.newGameModal.nativeElement.style.display = 'none';
	}

	configGrid(grid: NewGame) {
		if (grid.rows < 2) {
			this.yAxis = [...gridLetters].slice(0, 2);
			this.container.nativeElement.style.setProperty('--rows', '2');
		} else {
			this.yAxis = [...gridLetters].slice(0, grid.rows);
			this.container.nativeElement.style.setProperty('--rows', grid.rows);
		}
		if (grid.columns < 2) {
			this.xAxis = [...gridNumbers].slice(0, 2);
			document.documentElement.style.setProperty('--columns', '2');
		} else {
			this.xAxis = [...gridNumbers].slice(0, grid.columns);
			document.documentElement.style.setProperty(
				'--columns',
				grid.columns.toString()
			);
		}
	}

	openStartModal() {
		this.isWin = false;
		this.newGameModal.nativeElement.style.display = 'block';
		this.newGameModal.nativeElement.focus();
		this.resetCells();
	}
}
