export const normalizePostalCode = (value: string): string => {
	return value.replace('-', '');
};

export const buildAddress = (
	address1: string,
	address2: string,
	address3: string,
): string => {
	return `${address1}${address2}${address3}`;
};

export const buildAddressKana = (
	kana1: string,
	kana2: string,
	kana3: string,
): string => {
	return `${kana1}${kana2}${kana3}`;
};