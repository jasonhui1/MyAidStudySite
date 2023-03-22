import { BreakdownData } from '../TypeScript/BreakdownData';
import { useNavigate } from 'react-router-dom'
import { urlFor } from '../client';

interface BreakdownCardProps {
    data: BreakdownData;
    additionalClassname?: string;
}

export function BreakdownCard({ data, additionalClassname = '' }: BreakdownCardProps) {

    const { title, description, image, keywords } = data;
    const navigate = useNavigate()
    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation()
        navigate(`/breakdown/title/${title}`)
    }

    return (
        <div className={'card shadow-lg cursor-pointer rounded-3xl  bg-orange-100 hover:bg-orange-200 hover:scale-105 duration-1000 delay-200 ' + additionalClassname} onClick={(e)=>handleClick(e)}>
            {(image !== null) &&
                <img src={urlFor(image)
                    .auto('format')
                    .url()}
                    alt={title}
                    className='bg-contain p-4  rounded-3xl hover:opacity-95 duration-1000 delay-200'>

                </img>
            }
            <div className=' card-body gap-3 '>
                <h2 className=' font-semibold'> {title}</h2>
                <h4> {description}</h4>
                <h6 className=' font-bold'> Keywords</h6>
                <ul>
                    {keywords.map((word: string, i: number) => {
                        return <li key={i}>{word}</li>
                    })}
                </ul>

            </div>

        </div >
    )
}
