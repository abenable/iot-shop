'use client';

import {Globe} from 'lucide-react';
import {Button} from '@/components/ui/button';

export function LanguagePicker() {
    return (
        <Button variant="ghost" size="sm" className="gap-1.5" disabled>
            <Globe className="size-4" />
            <span>EN</span>
        </Button>
    );
}
