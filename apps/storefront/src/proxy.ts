import {NextRequest} from 'next/server';

// Simple pass-through proxy - no i18n routing needed
export default function proxy(request: NextRequest) {
    return;
}

export const config = {
    matcher: [],
};
