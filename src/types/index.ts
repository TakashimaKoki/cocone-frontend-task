export type AddressResult = {
	zipcode: string;
	address: string;
	addressKana: string;
};

export type SearchHistoryItem = {
	id: string;
	searchedPostalCode: string;
	results: AddressResult[];
	searchedAt: string;
};

export type ZipCloudApiResult = {
	zipcode: string;
	address1: string;
	address2: string;
	address3: string;
	kana1: string;
	kana2: string;
	kana3: string;
};

export type ZipCloudApiResponse = {
	message: string | null;
	results: ZipCloudApiResult[] | null;
	status: number;
};