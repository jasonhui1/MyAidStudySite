import CheckBox from "../Checkbox";

interface AllArtistsCheckBoxesProps {
    artists: string[],
    artistCheckState: boolean[],
    setArtistCheckState: React.Dispatch<React.SetStateAction<boolean[]>>
}

export default function AllArtistsCheckBoxes({ artists, artistCheckState, setArtistCheckState }: AllArtistsCheckBoxesProps): JSX.Element {

    const handleArtistCheckbox = ((index: number): void => {
        //Maybe I want to select a range of all_artists later, currently the query only checks for AND
        const updatedArtistCheckState = artistCheckState.map((check, i) =>
            i === index ? !check : check
        );
        setArtistCheckState(updatedArtistCheckState);
    })


    return (
        <div className='grid grid-cols-3 lg:grid-cols-6 gap-4 outline p-4 '>
            {artists.map((name: string, i: number) => {
                return (
                    <CheckBox key={i} value={name} onChange={() => handleArtistCheckbox(i)} check={artistCheckState[i]} />
                )
            })}
        </div>
    )
}