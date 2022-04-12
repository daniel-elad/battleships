import {
	Component,
	OnInit,
	Output,
	EventEmitter,
	ViewChild,
	ElementRef,
	AfterViewInit,
	Input,
} from '@angular/core';
import Score from 'src/app/models/Score';

@Component({
	selector: 'app-win-modal',
	templateUrl: './win-modal.component.html',
	styleUrls: ['./win-modal.component.scss'],
})
export class ModalComponent implements OnInit, AfterViewInit {
	@Output() startnewGame = new EventEmitter();
	@Output() resetScores = new EventEmitter();
	@ViewChild('winModal') winModal: ElementRef = {} as ElementRef;
	@Input() scores: Score[] = [];

	constructor() {}
	ngAfterViewInit(): void {
		this.winModal.nativeElement.focus();
	}

	ngOnInit(): void {}

	startGame() {
		this.startnewGame.emit();
	}
	resetScore() {
		this.resetScores.emit();
	}
}
