import { CheckboxState } from "../../Pages/Inspirations";
import { ArtistData } from "../../TypeScript/InspirationData";
import CheckBox from "../Checkbox";

interface ArtistsCheckBoxesProps {
    artistCheckState: CheckboxState,
    setArtistCheckState: React.Dispatch<React.SetStateAction<CheckboxState>>

}
export default function ArtistsCheckBoxes({ artistCheckState, setArtistCheckState }: ArtistsCheckBoxesProps) {

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
        setArtistCheckState(prevState => {
            const newState = { ...prevState };
            newState[category] = { ...newState[category] };
            newState[category][word] = { ...newState[category][word], checked: !newState[category][word].checked };
            return newState;
        });
    })

    return (
        <div className=''>
            {Object.keys(artistCheckState).map((category, i) => {
                return (
                    <div key={i} className="">
                        {/* <CheckBox value={category} onChange={() => handleCategoryCheckbox(category)} check={categoriesCheckState[i]} />
                        <hr className=' bg-black' />
                        <div className='grid grid-cols-2 gap-4 shadow-md p-4 '>
                            {all_keywords[i].map(({ word, count }: KeywordData, j) => {
                                if (count === 0) return <></>
                                return <CheckBox key={j} value={word} onChange={() => handleKeywordCheckbox(i, j)} check={keywordCheckState[i][j]} after={count} className={`checkbox-count`} />
                            })}
                        </div> */}
                        <ArtistCheckboxes category={category} names={artistCheckState[category]} handleKeywordCheckbox={handleKeywordCheckbox} />
                    </div>
                )
            })}
        </div>

    )
}
interface ArtistCheckboxesProps {
    category: string
    names: { [name: string]: { checked: boolean; count: number } };
    handleKeywordCheckbox: (category: string, word: string) => void;
}
function ArtistCheckboxes({ category, names, handleKeywordCheckbox }: ArtistCheckboxesProps) {

    console.log('names :>> ', names);

    return (
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 outline p-4">
            {
                Object.entries(names).map(([word, { checked, count }], i) => (
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
