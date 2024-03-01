import { CheckboxState } from "../../Pages/Inspirations";
import { CategoryData, KeywordData } from "../../TypeScript/InspirationData";
import CheckBox from "../Checkbox";

interface KeywordsCheckBoxesProps {
    keywordCheckState: CheckboxState
    setKeywordCheckState: React.Dispatch<React.SetStateAction<CheckboxState>>

}

export default function KeywordsCheckBoxes({ keywordCheckState, setKeywordCheckState }: KeywordsCheckBoxesProps) {

    // const handleCategoryCheckbox = ((index: number): void => {
    //     const updatedCategoriesCheckState = categoriesCheckState.map((check, i) =>
    //         i === index ? !check : check
    //     );
    //     const isChecked = updatedCategoriesCheckState[index]
    //     setCategoryCheckState(updatedCategoriesCheckState)

    //     //Checks/ unchecks all related keywords
    //     const updatedKeywordCheckState = keywordCheckState.map((row, i) => {
    //         if (!(i === index)) return row

    //         return row.map((_) => isChecked)
    //     });
    //     setKeywordCheckState(updatedKeywordCheckState);

    // })

    const handleKeywordCheckbox = ((category: string, word: string): void => {
        setKeywordCheckState(prevState => {
            const newState = { ...prevState };
            newState[category] = { ...newState[category] };
            newState[category][word] = { ...newState[category][word], checked: !newState[category][word].checked };
            return newState;
        });
    })

    return (
        <div className='grid grid-cols-3 justify-start gap-4 outline p-2 '>
            {Object.keys(keywordCheckState).map((category, i) => {
                return (
                    <div key={i}>
                        {/* <CheckBox value={category} onChange={() => handleCategoryCheckbox(category)} check={categoriesCheckState[i]} />
                        <hr className=' bg-black' />
                        <div className='grid grid-cols-2 gap-4 shadow-md p-4 '>
                            {all_keywords[i].map(({ word, count }: KeywordData, j) => {
                                if (count === 0) return <></>
                                return <CheckBox key={j} value={word} onChange={() => handleKeywordCheckbox(i, j)} check={keywordCheckState[i][j]} after={count} className={`checkbox-count`} />
                            })}
                        </div> */}
                        <KeywordCheckboxes category={category} keywords={keywordCheckState[category]} handleKeywordCheckbox={handleKeywordCheckbox} />
                    </div>
                )
            })}
        </div>

    )
}
interface KeywordCheckboxesProps {
    category: string
    keywords: { [word: string]: { checked: boolean; count: number } };
    handleKeywordCheckbox: (category: string, word: string) => void;
}
function KeywordCheckboxes({ category, keywords, handleKeywordCheckbox }: KeywordCheckboxesProps) {

    return (
        <div className='grid grid-cols-2 gap-4 shadow-md p-4' >
            {
                Object.entries(keywords).map(([word, { checked, count }], i) => (
                    <CheckBox
                        key={i}
                        value={word}
                        onChange={() => handleKeywordCheckbox(category, word)}
                        check={checked}
                        after={count}
                        className={`checkbox-count`}
                    />
                ))
            }
        </div >
    )
}