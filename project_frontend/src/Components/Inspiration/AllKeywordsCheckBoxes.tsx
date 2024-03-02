import { CheckboxState } from "../../Pages/Inspirations";
import { CategoryData, KeywordData } from "../../TypeScript/InspirationData";
import CheckBox from "../Checkbox";

interface KeywordsCheckBoxesProps {
    keywordCheckState: CheckboxState
    setKeywordCheckState: React.Dispatch<React.SetStateAction<CheckboxState>>

}

export default function KeywordsCheckBoxes({ keywordCheckState, setKeywordCheckState }: KeywordsCheckBoxesProps) {
    const handleCategoryCheckbox = ((category: string) => {
        //Checks/ unchecks all related keywords
        const all_checked = Object.values(keywordCheckState[category]).every(word => word.checked)

        setKeywordCheckState(prevState => {
            const newState = { ...prevState };
            Object.keys(newState[category]).forEach(word => {
                newState[category][word] = { ...newState[category][word], checked: !all_checked };
            });
            return newState;
        });
    })

    const handleKeywordCheckbox = ((category: string, word: string): void => {
        setKeywordCheckState(prevState => {
            const newState = { ...prevState };
            newState[category] = { ...newState[category] };
            newState[category][word] = { ...newState[category][word], checked: !newState[category][word].checked };
            return newState;
        });
    })

    return (
        <div className='grid grid-cols-3 justify-start gap-4 outline p-2'>
            {Object.keys(keywordCheckState).map((category, i) => {
                const words = keywordCheckState[category]
                return (
                    <div key={i} className="">
                        <CheckBox value={category} onChange={() => handleCategoryCheckbox(category)} check={Object.values(words).every(word => word.checked)} />
                        <hr className=' bg-black' />
                        <KeywordCheckboxes category={category} keywords={words} handleKeywordCheckbox={handleKeywordCheckbox} />
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