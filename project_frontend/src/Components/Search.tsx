
import { IoMdSearch } from 'react-icons/io';

interface SearchProps {
    searchTerm: string,
    setSearchTerm: (value: React.SetStateAction<string>) => void

}

export default function Search({ searchTerm, setSearchTerm }: SearchProps) {

    return (
        <div className="flex gap-2 items-center rounded-md bg-white border-none outline focus-within:shadow-sm">
            <IoMdSearch fontSize={21} className="ml-1" />

            {/* Search bar */}
            <input
                type="text"
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Simulation"
                value={searchTerm}
                className="p-2 w-full bg-white outline-none"
            />
        </div>
    )
}
