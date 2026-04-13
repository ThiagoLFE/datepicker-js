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
	constructor(year, month, config = {}) {
		const now = new Date();
		this.year      = year ?? now.getFullYear();
		this.month     = month ?? now.getMonth();
		this.onSelect  = config.onSelect ?? null;
		this.ranged    = config.ranged   ?? false;
		this.minDate   = config.minDate  ?? null;
		this.maxDate   = config.maxDate  ?? null;
		this.double    = config.double   ?? false;
		this.startDate = null;
		this.endDate   = null;

		this.element = document.createElement('div');
		this.element.className = this.double ? 'datepicker double' : 'datepicker';

		this._render();
	}

	_handleClick(date) {
		if(this.ranged){
			if(!this.startDate || (this.startDate && this.endDate)){
				this.startDate = date;
				this.endDate   = null;
			}
			else {
				if(date < this.startDate){
					this.endDate   = this.startDate;
					this.startDate = date;
				} else {
					this.endDate = date;
				}
				if(this.onSelect){
					this.onSelect(this.startDate, this.endDate);
				}
			}
		}
		else {
			this.startDate = date;
			this.endDate   = null;
			if(this.onSelect)
				this.onSelect(this.startDate);
		}
		this._render();
	}

	_prevMonth() {
		if(this.month === 0){ this.month = 11; this.year -= 1; }
		else { this.month -= 1; }
		this._render();
	}

	_nextMonth() {
		if(this.month === 11){ this.month = 0; this.year += 1; }
		else { this.month += 1; }
		this._render();
	}

	_renderGrid(year, month) {
		const grid = document.createElement('div');
		grid.className = 'datepicker-grid';

		for(let i = 0; i < weekdayLabels.length; i++){
			let lbl = document.createElement('span');
			lbl.innerText = weekdayLabels[i];
			grid.appendChild(lbl);
		}

		const dayOffset = offsetOfFirstDay(year, month);
		const numDays   = daysInMonth(year, month);

		for(let i = 0; i < 35; i++){
			let btn   = document.createElement('button');
			let day   = i + 1 - dayOffset;
			let value = new Date(year, month, 1);

			let inCurrentMonth = true;

			if(day > numDays){
				btn.setAttribute('disabled', true);
				inCurrentMonth = false;
				day = i - numDays + 1 - dayOffset;
				value.setDate(value.getDate() + numDays);
			}
			else if(day <= 0){
				btn.setAttribute('disabled', true);
				inCurrentMonth = false;
				day = daysInPreviousMonth(year, month)
					- offsetOfFirstDay(year, month) + i + 1;
				value.setDate(value.getDate() - 1);
			}
			else {
				value.setDate(day);
			}

			if((this.minDate && value < this.minDate) || (this.maxDate && value > this.maxDate)){
				btn.setAttribute('disabled', true);
			}

			if(inCurrentMonth && this.startDate && this.endDate){
				const t = value.getTime();
				if(t === this.startDate.getTime() || t === this.endDate.getTime()){
					btn.classList.add('datepicker-selected');
				}
				else if(value > this.startDate && value < this.endDate){
					btn.classList.add('datepicker-range');
				}
			}
			else if(inCurrentMonth && this.startDate && value.getTime() === this.startDate.getTime()){
				btn.classList.add('datepicker-selected');
			}

			btn.addEventListener('click', (ev) => {
				ev.preventDefault();
				this._handleClick(value);
			});

			btn.innerText = day;
			grid.appendChild(btn);
		}

		return grid;
	}

	_render() {
		this.element.innerHTML = '';

		const nextYear  = this.month === 11 ? this.year + 1 : this.year;
		const nextMonth = this.month === 11 ? 0 : this.month + 1;

		// Header
		const header = document.createElement('div');
		header.className = 'datepicker-header';

		const prevBtn = document.createElement('button');
		prevBtn.innerText = '<';
		prevBtn.addEventListener('click', (ev) => { ev.preventDefault(); this._prevMonth(); });

		const nextBtn = document.createElement('button');
		nextBtn.innerText = '>';
		nextBtn.addEventListener('click', (ev) => { ev.preventDefault(); this._nextMonth(); });

		const fmtMonth = (y, m) =>
			new Date(y, m, 1).toLocaleString('default', { month: 'long', year: 'numeric' });

		if(this.double){
			const label1 = document.createElement('span');
			label1.innerText = fmtMonth(this.year, this.month);

			const label2 = document.createElement('span');
			label2.innerText = fmtMonth(nextYear, nextMonth);

			header.appendChild(prevBtn);
			header.appendChild(label1);
			header.appendChild(label2);
			header.appendChild(nextBtn);
		} else {
			const label = document.createElement('span');
			label.innerText = fmtMonth(this.year, this.month);
			header.appendChild(prevBtn);
			header.appendChild(label);
			header.appendChild(nextBtn);
		}

		this.element.appendChild(header);

		// Grid
		if(this.double){
			const months = document.createElement('div');
			months.className = 'datepicker-months';
			months.appendChild(this._renderGrid(this.year, this.month));
			months.appendChild(this._renderGrid(nextYear, nextMonth));
			this.element.appendChild(months);
		} else {
			this.element.appendChild(this._renderGrid(this.year, this.month));
		}
	}

	mount(container) {
		container.appendChild(this.element);
	}
}

const picker = new Datepicker(2026, 10, {
	ranged: true,
	onSelect: (start, end) => console.log([start, end]),
	minDate: new Date(),
double:true,
});

picker.mount(document.querySelector("body"));
