import { CategoryData, KeywordData } from "../../TypeScript/InspirationData";
import CheckBox from "../Checkbox";

interface AllKeywordsCheckBoxesProps {
    all_categories: CategoryData[],
    all_keywords: KeywordData[][],
    keywordCheckState: boolean[][],
    categoriesCheckState: boolean[],

    setKeywordCheckState: React.Dispatch<React.SetStateAction<boolean[][]>>
    setCategoryCheckState: React.Dispatch<React.SetStateAction<boolean[]>>

}

export default function AllKeywordsCheckBoxes({ all_categories, all_keywords, keywordCheckState, categoriesCheckState, setKeywordCheckState, setCategoryCheckState }: AllKeywordsCheckBoxesProps) {

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
                all_categories.map(({ word }: CategoryData, i: number) => {
                    if (!all_keywords[i].some(({ count }) => count > 0)) return <></>
                    return (
                        <div key={i}>
                            <CheckBox value={word} onChange={() => handleCategoryCheckbox(i)} check={categoriesCheckState[i]} />
                            <hr className=' bg-black' />
                            <div className='grid grid-cols-2 gap-4 shadow-md p-4 '>
                                {all_keywords[i].map(({ word, count }: KeywordData, j) => {
                                    if (count === 0) return <></>
                                    return <CheckBox key={j} value={word} onChange={() => handleKeywordCheckbox(i, j)} check={keywordCheckState[i][j]} after={count} className={`checkbox-count`} />
                                })}
                            </div>
                        </div>
                    )
                }))}
        </div>

    )
}