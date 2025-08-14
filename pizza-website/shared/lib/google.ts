"use server";

import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client();

const CHERNIVTSI_LOCATION = { lat: 48.2921, lng: 25.9358 };
const SEARCH_RADIUS = 15000;
export const autocomplete = async (input: string) => {
    if (!input) return [];
    try {
        const response = await client.placeAutocomplete({
            params: {
                input: `Чернівці, ${input}`,
                key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
                language: "uk",
                components: ['country:ua'],

                location: CHERNIVTSI_LOCATION, // Координати центру міста
                radius: SEARCH_RADIUS,        // Радіус пошуку в метрах
                strictbounds: true,
            },
        });

        return response.data.predictions;
    } catch (error) {
        console.error("Google Autocomplete Error:", error);
        return [];

    };


};