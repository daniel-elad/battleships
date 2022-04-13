import {
	Component,
	EventEmitter,
	Input,
	OnDestroy,
	OnInit,
	Output,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Component({
	selector: 'app-timer',
	templateUrl: './timer.component.html',
	styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnInit, OnDestroy {
	@Input() init: number = 0;
	@Input() events: Observable<void> = new Observable<void>();
	@Output() hideTimer: EventEmitter<void> = new EventEmitter();
	counter: number = 0;

	private eventsSubscription: Subscription = new Subscription();

	constructor() {}

	ngOnInit(): void {
		this.eventsSubscription = this.events.subscribe(() =>
			this.startCountdown()
		);
		this.startCountdown();
	}
	ngOnDestroy() {
		this.eventsSubscription.unsubscribe();
	}

	startCountdown() {
		this.counter = this.init;
		this.doCountdown();
	}

	doCountdown() {
		setTimeout(() => {
			this.counter--;
			this.processCountdown();
		}, 1000);
	}

	processCountdown() {
		if (this.counter === 0) {
			this.hideTimer.emit();
		} else {
			this.doCountdown();
		}
	}
}
