const body = document.querySelector("body");

let picker = document.createElement('div');
picker.className = 'datepicker'

const weekdayLabels = ['Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

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
	return new Date(year, month+1, 0).getDate();
}

function daysInPreviousMonth(year, month){
	assert((month >= 0) && (month <= 11), `Invalid month: ${month}. Must be 1..=12`);
	return new Date(year, month, 0).getDate();
}

function previousMonth(date){
	const prev = new Date(date.getFullYear(), date.getMonth(), 0);
	return new Date(prev.getFullYear(), prev.getMonth(), 1);
}

function offsetOfFirstDay(year, month){
	assert((month >= 0) && (month <= 11), `Invalid month: ${month}. Must be 1..=12`);
	return new Date(year, month, 1).getDay();
}

function offsetOfFirstDayOfPreviousMonth(year, month){
	assert((month >= 0) && (month <= 11), `Invalid month: ${month}. Must be 1..=12`);
	if(month - 1 < 0){
		return offsetOfFirstDay(year - 1, 11);
	}
	return offsetOfFirstDay(year, month - 1);
}

for(let i = 0; i < weekdayLabels.length; i++){
	let label = document.createElement('span');
	label.innerText = weekdayLabels[i];
	picker.appendChild(label);
}

let currentYear = 2026;
let currentMonth = 11; // NOTE: Zero indexed because JS
let dayOffset = offsetOfFirstDay(currentYear, currentMonth);

console.log(new Date(currentYear, currentMonth, 1));
console.log(`This month has ${daysInMonth(currentYear, currentMonth)}. Previous was ${daysInPreviousMonth(currentYear, currentMonth)}`)

let daysInCurrentMonth = daysInMonth(currentYear, currentMonth);

for(let i = 0; i < 35; i++){
	let btn = document.createElement('button');
	let day = i + 1 - dayOffset;
	let value = new Date(currentYear, currentMonth, 1);

	if(day > daysInCurrentMonth){
		btn.setAttribute('disabled', true);
		day = i - daysInCurrentMonth + 1 - dayOffset;

		value.setDate(value.getDate() + daysInCurrentMonth);
	}
	else if(day <= 0){
		btn.setAttribute('disabled', true);
		day = daysInPreviousMonth(currentYear, currentMonth)
			- offsetOfFirstDay(currentYear, currentMonth) + i + 1;

		value.setDate(value.getDate() - 1);
	}
	else {
		value.setDate(day);
	}

	btn.addEventListener('click', (ev) => {
		ev.preventDefault();
		console.log(value.toISOString()); // TODO: Callback here (val) => { ... }
	});

	btn.innerText = day;
	picker.appendChild(btn);
}

body.appendChild(picker)

class Datepicker {
}

