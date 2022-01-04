<ce-button
    href="{{ $href }}"
    type="{{ $type }}"
    size="{{ $size }}"
>
    @if ($show_icon)
        <ce-icon
            slot="prefix"
            name="log-out"
        ></ce-icon>
    @endif

    {{ $label }}
</ce-button>
