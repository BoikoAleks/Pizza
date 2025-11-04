"use server";

interface FullNominatimResult {
    place_id: number;
    display_name: string;
    address: {
        road?: string;
        house_number?: string;
        city?: string;
        town?: string;
        village?: string;
    };
}

export interface SimplifiedNominatimResult {
    place_id: number;
    display_name: string;
    street: string;
    city: string;
    houseNumber?: string;
}

const CHERNIVTSI_VIEWBOX = '25.85,48.35,26.05,48.23';

export const autocompleteAddress = async (input: string): Promise<SimplifiedNominatimResult[]> => {
    if (!input) return [];

    const query = `Чернівці, ${input}`;

    const params = new URLSearchParams({
        q: query,
        format: "json",
        addressdetails: "1",
        limit: "10", // Тимчасово збільшимо ліміт, щоб було з чого фільтрувати
        countrycodes: "ua",
        viewbox: CHERNIVTSI_VIEWBOX,
        bounded: "1",
    });

    const url = `https://nominatim.openstreetmap.org/search?${params.toString()}`;

    try {
        const response = await fetch(url, {
            headers: { "User-Agent": "PizzaWebsite/1.0 (contact@example.com)" },
        });

        if (!response.ok) {
            throw new Error(`Nominatim API failed with status ${response.status}`);
        }

        const data: FullNominatimResult[] = await response.json();

        const simplifiedResults = data.map((item) => {
            const street = item.address.road?.trim() || '';
            const houseNumber = item.address.house_number?.trim();
            const city = item.address.city || item.address.town || item.address.village || 'Чернівці';

            const formattedDisplayName = [street, houseNumber, city]
                .filter(Boolean)
                .join(', ');

            return {
                place_id: item.place_id,
                display_name: formattedDisplayName || item.display_name,
                street: street || item.display_name,
                city,
                houseNumber,
            } satisfies SimplifiedNominatimResult;
        });

        const uniqueResultsMap = new Map<string, SimplifiedNominatimResult>();

        for (const result of simplifiedResults) {
            const uniqueKey = [result.street.toLowerCase(), result.houseNumber ?? '', result.city.toLowerCase()].join('|');
            if (!uniqueResultsMap.has(uniqueKey)) {
                uniqueResultsMap.set(uniqueKey, result);
            }
        }

        return Array.from(uniqueResultsMap.values());

    } catch (error) {
        console.error("OpenStreetMap Autocomplete Error:", error);
        return [];
    }
};