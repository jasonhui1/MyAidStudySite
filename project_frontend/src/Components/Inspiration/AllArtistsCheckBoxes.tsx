import { ArtistData } from "../../TypeScript/InspirationData";
import CheckBox from "../Checkbox";

interface AllArtistsCheckBoxesProps {
    artists: ArtistData[],
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
            {artists.map(({ name, count }: ArtistData, i: number) => {
                if (count === 0) return <></>
                return (

                    <div className='relative' key={i}>

                        <CheckBox value={name} onChange={() => handleArtistCheckbox(i)} check={artistCheckState[i]} after={count} className={`checkbox-count`} />
                        {/* <span className='absolute bottom-0 right-5 w-10 h-10 bg-white rounded-full flex justify-center items-center'>{count}</span> */}
                    </div>
                )
            })}
        </div>
    )
}
