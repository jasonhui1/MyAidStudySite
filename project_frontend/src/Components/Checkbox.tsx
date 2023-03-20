import React from 'react'

interface CheckBoxProp {
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    check?: boolean;
    after?:number|string;
    className?: string;

}

export default function CheckBox({ value, onChange, check = false, after='', className='' }: CheckBoxProp): JSX.Element {

    return (
        <div data-after={after} className={className} >
            <label>
                <input type="checkbox" name='keyword' value={value} onChange={onChange} checked={check} /> {value}
            </label>
        </div>
    )
}
