import React from 'react';
import { Filters } from './use-filters';
import qs from 'qs';
import { useRouter } from 'next/navigation';

export const useQueryFilters = (filters: Filters) => {
  const isMounted = React.useRef(false);
  const router = useRouter();

  React.useEffect(() => {
    if (isMounted.current) {
      const params = {
        ...filters.sizes,
      };
      const query = qs.stringify(params, {
        arrayFormat: 'comma',
      });
      router.push(`?${query}`, {
        scroll: false,
      });
    }
    isMounted.current = true;
  }, [filters]);
};