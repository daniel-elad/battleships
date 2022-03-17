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
	@Input() smallBattleships!: Number;
	@Input() mediumBattleships!: Number;
	@Input() largeBattleships!: Number;
	@Input() isWin!: Boolean;
	@ViewChild('listTitle') listTitle!: ElementRef;

	battleshipIconSrc: string = 'assets/battleship.svg';
	battleshipIconAlt: string = 'Battleship icon';

	constructor() {}

	ngOnInit(): void {}

	ngAfterViewInit() {
		this.listTitle.nativeElement.focus();
	}
}
