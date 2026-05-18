export const hasOnlyAllowedChars = (value: string): boolean => {
	return /^[0-9-]+$/.test(value);
};

export const isValidPostalFormat = (value: string): boolean => {
	return /^\d{7}$|^\d{3}-\d{4}$/.test(value);
};

export const isEmpty = (value: string): boolean => {
	return value.trim() === '';
};