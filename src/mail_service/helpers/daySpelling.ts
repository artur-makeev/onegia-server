export const daySpelling = (numberOfDays: number): string => {
	const lastDigit = numberOfDays % 10;
	let spelling = '';

	if (lastDigit == 1) {
		spelling = 'день';
	} else if (2 <= lastDigit && lastDigit <= 4) {
		spelling = 'дня';
	} else {
		spelling = 'дней';
	}

	return spelling;
};
