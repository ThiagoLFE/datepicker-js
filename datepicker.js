const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function assert(pred, msg){
	if(!pred){
		throw new Error(`assertion failed: ${msg}`);
	}
}

function daysInMonth(year, month) {
	assert((month >= 0) && (month <= 11), `Invalid month: ${month}. Must be 1..=12`);
	// NOTE: Using 0-day makes it take the final day of the LAST month, so we
	// take the 0th day of the NEXT month to get the last day of the CURRENT
	// one.
	return new Date(year, month + 1, 0).getDate();
}

function daysInPreviousMonth(year, month){
	assert((month >= 0) && (month <= 11), `Invalid month: ${month}. Must be 1..=12`);
	return new Date(year, month, 0).getDate();
}

function offsetOfFirstDay(year, month){
	assert((month >= 0) && (month <= 11), `Invalid month: ${month}. Must be 1..=12`);
	return new Date(year, month, 1).getDay();
}

class Datepicker {
	constructor(year, month, onSelect) {
		const now = new Date();
		this.year  = year  ?? now.getFullYear();
		this.month = month ?? now.getMonth();
		this.onSelect = onSelect ?? null;

		this.element = document.createElement('div');
		this.element.className = 'datepicker';

		this._render();
	}

	_render() {
		this.element.innerHTML = '';

		for(let i = 0; i < weekdayLabels.length; i++){
			let label = document.createElement('span');
			label.innerText = weekdayLabels[i];
			this.element.appendChild(label);
		}

		const dayOffset = offsetOfFirstDay(this.year, this.month);
		const numDays   = daysInMonth(this.year, this.month);

		for(let i = 0; i < 35; i++){
			let btn   = document.createElement('button');
			let day   = i + 1 - dayOffset;
			let value = new Date(this.year, this.month, 1);

			if(day > numDays){
				btn.setAttribute('disabled', true);
				day = i - numDays + 1 - dayOffset;
				value.setDate(value.getDate() + numDays);
			}
			else if(day <= 0){
				btn.setAttribute('disabled', true);
				day = daysInPreviousMonth(this.year, this.month)
					- offsetOfFirstDay(this.year, this.month) + i + 1;
				value.setDate(value.getDate() - 1);
			}
			else {
				value.setDate(day);
			}

			btn.addEventListener('click', (ev) => {
				ev.preventDefault();
				if(this.onSelect) this.onSelect(value);
			});

			btn.innerText = day;
			this.element.appendChild(btn);
		}
	}

	mount(container) {
		container.appendChild(this.element);
	}
}

const picker = new Datepicker(2026, 10, (v) => console.log(v));
picker.mount(document.querySelector("body"));

