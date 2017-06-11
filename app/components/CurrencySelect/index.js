import React from 'react';
import Select from 'react-select';
import CURRENCIES_OPTIONS from 'constants/CURRENCIES_OPTIONS';

const CurrencySelect = ({onChange, value}) => {
    return (
        <Select
            value={value}
            options={CURRENCIES_OPTIONS}
            clearable={false}
            onChange={item => onChange(item.value)}/>
    );
};

export default CurrencySelect;
