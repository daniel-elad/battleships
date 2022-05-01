import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	ElementRef,
	EventEmitter,
	Output,
	ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { gridLetters, gridNumbers } from 'src/app/extensions/grid-helper';
import {
	nestedInclude,
	nestedLength,
} from 'src/app/extensions/nested-extensions';
import { NewGame } from 'src/app/models/NewGame';
import Score from 'src/app/models/Score';
import { BattleshipService } from 'src/app/services/battleship.service';
import { IslandService } from 'src/app/services/island.service';
import { RhombusService } from 'src/app/services/rhombus.service';

@Component({
	selector: 'app-grid',
	templateUrl: './grid.component.html',
	styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements AfterViewInit {
	@Output() updateDarkMode = new EventEmitter();
	battleships: string[][] = [];
	bombedBattleships: string[] = [];
	isWin: boolean = false;
	disableAttack: boolean = true;
	cells: Element[] = [];
	smallBattleships: number = 0;
	mediumBattleships: number = 0;
	largeBattleships: number = 0;
	cellsToDissapear: string[] = [];
	Scores: Score[] = [];
	islandsNum: number = 0;
	islands: string[] = [];
	@ViewChild('container') container: ElementRef = {} as ElementRef;
	@ViewChild('list', { read: ElementRef }) list: ElementRef =
		{} as ElementRef;
	@ViewChild('newGameModal', { read: ElementRef }) newGameModal: ElementRef =
		{} as ElementRef;
	@ViewChild('gridContainer', { read: ElementRef })
	gridContainer: ElementRef = {} as ElementRef;
	xAxis: string[] = gridNumbers.slice(0, 10);
	yAxis: string[] = gridLetters.slice(0, 10);
	showTimer: boolean = false;
	eventsSubject: Subject<void> = new Subject<void>();

	constructor(
		private battleshipService: BattleshipService,
		private islandsService: IslandService,
		private cdRef: ChangeDetectorRef
	) {}

	ngAfterViewInit(): void {
		document.documentElement.style.setProperty('--columns', '10');
		document.documentElement.style.setProperty('--rows', '10');
		this.cdRef.detectChanges();
		// this.makeLight(this.gridContainer.nativeElement);
	}

	hideTimer() {
		this.showTimer = false;
		this.hideBattleships();
	}

	emitEventToChild() {
		this.showTimer = true;
		this.eventsSubject.next();
	}

	ParseInt(x: string) {
		return Number.parseInt(x);
	}

	startNewGame(data: NewGame): void {
		this.isWin = false;
		this.cells = this.initCells();
		this.resetCells();
		this.InvisibleCells();
		this.spawnIslands();
		this.createBattleShip(data.battleships);
		this.list.nativeElement.firstChild.firstChild.firstChild.focus();
	}

	initCells() {
		return Array.from(this.container.nativeElement.children) as Element[];
	}

	InvisibleCells() {
		this.cells.forEach((cell) => {
			if (this.cellsToDissapear.includes(cell.id)) {
				cell.classList.add('invisible');
			}
		});
	}

	spawnIslands() {
		const cells: HTMLElement[] = Array.from(
			this.container.nativeElement.children
		);
		for (let index = 0; index < this.islandsNum; index++) {
			const islandCell = this.islandsService.createIsland(
				this.getEmptyCells(),
				cells
			);
			if (islandCell) {
				this.islands.push(islandCell);
			}
		}
	}

	setCellsToDissapear(cells: string[]) {
		this.cellsToDissapear = cells;
	}

	setIslandNum(islandsNumber: number) {
		this.islandsNum = islandsNumber;
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
				'island',
				'island-clicked',
				'battleship-horizontal-start',
				'battleship-horizontal-end',
				'battleship-vertical-start',
				'battleship-vertical-end',
				'battleship-horizontal-middle',
				'battleship-vertical-middle',
				'battleship-full',
				'invisible'
			);
			// cell.removeAttribute('disabled');
			// cell.removeAttribute('aria-disabled');
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
			return (
				!cell.classList.contains('invisible') &&
				!cell.classList.contains('island')
			);
		});
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

	bombCell(cell: HTMLElement) {
		if (cell.classList.contains('clicked') || this.isWin) return;
		if (nestedInclude(this.battleships, cell.id)) {
			cell.classList.add('battleship');
			this.bombedBattleships.push(cell.id);
			cell.setAttribute('aria-label', `${cell.id} Battleship`);
			this.checkBombedShip(cell.id);
		} else if (this.islands.includes(cell.id)) {
			cell.classList.add('island-clicked');
			cell.setAttribute('aria-label', `${cell.id} Island`);
		} else {
			cell.classList.add('no-battleship');
			cell.setAttribute('aria-label', `${cell.id} No battleship`);
		}
		cell.classList.add('clicked');
		this.Scores[this.Scores.length - 1].clicksNumber++;
		cell.setAttribute('aria-disabled', 'true');
		this.checkWin();
	}

	onCellClick(event: any) {
		const cell: HTMLElement = event.target;
		this.bombCell(cell);
	}

	onAttack(cell: HTMLElement) {
		this.bombCell(cell);
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
			cell.setAttribute('aria-live', 'off');
		});
		console.log(this.Scores);
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
		this.disableAttack = true;
		this.startNewGame(formInput);
		this.Scores.push({
			rows: formInput.rows,
			columns: formInput.columns,
			battleships: formInput.battleships,
			isRhombus: formInput.makeRhombus,
			spawnIslands: formInput.spawnIslands,
			clicksNumber: 0,
		});
		this.emitEventToChild();
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

	updateMode() {
		this.updateDarkMode.emit();
	}

	hideBattleships() {
		this.cells.forEach((cell) => {
			cell.classList.remove(
				'battleship-light',
				'island',
				'battleship-large-left-horizontal-start',
				'battleship-large-left-horizontal-end',
				'battleship-large-left-horizontal-middle',
				'battleship-large-right-horizontal-start',
				'battleship-large-right-horizontal-end',
				'battleship-large-right-horizontal-middle',
				'battleship-medium-right-horizontal-start',
				'battleship-medium-right-horizontal-end',
				'battleship-medium-left-horizontal-start',
				'battleship-medium-left-horizontal-end',
				'battleship-large-top-vertical-start',
				'battleship-large-top-vertical-end',
				'battleship-large-top-vertical-middle',
				'battleship-large-bottom-vertical-start',
				'battleship-large-bottom-vertical-end',
				'battleship-large-bottom-vertical-middle',
				'battleship-medium-bottom-vertical-start',
				'battleship-medium-bottom-vertical-end',
				'battleship-medium-top-vertical-start',
				'battleship-medium-top-vertical-end',
				'battleship-full'
			);
			cell.removeAttribute('disabled');
			cell.removeAttribute('aria-disabled');
		});
		this.disableAttack = false;
	}

	openStartModal() {
		this.isWin = false;
		this.newGameModal.nativeElement.style.display = 'block';
		this.newGameModal.nativeElement.focus();
		this.resetCells();
	}

	resetScore() {
		this.Scores = [];
		this.openStartModal();
	}
}
