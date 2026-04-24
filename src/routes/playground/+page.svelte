<script lang="ts">
  import { Button } from 'bits-ui';
  import { DesktopIcon } from '$lib/ui/icons';
</script>

<div class="container">
  <section>
    <p class="title-large">Buttons</p>
    <p class="title medium">Basic Buttons</p>
    <div class="examples">
      <Button.Root class="button" onclick={() => alert('Button clicked')}>Basic Button</Button.Root>
      <Button.Root class="button primary">Basic Button</Button.Root>
      <Button.Root class="button warn">Basic Button</Button.Root>
      <Button.Root class="button danger">Basic Button</Button.Root>
      <Button.Root class="button" disabled>Basic Button</Button.Root>
    </div>
    <p class="title medium">Outlined Buttons</p>
    <div class="examples">
      <Button.Root class="button outlined">Basic Button</Button.Root>
      <Button.Root class="button outlined primary">Basic Button</Button.Root>
      <Button.Root class="button outlined warn">Basic Button</Button.Root>
      <Button.Root class="button outlined danger">Basic Button</Button.Root>
    </div>
    <p class="title medium">Text Buttons</p>
    <div class="examples">
      <Button.Root class="button text">Basic Button</Button.Root>
      <Button.Root class="button text primary">Basic Button</Button.Root>
      <Button.Root class="button text warn">Basic Button</Button.Root>
      <Button.Root class="button text danger">Basic Button</Button.Root>
    </div>
    <p class="title medium">Icon Buttons</p>
    <div class="examples">
      <Button.Root class="button icon"><DesktopIcon size="sm" /></Button.Root>
      <Button.Root class="button icon outlined"><DesktopIcon size="sm" /></Button.Root>
      <Button.Root class="button icon text"><DesktopIcon size="sm" /></Button.Root>
      <Button.Root class="button icon outlined danger"><DesktopIcon size="sm" /></Button.Root>
    </div>
  </section>
</div>

<style>
  section {
    margin-block: 3rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .examples {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
    justify-content: center;
  }
</style>
