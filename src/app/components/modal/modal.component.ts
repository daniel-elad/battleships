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
	selector: 'app-modal',
	templateUrl: './modal.component.html',
	styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit, AfterViewInit {
	@Output() startnewGame = new EventEmitter();
	@ViewChild('winTitle') winTitle!: ElementRef;

	constructor() {}
	ngAfterViewInit(): void {
		this.winTitle.nativeElement.focus();
	}

	ngOnInit(): void {}

	startGame() {
		this.startnewGame.emit();
	}
}
