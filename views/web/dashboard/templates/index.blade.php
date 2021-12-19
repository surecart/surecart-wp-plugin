<div class="ce-customer-dashboard">
    @if (!empty($heading))
        <ce-heading>{{ $heading }}
            @if (!empty($description))
                <span slot="description">{{ $description }}</span>
            @endif
            @if (!empty($end))
                <span slot="end">{{ $end }}</span>
            @endif
        </ce-heading>
        <ce-divider style="--spacing:var(--ce-spacing-medium)"></ce-divider>
    @endif

    {{ $slot }}
</div>
