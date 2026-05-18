import './style.scss';
import { fetchAddressByPostalCode } from './api/zipcloud';
import { renderHistorySection } from './components/historySection';
import { renderResultList } from './components/resultList';
import { ERROR_MESSAGES } from './constants/messages';
import type { SearchHistoryItem } from './types';
import { normalizePostalCode } from './utils/format';
import { hasOnlyAllowedChars, isEmpty, isValidPostalFormat } from './utils/validation';
import EmblaCarousel from 'embla-carousel';

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
	app.innerHTML = `
		<main class="page">
			<h1 class="title">住所検索</h1>
			<p class="description">
				郵便番号を入力して住所を検索できます。<br>
				郵便番号はハイフン「-」有無どちらでも検索可能です。
			</p>

			<form class="search-form">
				<div class="search-form__row">
					<input
						class="search-form__input"
						type="text"
						placeholder="000-0000, 0000000 の形式で入力"
						maxlength="8"
					/>
					<button class="search-form__button" type="button">
						検索
					</button>
				</div>
				<p class="search-form__error" aria-live="polite"></p>
			</form>

			<div class="result-area"></div>
			<div class="history-area"></div>
		</main>
	`;

	let history: SearchHistoryItem[] = [];
	let currentHistoryPage = 0;
	let openHistoryId: string | null = null;

	const input = document.querySelector<HTMLInputElement>('.search-form__input');
	const button = document.querySelector<HTMLButtonElement>('.search-form__button');
	const error = document.querySelector<HTMLParagraphElement>('.search-form__error');
	const resultArea = document.querySelector<HTMLDivElement>('.result-area');
	const historyArea = document.querySelector<HTMLDivElement>('.history-area');

	if (input && button && error && resultArea && historyArea) {
		const updateButtonState = () => {
			button.disabled = isEmpty(input.value);
		};

		updateButtonState();

		const updateHistoryArea = () => {
			historyArea.innerHTML = renderHistorySection({
				history,
				currentPage: currentHistoryPage,
				openHistoryId,
			});

			const viewport = historyArea.querySelector<HTMLElement>('.embla__viewport');
			const prevButton = historyArea.querySelector<HTMLButtonElement>(
				'.history-controls__button--prev',
			);
			const nextButton = historyArea.querySelector<HTMLButtonElement>(
				'.history-controls__button--next',
			);
			const pageButtons = historyArea.querySelectorAll<HTMLButtonElement>(
				'.history-pagination__dot',
			);
			const historyCards = historyArea.querySelectorAll<HTMLElement>('.history-card');

			if (!viewport || !prevButton || !nextButton) {
				return;
			}

			const embla = EmblaCarousel(viewport, {
				loop: false,
				align: 'start',
				dragFree: false,
			});

			const updateControls = () => {
				currentHistoryPage = embla.selectedScrollSnap();

				prevButton.disabled = !embla.canScrollPrev();
				nextButton.disabled = !embla.canScrollNext();

				pageButtons.forEach((button, index) => {
					button.classList.toggle('is-active', index === currentHistoryPage);
				});
			};

			prevButton.addEventListener('click', () => {
				embla.scrollPrev();
			});

			nextButton.addEventListener('click', () => {
				embla.scrollNext();
			});

			pageButtons.forEach((pageButton) => {
				pageButton.addEventListener('click', () => {
					const page = Number(button.dataset.page);
					embla.scrollTo(page);
				});
			});

			embla.on('select', updateControls);
			embla.on('init', updateControls);

			updateControls();

			historyCards.forEach((card) => {
				const toggleHistory = () => {
					const historyId = card.dataset.historyId;
					if (!historyId) return;

					if (openHistoryId === historyId) {
						openHistoryId = null;
					} else {
						openHistoryId = historyId;
					}

					updateHistoryArea();
				};

				card.addEventListener('click', () => {
					toggleHistory();
				});

				card.addEventListener('keydown', (event) => {
					if (event.key === 'Enter' || event.key === ' ') {
						event.preventDefault();
						toggleHistory();
					}
				});
			});
		};

		input.addEventListener('input', () => {
			error.textContent = '';
			updateButtonState();
		});

		button.addEventListener('click', async () => {
			const value = input.value;

			if (!hasOnlyAllowedChars(value)) {
				error.textContent = ERROR_MESSAGES.INVALID_CHAR;
				resultArea.innerHTML = '';
				return;
			}

			if (!isValidPostalFormat(value)) {
				error.textContent = ERROR_MESSAGES.INVALID_FORMAT;
				resultArea.innerHTML = '';
				return;
			}

			error.textContent = '';

			const normalizedPostalCode = normalizePostalCode(value);

			try {
				const results = await fetchAddressByPostalCode(normalizedPostalCode);

				if (results.length === 0) {
					error.textContent = ERROR_MESSAGES.NOT_FOUND;
					resultArea.innerHTML = '';
					return;
				}

				resultArea.innerHTML = renderResultList(results);

				const historyItem: SearchHistoryItem = {
					id: crypto.randomUUID(),
					searchedPostalCode: value,
					results,
					searchedAt: new Date().toLocaleString('ja-JP'),
				};

				history = [historyItem, ...history];
				currentHistoryPage = 0;
				updateHistoryArea();
			} catch {
				error.textContent = ERROR_MESSAGES.NETWORK;
				resultArea.innerHTML = '';
			}
		});
	}
}