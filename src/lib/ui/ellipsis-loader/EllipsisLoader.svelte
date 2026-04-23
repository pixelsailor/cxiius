<div class="ellipsis-loader" role="presentation">
	<span class="ellipsis-loader__dot"></span>
	<span class="ellipsis-loader__dot"></span>
	<span class="ellipsis-loader__dot"></span>
	<span class="ellipsis-loader__dot"></span>
</div>

<style>
	:root {
		--duration: 1.5s;
		--width: 2.5em;
		--dot-count: 4;
		--dot-color: var(--foreground);
		--dot-size: 0.25em;
		--dot-margin: 0.25em;
	}

	.ellipsis-loader {
		animation: var(--duration) infinite ellipsis-loader;
		display: inline-block;
		height: var(--dot-size);
		overflow: hidden;
		position: relative;
		width: var(--width);
	}

	.ellipsis-loader__dot {
		animation: var(--duration) infinite ellipsis-loader-dot;
		background-color: var(--dot-color);
		border-radius: 50%;
		float: left;
		height: var(--dot-size);
		width: var(--dot-size);
		position: absolute;
	}

	.ellipsis-loader__dot:nth-child(1) {
		animation-delay: calc(1 * ((var(--duration) / 2) / var(--dot-count)));
		left: calc(-1 * (var(--dot-size) + var(--dot-margin)));
	}

	.ellipsis-loader__dot:nth-child(2) {
		animation-delay: calc(2 * ((var(--duration) / 2) / var(--dot-count)));
		left: calc(-2 * (var(--dot-size) + var(--dot-margin)));
	}

	.ellipsis-loader__dot:nth-child(3) {
		animation-delay: calc(3 * ((var(--duration) / 2) / var(--dot-count)));
		left: calc(-3 * (var(--dot-size) + var(--dot-margin)));
	}

	.ellipsis-loader__dot:nth-child(4) {
		animation-delay: calc(4 * ((var(--duration) / 2) / var(--dot-count)));
		left: calc(-4 * (var(--dot-size) + var(--dot-margin)));
	}

	@keyframes ellipsis-loader {
		0%,
		25% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(calc(var(--dot-count) * var(--dot-margin)));
		}
	}

	@keyframes ellipsis-loader-dot {
		0% {
			animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
		}
		55% {
			animation-timing-function: cubic-bezier(0.785, 0.135, 0.15, 0.86);
			opacity: 1;
			transform: translateX(var(--width));
		}
		75%,
		100% {
			transform: translateX(calc(var(--width) + (var(--dot-count) * (var(--dot-size) + (3 * var(--dot-margin))))));
		}
		90% {
			opacity: 0.2;
		}
	}
</style>
