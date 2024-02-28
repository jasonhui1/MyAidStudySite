import { CategoryData } from "../../TypeScript/InspirationData";
import CheckBox from "../Checkbox";

interface AllKeywordsCheckBoxesProps {
    all_categories: CategoryData[],
    keywordCheckState: boolean[][],
    categoriesCheckState: boolean[],
    
    setKeywordCheckState: React.Dispatch<React.SetStateAction<boolean[][]>>
    setCategoryCheckState: React.Dispatch<React.SetStateAction<boolean[]>>
    
}

export default function AllKeywordsCheckBoxes({ all_categories, keywordCheckState, categoriesCheckState, setKeywordCheckState, setCategoryCheckState }: AllKeywordsCheckBoxesProps) {

    const handleCategoryCheckbox = ((index: number): void => {
        const updatedCategoriesCheckState = categoriesCheckState.map((check, i) =>
            i === index ? !check : check
        );
        const isChecked = updatedCategoriesCheckState[index]
        setCategoryCheckState(updatedCategoriesCheckState)

        //Checks/ unchecks all related keywords
        const updatedKeywordCheckState = keywordCheckState.map((row, i) => {
            if (!(i === index)) return row

            return row.map((_) => isChecked)
        });
        setKeywordCheckState(updatedKeywordCheckState);

    })

    const handleKeywordCheckbox = ((i: number, j: number): void => {
        const updatedKeywordCheckState = keywordCheckState.map((row, current_i) => {
            if (!(current_i === i)) return row
            return row.map((cell, current_j) => (j === current_j ? !cell : cell))
        });

        setKeywordCheckState(updatedKeywordCheckState);
    })
    return (
        <div className='grid grid-cols-3 justify-start gap-4 outline p-2 '>
            {(
                all_categories.map(({ word, keywords }: CategoryData, i: number) => {
                    return (
                        <>
                            <div>
                                <h3 className=' font-bold'>{word}</h3>
                                <CheckBox value={word} onChange={() => handleCategoryCheckbox(i)} check={categoriesCheckState[i]} />
                                <hr className=' bg-black' />
                                <div className='grid grid-cols-2 gap-4 shadow-md p-4 '>
                                    {keywords.map((keyword, j) => {
                                        return <CheckBox value={keyword} onChange={() => handleKeywordCheckbox(i, j)} check={keywordCheckState[i][j]} />
                                    })}
                                </div>
                            </div>
                        </>
                    )
                }))}
        </div>

    )
}