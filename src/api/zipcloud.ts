import type { AddressResult, ZipCloudApiResponse } from '../types';
import { buildAddress, buildAddressKana } from '../utils/format';

export const fetchAddressByPostalCode = async (
	postalCode: string,
): Promise<AddressResult[]> => {
	const response = await fetch(
		`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${postalCode}`,
	);

	if (!response.ok) {
		throw new Error('NETWORK');
	}

	const data = (await response.json()) as ZipCloudApiResponse;

	if (!data.results) {
		return [];
	}

	return data.results.map((item) => ({
		zipcode: item.zipcode,
		address: buildAddress(item.address1, item.address2, item.address3),
		addressKana: buildAddressKana(item.kana1, item.kana2, item.kana3),
	}));
};