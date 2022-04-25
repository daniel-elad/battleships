import {
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	OnDestroy,
	OnInit,
	Output,
	ViewChild,
} from '@angular/core';
import {
	AbstractControl,
	FormControl,
	FormGroup,
	ValidationErrors,
	ValidatorFn,
} from '@angular/forms';
import { NewGame } from 'src/app/models/NewGame';
import { RhombusService } from 'src/app/services/rhombus.service';

@Component({
	selector: 'app-new-game-modal',
	templateUrl: './new-game-modal.component.html',
	styleUrls: ['./new-game-modal.component.scss'],
})
export class NewGameModalComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('modalContainer') modalContainer: ElementRef = {} as ElementRef;
	@ViewChild('Hi') hi: ElementRef = {} as ElementRef;
	@ViewChild('rowsInput') rowsInput: ElementRef = {} as ElementRef;
	@ViewChild('submitButton') submitButton: ElementRef = {} as ElementRef;
	@Output() startNewGame = new EventEmitter<NewGame>();
	@Output() rowsChange = new EventEmitter<NewGame>();
	@Output() cellsToDiss = new EventEmitter<string[]>();
	@Output() islandsNumber = new EventEmitter<number>();
	@Output() updateMode = new EventEmitter();
	cellsToDissapear: string[] = [];
	islandsNum: number = 0;

	rhombusErrorValidator: ValidatorFn = (
		control: AbstractControl
	): ValidationErrors | null => {
		const rows = control.get('rows');
		const columns = control.get('columns');
		const makeRhombus = control.get('makeRhombus');

		return makeRhombus?.value && (rows?.value < 3 || columns?.value < 3)
			? { rhombusError: true }
			: null;
	};

	isDarkMode() {
		if (localStorage.getItem('mode') === 'dark') {
			return true;
		}

		return false;
	}

	onDarkModeChange() {
		if (localStorage.getItem('mode') === 'dark') {
			localStorage.setItem('mode', 'light');
		} else {
			localStorage.setItem('mode', 'dark');
		}
		this.updateMode.emit();
	}

	formGroup = new FormGroup(
		{
			rows: new FormControl(10),
			columns: new FormControl(10),
			battleships: new FormControl(10),
			makeRhombus: new FormControl(false),
			spawnIslands: new FormControl(false),
		},
		{ validators: this.rhombusErrorValidator }
	);

	constructor(private rhombusService: RhombusService) {}

	ngOnDestroy(): void {}

	ngOnInit(): void {}
	ngAfterViewInit() {
		this.modalContainer.nativeElement.focus();
	}

	calcMaxBattleships(): number {
		let rows = this.formGroup.get('rows')?.value;
		let cols = this.formGroup.get('columns')?.value;
		return Math.floor(
			(rows * cols - this.cellsToDissapear.length - this.islandsNum) / 2
		);
	}

	setIslandNumber() {
		let rows = this.formGroup.get('rows')?.value;
		let cols = this.formGroup.get('columns')?.value;
		const emptyCellsNum = rows * cols - this.cellsToDissapear.length;
		this.islandsNum = Math.floor(emptyCellsNum / 10);
	}

	onSpawnIslandsClick() {
		if (this.formGroup.get('spawnIslands')?.value) this.setIslandNumber();
		else this.islandsNum = 0;
		this.islandsNumber.emit(this.islandsNum);
	}

	onStartGameSubmit() {
		this.startNewGame.emit(this.formGroup.value);
	}

	onInputChange(event: any) {
		if (this.formGroup.get('spawnIslands')?.value) {
			this.onSpawnIslandsClick();
		}
		if (this.formGroup.get('makeRhombus')?.value) {
			this.onRhombusClick();
		}
		this.rowsChange.emit(this.formGroup.value);
	}

	onRhombusClick() {
		if (
			this.formGroup.get('rows')?.value < 3 ||
			this.formGroup.get('columns')?.value < 3
		) {
			this.cellsToDissapear = [];
			this.onSpawnIslandsClick();
			this.cellsToDiss.emit(this.cellsToDissapear);
			return;
		}

		let horizontal = this.formGroup.get('columns')?.value;
		let vertical = this.formGroup.get('rows')?.value;
		if (!this.formGroup.get('makeRhombus')?.value) {
			this.cellsToDissapear = [];
		} else {
			if (horizontal > vertical) {
				this.cellsToDissapear =
					this.rhombusService.createHorizontalRhombus(
						horizontal,
						vertical
					);
			}
			if (vertical > horizontal) {
				this.cellsToDissapear =
					this.rhombusService.createVerticalRhombus(
						horizontal,
						vertical
					);
			}
			if (vertical == horizontal) {
				this.cellsToDissapear =
					this.rhombusService.createHorizontalRhombus(
						horizontal,
						vertical
					);
			}
		}
		this.onSpawnIslandsClick();
		this.cellsToDiss.emit(this.cellsToDissapear);
	}

	onInputKeyPress(event: any) {
		if (
			event.target.value >= 10 &&
			event.target.value < 100 &&
			document.getSelection()!.toString().length > 0
		)
			return true;
		if (event.target.value === '10' && event.charCode > 48) return false;

		if (event.target.value > 10) return false;

		return event.charCode >= 48 && event.charCode <= 57;
	}
	onBattleshipInputKeyPress(event: any) {
		return event.charCode >= 48 && event.charCode <= 57;
	}

	onModalKeyPress(event: any) {
		if (
			event.target.id == 'new-game-submit' &&
			event.keyCode == 9 &&
			event.shiftKey == false
		) {
			event.preventDefault();
			this.rowsInput.nativeElement.focus();
		}
		if (
			event.target.id == 'rows-input' &&
			event.keyCode == 9 &&
			event.shiftKey == true
		) {
			event.preventDefault();
			this.submitButton.nativeElement.focus();
		}
	}
}
