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
import { FormControl, FormGroup } from '@angular/forms';
import { NewGame } from 'src/app/models/NewGame';
import { RhombusService } from 'src/app/services/rhombus.service';

@Component({
	selector: 'app-new-game-modal',
	templateUrl: './new-game-modal.component.html',
	styleUrls: ['./new-game-modal.component.scss'],
})
export class NewGameModalComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('modalContainer') modalContainer!: ElementRef;
	@ViewChild('Hi') hi!: ElementRef;
	@ViewChild('rowsInput') rowsInput!: ElementRef;
	@ViewChild('submitButton') submitButton!: ElementRef;
	@Output() startNewGame = new EventEmitter<NewGame>();
	@Output() rowsChange = new EventEmitter<NewGame>();
	@Output() cellsToDiss = new EventEmitter<string[]>();
	cellsToDissapear: string[] = [];

	formGroup = new FormGroup({
		rows: new FormControl(10),
		columns: new FormControl(10),
		battleships: new FormControl(10),
		makeRhombus: new FormControl(false),
	});

	constructor(private rhombusService: RhombusService) {}

	ngOnDestroy(): void {}

	ngOnInit(): void {}
	ngAfterViewInit() {
		this.modalContainer.nativeElement.focus();
	}

	calcMaxBattleships(): number {
		let rows = this.formGroup.get('rows')?.value;
		let cols = this.formGroup.get('columns')?.value;
		if (this.formGroup.get('makeRhombus')?.value) {
			return Math.floor((rows * cols - this.cellsToDissapear.length) / 2);
		}
		return Math.floor((rows * cols) / 2);
	}

	onStartGameSubmit() {
		this.startNewGame.emit(this.formGroup.value);
	}

	onInputChange(event: any) {
		this.onRhombusClick();
		this.rowsChange.emit(this.formGroup.value);
	}

	onRhombusClick() {
		let horizontal = this.formGroup.get('columns')?.value;
		let vertical = this.formGroup.get('rows')?.value;
		if (!this.formGroup.get('makeRhombus')?.value) {
			this.cellsToDissapear = [];
		} else {
			if (horizontal! > vertical!) {
				this.cellsToDissapear =
					this.rhombusService.createHorizontalRhombus(
						horizontal,
						vertical
					);
			}
			if (vertical! > horizontal!) {
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