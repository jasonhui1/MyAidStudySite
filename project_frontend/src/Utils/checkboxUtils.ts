import { CheckboxState } from '../Pages/Inspirations';
import { InspirationData } from '../Types/InspirationData';

// Get selected items from checkbox state 
export const getSelectedItems = (checkboxState: CheckboxState): string[] =>

    // Get selected words
    Object.entries(checkboxState)
        .flatMap(([_, words]) =>
            Object.entries(words)
                .filter(([_, { checked }]) => checked)
                .map(([word]) => word)
        );

// Update checkbox state based on inspiration data
export const updateCheckboxState = <T extends 'artist' | 'keyword'>(
    prevState: CheckboxState,
    data: InspirationData[],
    type: T
): CheckboxState => {
    let newState = { ...prevState } as CheckboxState;

    // Reset counts for existing categories and words, only for keywords
    if (type === 'keyword') {
        for (const category in newState) {
            for (const word in newState[category]) {
                newState[category][word].count = 0;
            }
        }
    }

    data.forEach(({ keywords, artist }) => {
        const items = type === 'keyword' ? keywords : [{ word: artist.name, category: artist.category }];

        items.forEach(({ word, category }) => {
            const checked = prevState[category]?.[word]?.checked || false;
            const prevCount = newState[category]?.[word]?.count || 0;

            newState[category] = {
                ...(newState[category] || {}),
                [word]: {
                    checked,
                    count: prevCount + 1,
                },
            };
        });
    });

    return newState;
};