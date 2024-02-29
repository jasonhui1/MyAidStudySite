import { CategoryData, InspirationData } from "../TypeScript/InspirationData";
import { client } from "../client";
import { getAllArtistData, getAllCategoryData, searchQueryThroughCategory } from "./getdata";

export async function fetchArtistData(): Promise<string[]> {
    const artistQuery = getAllArtistData();
    return await client.fetch(artistQuery);
};

export async function fetchCategoryData(): Promise<[CategoryData[], string[][]]> {
    const categoryQuery = getAllCategoryData();
    const categoryData: CategoryData[] = await client.fetch(categoryQuery)
    const keywords = categoryData.map((row) => (row['keywords']))

    return [categoryData, keywords];
};

export async function fetchInspirationData(category: string, searchTerm: string, selectedKeywords: string[], selectedArtists: string[]): Promise<InspirationData[]> {
    const query = searchQueryThroughCategory(category, searchTerm, selectedKeywords, selectedArtists);
    const data = await client.fetch(query)

    return data.inspirations;
};