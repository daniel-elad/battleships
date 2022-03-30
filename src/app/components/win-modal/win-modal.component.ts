import {
	Component,
	OnInit,
	Output,
	EventEmitter,
	ViewChild,
	ElementRef,
	AfterViewInit,
} from '@angular/core';

@Component({
	selector: 'app-win-modal',
	templateUrl: './win-modal.component.html',
	styleUrls: ['./win-modal.component.scss'],
})
export class ModalComponent implements OnInit, AfterViewInit {
	@Output() startnewGame = new EventEmitter();
	@ViewChild('winModal') winModal: ElementRef = {} as ElementRef;

	constructor() {}
	ngAfterViewInit(): void {
		this.winModal.nativeElement.focus();
	}

	ngOnInit(): void {}

	startGame() {
		this.startnewGame.emit();
	}
}
