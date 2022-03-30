import {
	AfterViewInit,
	Component,
	ElementRef,
	Input,
	OnInit,
	ViewChild,
} from '@angular/core';
@Component({
	selector: 'app-battleship-list',
	templateUrl: './battleship-list.component.html',
	styleUrls: ['./battleship-list.component.scss'],
})
export class BattleshipListComponent implements OnInit, AfterViewInit {
	@Input() smallBattleships: Number = 0;
	@Input() mediumBattleships: Number = 0;
	@Input() largeBattleships: Number = 0;
	@Input() isWin: Boolean = false;
	@ViewChild('listTitle') listTitle: ElementRef = {} as ElementRef;

	constructor() {}

	ngOnInit(): void {}

	ngAfterViewInit() {
		this.listTitle.nativeElement.focus();
	}
}
