import type { AddressResult } from '../types';

export const renderResultList = (results: AddressResult[]): string => {
	if (results.length === 0) {
		return '';
	}

	const resultItems = results
		.map(
			(result) => `
				<article class="result-card">
					<p class="result-card__label">郵便番号</p>
					<p class="result-card__value">${result.zipcode}</p>

					<p class="result-card__label">住所</p>
					<p class="result-card__value">${result.address}</p>

					<p class="result-card__label">住所（カタカナ）</p>
					<p class="result-card__value">${result.addressKana}</p>
				</article>
			`,
		)
		.join('');

	return `
	<section class="result-section" id="search-results">
		<h2 class="result-section__title">検索結果</h2>
		<div class="result-list">
		${resultItems}
		</div>
	</section>
	`;
};