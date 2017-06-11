import React, {Component} from 'react';
import PropTypes from 'prop-types';

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
            <input
                type="number"
                step="0.5"
                value={this.props.value}
                onChange={e => this.handleChange(e)}
            />
        );
    }
}

export default CurrencyInput;
