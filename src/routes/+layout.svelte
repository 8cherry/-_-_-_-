<script lang="ts">
    import '../app.css';
    import authStore from "$modules/auth/index.svelte.ts";
	import {goto} from "$app/navigation";


    let {children, auth, session} = $props();

    if (session !== null) {
        authStore.load(session);
    }

    console.log('is auth ', authStore.isAuthorized());

    if (authStore.isAuthorized()) {
        goto(`/`)
    }
</script>


{@render children()}

<style>
    .wrapper {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    main {
        flex: 1 1 auto;
    }
</style>
