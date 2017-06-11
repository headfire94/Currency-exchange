import React, {Component} from 'react';
import PropTypes from 'prop-types';
import s from './styles.scss';

class CurrencyInput extends Component {
    static propTypes = {
        value: PropTypes.string.isRequired,
        prefix: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired
    };

    handleChange(event) {
        event.preventDefault();
        this.props.onChange(event.target.value);
    }

    render() {
        return (
            <div className={s.input}>
                <input
                    className={s.input__control}
                    type="number"
                    step="0.5"
                    value={this.props.value}
                    onChange={e => this.handleChange(e)}
                />
            </div>
        );
    }
}

export default CurrencyInput;
