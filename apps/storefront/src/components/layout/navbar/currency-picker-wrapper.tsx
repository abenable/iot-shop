import {getActiveChannel} from '@/lib/vendure/actions';
import {getActiveCurrencyCode} from '@/lib/currency-server';
import {CurrencyPicker} from './currency-picker';

// Intentionally dynamic (not cached) — reads the currency cookie via
// getActiveCurrencyCode() so the picker reflects the user's current selection.
export async function CurrencyPickerWrapper() {
    const channel = await getActiveChannel();
    const activeCurrency = await getActiveCurrencyCode();

    // During build, channel may be null - provide fallback
    if (!channel) {
        return (
            <CurrencyPicker
                availableCurrencyCodes={['UGX']}
                activeCurrencyCode={activeCurrency || 'UGX'}
            />
        );
    }

    return (
        <CurrencyPicker
            availableCurrencyCodes={channel.availableCurrencyCodes}
            activeCurrencyCode={activeCurrency}
        />
    );
}
