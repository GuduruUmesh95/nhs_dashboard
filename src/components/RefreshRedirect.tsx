'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function RefreshRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // This effect runs only once when the root layout mounts.
    // In Next.js App Router, the root layout only mounts on a hard reload (refresh) 
    // or the initial visit. It does not unmount during client-side navigation.
    if (pathname !== '/overview') {
      router.replace('/overview');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  return null;
}
