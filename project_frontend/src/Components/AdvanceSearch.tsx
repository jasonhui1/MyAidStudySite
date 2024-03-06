import { useState } from "react";

interface AdvancedSearchProps {
    children: React.ReactNode;
}
export function AdvancedSearch({ children }: AdvancedSearchProps) {
    const [openAdvSetting, setOpenAdvSetting] = useState(true);

    return (
        <div>
            <button className="btn btn-outline" onClick={() => setOpenAdvSetting(!openAdvSetting)}>
                {openAdvSetting ? 'Close' : 'Open'} Advanced Search
            </button>
            {openAdvSetting && <div className="flex flex-col gap-2">{children}</div>}
        </div>
    );
};
