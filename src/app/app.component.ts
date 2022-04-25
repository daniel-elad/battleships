import {
	AfterViewInit,
	Component,
	ElementRef,
	OnInit,
	ViewChild,
} from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
	title = 'battleship';

	@ViewChild('grid', { read: ElementRef }) grid: ElementRef =
		{} as ElementRef;

	ngOnInit(): void {
		const mode = localStorage.getItem('mode');
		if (mode) {
			return;
		}
		localStorage.setItem('mode', 'dark');
	}

	ngAfterViewInit(): void {
		this.updateMode();
	}

	makeLight(container: Element) {
		const children = container.children;
		if (!children) return;
		Array.from(children).forEach((child) => {
			child.classList.add('light');
			this.makeLight(child);
		});
	}

	makeDark(container: Element) {
		const children = container.children;
		if (!children) return;
		Array.from(children).forEach((child) => {
			child.classList.remove('light');
			this.makeDark(child);
		});
	}

	updateMode() {
		console.log(this.grid.nativeElement);
		if (localStorage.getItem('mode') === 'light') {
			this.makeLight(this.grid.nativeElement);
			document.body.style.backgroundColor = '#f5f5f5';
			return;
		}
		this.makeDark(this.grid.nativeElement);
		document.body.style.backgroundColor = '#333';
	}
}
