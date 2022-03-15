import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
@Component({
	selector: 'app-modal',
	templateUrl: './modal.component.html',
	styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
	@Output() startnewGame = new EventEmitter();

	constructor() {}

	ngOnInit(): void {}

	startGame() {
		this.startnewGame.emit();
	}
}
