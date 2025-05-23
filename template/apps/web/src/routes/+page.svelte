<script lang="ts">
	export let data;

	function formatDisplayName(user: any): string {
		if (!user) return 'Guest';
		return user.displayName || user.mail || 'User';
	}
	const isAuthenticated = !!data.user;
	const isAdmin = isAuthenticated && Array.isArray(data.user?.roles) && data.user.roles.includes('admin');

</script>

<div class="container mx-auto p-6">
	<div class="hero bg-base-200 rounded-box mb-8">
		<div class="hero-content text-center py-10">
			<div class="max-w-md flex flex-col items-center">
				<div class="flex items-center justify-center mb-4">
					<h1 class="text-3xl font-bold">Welcome to {{PROJECT_NAME}}</h1>
				</div>
				{#if isAuthenticated}
					<div class="mt-4 text-sm flex items-center justify-center flex-wrap gap-1">
						<span class="whitespace-nowrap">You are signed in as <span class="font-semibold">{formatDisplayName(data.user)}</span></span>
						{#if data.user.currentOrganization}
							<div class="flex items-center">
								<span class="mx-1">in</span>
							</div>
						{/if}
						<a href="/auth/logout" class="btn btn-xs btn-outline ml-2 whitespace-nowrap">Log Out</a>
					</div>
				{:else}
					<div class="mt-4">
						<a href="/auth/login/entraid" class="btn btn-primary">Sign In</a>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
