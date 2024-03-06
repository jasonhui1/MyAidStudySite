import { useMemo } from "react";
import TwitterVideoEmbed from "../TwitterVideoEmbed";
import YoutubeEmbed from "../YoutubeEmbed";

interface EmbedProp {
    embedURL: string;
}

export default function EmbedRenderer({ embedURL }: EmbedProp) {
    const { mediaType, postId } = useMemo(() => getEmbedDetails(embedURL), [embedURL]);

    const renderEmbed = () => {
        switch (mediaType) {
            case 'Twitter':
                return <TwitterVideoEmbed key={postId} id={postId!} className='w-full mx-auto' />;
            case 'YouTube':
                return <YoutubeEmbed src={`https://www.youtube.com/embed/${postId}`} />;
            default:
                return null;
        }
    };

    return <>{renderEmbed()}</>;
};


function getTweetIdFromUrl(url: string) {
    const regex = /\/status\/(\d+)/;
    const match = url.match(regex);
    return match && match.length > 1 ? match[1] : null;
};

function getYoutubeIdFromUrl(url: string) {
    return url.split('?v=').pop()?.split('&')[0] || null;
}

export const getEmbedDetails = (embedURL: string) => {
    if (embedURL.includes('twitter')) {
        const postId = getTweetIdFromUrl(embedURL);
        return { mediaType: 'Twitter', postId };
    } else {
        const postId = getYoutubeIdFromUrl(embedURL);
        return { mediaType: 'YouTube', postId };
    }
};
