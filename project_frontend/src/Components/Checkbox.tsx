import React from 'react'

interface CheckBoxProp {
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    check?: boolean;

}

export default function CheckBox({ value, onChange, check = false }: CheckBoxProp): JSX.Element {

    return (
        <div>
            <label>
                <input type="checkbox" name='keyword' value={value} onChange={onChange} checked={check} /> {value}
            </label>
        </div>
    )
}
