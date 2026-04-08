import NextLink from 'next/link';
import {ComponentProps} from 'react';

type NavigationLinkProps = Omit<ComponentProps<typeof NextLink>, 'href'> & {
    href: string;
};

/**
 * Link component for cached/static server components (layout, navbar, footer).
 *
 * Uses next/link directly since we no longer use locale prefixes.
 */
export function NavigationLink({href, ...rest}: NavigationLinkProps) {
    return <NextLink href={href} {...rest} />;
}
