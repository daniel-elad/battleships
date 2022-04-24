import {
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnInit,
	Output,
	ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-battleship-destroyer',
	templateUrl: './battleship-destroyer.component.html',
	styleUrls: ['./battleship-destroyer.component.scss'],
})
export class BattleshipDestroyerComponent implements OnInit {
	destroyerForm: FormGroup = new FormGroup({
		cellLetter: new FormControl(null),
		cellNumber: new FormControl(null),
	});

	@Input() cells: Element[] = [];
	@Input() disableAttack: boolean = true;
	@Output() onAttack: EventEmitter<HTMLElement> = new EventEmitter();
	@ViewChild('letterInput') letterInput: ElementRef = {} as ElementRef;
	currentCell: HTMLElement | null = null;
	cellError: boolean = false;

	constructor() {}

	ngOnInit(): void {}

	onNumberInputKeyPress(event: any) {
		return event.charCode >= 48 && event.charCode <= 57;
	}

	onLetterInputKeyPress(event: any) {
		return /[a-z]/i.test(event.key);
	}

	onInputChange() {
		this.currentCell = null;
		this.cellError = false;
		const letter = this.destroyerForm.get('cellLetter')?.value;
		const number = this.destroyerForm.get('cellNumber')?.value;
		if (letter !== null && number !== null) {
			const emptyCells = this.cells.filter(
				(cell) =>
					!cell.classList.contains('invisible') &&
					!cell.classList.contains('battleship') &&
					!cell.classList.contains('no-battleship')
			);
			const parsedLetter = letter.toUpperCase();
			const cell = emptyCells.find(
				(c) => c.id == `${parsedLetter}_${number}`
			);
			if (!cell) {
				this.cellError = true;
				return;
			}
			this.currentCell = cell as HTMLElement;
		}
	}

	onSubmit(event: any) {
		event.preventDefault();
		if (!this.currentCell) return;
		this.onAttack.emit(this.currentCell);
		this.destroyerForm.reset();
		this.letterInput.nativeElement.focus();
	}
}
