<h2><?php esc_html_e('Checkout Engine', 'checkout_engine'); ?></h2>

<table class="form-table">
    <tr>
        <th><?php esc_html_e('Customer', 'presto-player-pro'); ?></th>
        <td>
            @if ($customer)
                <a href="{{ esc_url($edit_link) }}">{{ $customer->name ?? $customer->email }}</a>
            @else
                {{ __('This user is not a customer.', 'checkout_engine') }}
            @endif
        </td>
    </tr>
</table>
