import React, {
    Component
} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {
    changeFromCurrencySelect,
    changeToCurrencySelect,
    changeFromValue,
    changeToValue
} from 'modules/exchange';
import CurrencySelect from 'components/CurrencySelect/index';
import CurrencyInput from 'components/CurrencyInput/index';

class ExchangePage extends Component {
    static propTypes = {
        fromCurrencySelect: PropTypes.string.isRequired,
        toCurrencySelect: PropTypes.string.isRequired,
        changeFromCurrencySelect: PropTypes.func.isRequired,
        changeToCurrencySelect: PropTypes.func.isRequired,
        changeFromValue: PropTypes.func.isRequired,
        changeToValue: PropTypes.func.isRequired,
        toValue: PropTypes.string.isRequired,
        fromValue: PropTypes.string.isRequired
    };

    render() {
        return (
            <div>
                <div>
                    <div>
                        From:
                        <CurrencySelect
                            value={this.props.fromCurrencySelect}
                            onChange={this.props.changeFromCurrencySelect} />
                        <CurrencyInput value={this.props.fromValue}
                                       onChange={value => this.props.changeFromValue(value)}/>
                    </div>
                    <div>
                        To:
                        <CurrencySelect
                            value={this.props.toCurrencySelect}
                            onChange={this.props.changeToCurrencySelect} />
                        <CurrencyInput value={this.props.toValue}
                                       onChange={value => this.props.changeToValue(value)}/>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const {fromValue, toValue, fromCurrencySelect, toCurrencySelect} = state;

    return {
        fromValue,
        fromCurrencySelect,
        toCurrencySelect,
        toValue
    }
};
export default connect(mapStateToProps, {
    changeFromCurrencySelect,
    changeToCurrencySelect,
    changeFromValue,
    changeToValue
})(ExchangePage);
