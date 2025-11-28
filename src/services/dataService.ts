import api from "../lib/api";
import { Category, Nominee } from "../@types/NomineeType";

interface NomineeWithStatus extends Nominee {
                Winner?: boolean;
                winner?: boolean;
}

export const dataService = {
                getCategories: async () => {
                                const { data } = await api.get<Category[]>("/categories");
                                return data;
                },

                getNomineesByCategory: async (categoryId: number) => {
                                const { data } = await api.get<NomineeWithStatus[]>(
                                                `/categories/${categoryId}/nominees`
                                );
                                return data;
                },

                getAllNominees: async () => {
                                const categories = await dataService.getCategories();
                                const allNominees: NomineeWithStatus[] = [];

                                const promises = categories.map(async (category) => {
                                                try {
                                                                const nominees = await dataService.getNomineesByCategory(category.id);
                                                                allNominees.push(...nominees);
                                                } catch (error) {
                                                                console.error(`Failed to fetch nominees for category ${category.id}`, error);
                                                }
                                });

                                await Promise.all(promises);
                                return allNominees;
                },
};
