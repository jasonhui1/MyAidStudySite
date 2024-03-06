import { CheckboxState } from "../../Pages/Inspirations";
import CheckBox from "../Checkbox";

interface ArtistsCheckBoxesProps {
    artistCheckState: CheckboxState,
    setArtistCheckState: React.Dispatch<React.SetStateAction<CheckboxState>>

}
export default function ArtistsCheckBoxes({ artistCheckState, setArtistCheckState }: ArtistsCheckBoxesProps) {

    const handleCategoryCheckbox = ((category: string) => {
        //Checks/ unchecks all related keywords
        const all_checked = Object.values(artistCheckState[category]).every(word => word.checked)

        setArtistCheckState(prevState => {
            const newState = { ...prevState };
            Object.keys(newState[category]).forEach(word => {
                newState[category][word] = { ...newState[category][word], checked: !all_checked };
            });
            return newState;
        });
    })

    const handleKeywordCheckbox = ((category: string, word: string): void => {
        setArtistCheckState(prevState => {
            const newState = { ...prevState };
            newState[category] = { ...newState[category] };
            newState[category][word] = { ...newState[category][word], checked: !newState[category][word].checked };
            return newState;
        });
    })

    return (
        <div className='outline p-4 gap-4 flex flex-col'>
            {Object.keys(artistCheckState).map((category, i) => {
                const words = artistCheckState[category]
                return (
                    <div key={i} className="">
                        <CheckBox value={category} onChange={() => handleCategoryCheckbox(category)} check={Object.values(words).every(word => word.checked)} />
                        <hr className=' bg-black' />
                        <ArtistCheckboxes category={category} names={words} handleKeywordCheckbox={handleKeywordCheckbox} />
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

    return (
        <div className="grid grid-cols-3 lg:grid-cols-5 gap-4 shadow-md p-4 ">
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
