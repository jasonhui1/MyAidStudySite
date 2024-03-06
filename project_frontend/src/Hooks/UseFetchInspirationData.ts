import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchInspirationData } from '../FetchData/api';
import { InspirationData } from '../Types/InspirationData';
import { isEqual } from 'lodash';

interface UseFetchInspirationData {
    searchTerm: string;
    keywords: string[];
    artists: string[];
}


type searchProps = {
    searchTerm: string,
    keywords: string[]
    artists: string[]
}

export const useFetchInspirationData = ({
    searchTerm,
    keywords,
    artists,
}: UseFetchInspirationData) => {

    const [inspirationData, setInspirationData] = useState<InspirationData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const lastUpdateRef = useRef<searchProps>(); // Use useRef for flag

    const fetchData = useCallback(async () => {

        const currentSearchProps = { searchTerm, keywords, artists }
        if (isEqual(lastUpdateRef.current, currentSearchProps)) return

        console.log('querying data')
        lastUpdateRef.current = currentSearchProps;

        setIsLoading(true);
        setError(null);

        try {
            const data = await fetchInspirationData(searchTerm, keywords, artists);
            setInspirationData(data);

        } catch (err) {
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    }, [searchTerm, keywords, artists]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { inspirationData, isLoading, error };
};

