const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function assert(pred, msg){
	if(!pred){
		throw new Error(`assertion failed: ${msg}`);
	}
}

function daysInMonth(year, month) {
	assert((month >= 0) && (month <= 11), `Invalid month: ${month}. Must be 1..=12`);
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
		this.year      = year ?? now.getFullYear();
		this.month     = month ?? now.getMonth();
		this.onSelect  = onSelect ?? null;
		this.startDate = null;
		this.endDate   = null;

		this.element = document.createElement('div');
		this.element.className = 'datepicker';

		this._render();
	}

	_handleClick(date) {
		if(!this.startDate || (this.startDate && this.endDate)){
			this.startDate = date;
			this.endDate   = null;
		} else {
			if(date < this.startDate){
				this.endDate   = this.startDate;
				this.startDate = date;
			} else {
				this.endDate = date;
			}
			if(this.onSelect) this.onSelect(this.startDate, this.endDate);
		}
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

			if(this.startDate && this.endDate){
				const t = value.getTime();
				if(t === this.startDate.getTime() || t === this.endDate.getTime()){
					btn.classList.add('datepicker-selected');
				} else if(value > this.startDate && value < this.endDate){
					btn.classList.add('datepicker-range');
				}
			} else if(this.startDate && value.getTime() === this.startDate.getTime()){
				btn.classList.add('datepicker-selected');
			}

			btn.addEventListener('click', (ev) => {
				ev.preventDefault();
				this._handleClick(value);
			});

			btn.innerText = day;
			this.element.appendChild(btn);
		}
	}

	mount(container) {
		container.appendChild(this.element);
	}
}

const picker = new Datepicker(2026, 10, (start, end) => console.log([start, end]));
picker.mount(document.querySelector("body"));
