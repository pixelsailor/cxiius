<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>CXII - You've been bamboozled!</title>
	<meta name="author" content="Benjamin Thompson" />
</svelte:head>

<div class="error-card-container">
	<div class="error-card">
		<h1 class="headline-large">Ah donkey-spittle! There was a problem.</h1>
		<p class="body-large error"><strong>{page.status}</strong><span>|</span><span>{page.error?.message}</span></p>
	</div>
</div>

<style>
	.error-card-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 0.25rem;
		height: 100%;
		max-width: 640px;
		margin: 0 auto;
	}

	.error-card {
		font-size: 5rem;
		letter-spacing: 0.15em;
		line-height: 1.2;
	}

	.error {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}
</style>
