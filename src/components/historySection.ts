import type { SearchHistoryItem } from '../types';
import { chunkArray } from '../utils/pagination';

type HistorySectionProps = {
	history: SearchHistoryItem[];
	openHistoryId: string | null;
	currentPage: number;
};

export const renderHistorySection = ({
	history,
	openHistoryId,
	currentPage,
}: HistorySectionProps): string => {
	if (history.length === 0) {
		return '';
	}

	const pages = chunkArray(history, 3);

	const slides = pages
		.map((pageItems) => {
			const historyCards = pageItems
				.map((item) => {
					const isOpen = item.id === openHistoryId;

					const resultItems = item.results
						.map(
							(result) => `
								<article class="history-result-card">
									<p class="history-result-card__label">郵便番号</p>
									<p class="history-result-card__value">${result.zipcode}</p>

									<p class="history-result-card__label">住所</p>
									<p class="history-result-card__value">${result.address}</p>

									<p class="history-result-card__label">住所（カタカナ）</p>
									<p class="history-result-card__value">${result.addressKana}</p>
								</article>
							`,
						)
						.join('');

					return `
						<article
							class="history-card ${isOpen ? 'is-open' : ''}"
							data-history-id="${item.id}"
							tabindex="0"
							role="button"
							aria-expanded="${isOpen}"
							aria-label="検索履歴の詳細を表示"
						>
							<p class="history-card__label">検索郵便番号</p>
							<p class="history-card__value">${item.searchedPostalCode}</p>

							<p class="history-card__label">検索結果件数</p>
							<p class="history-card__value">${item.results.length}件</p>

							<p class="history-card__label">検索日時</p>
							<p class="history-card__value">${item.searchedAt}</p>

							<p class="history-card__toggle">
								${isOpen ? '検索結果を閉じる' : '検索結果を表示する'}
							</p>

							${
								isOpen
									? `
										<div class="history-card__details">
											<div class="history-result-list">
												${resultItems}
											</div>
										</div>
									`
									: ''
							}
						</article>
					`;
				})
				.join('');

			return `
				<div class="embla__slide">
					<div class="history-list">
						${historyCards}
					</div>
				</div>
			`;
		})
		.join('');

	const paginationDots = pages
		.map(
			(_, index) => `
				<button
					class="history-pagination__dot ${index === currentPage ? 'is-active' : ''}"
					type="button"
					data-page="${index}"
					aria-label="${index + 1}ページ目へ移動"
				></button>
			`,
		)
		.join('');

	return `
		<section class="history-section">
			<h2 class="history-section__title">検索履歴</h2>

			<div class="embla">
				<div class="embla__viewport">
					<div class="embla__container">
						${slides}
					</div>
				</div>

				<div class="history-controls">
					<button
						class="history-controls__button history-controls__button--prev"
						type="button"
					>
						＜
					</button>

					<div class="history-pagination">
						${paginationDots}
					</div>

					<button
						class="history-controls__button history-controls__button--next"
						type="button"
					>
						＞
					</button>
				</div>
			</div>
		</section>
	`;
};