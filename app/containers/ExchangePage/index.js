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

import s from './styles.scss';

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
            <div className={s.exchangePage}>
                    <div className={s.exchangePage__from}>
                        From:
                        <CurrencySelect
                            value={this.props.fromCurrencySelect}
                            onChange={this.props.changeFromCurrencySelect} />
                        <CurrencyInput value={this.props.fromValue}
                                       onChange={value => this.props.changeFromValue(value)}/>
                        <div>
                            1 {this.props.fromCurrencySelect} = {this.props.exchangeFrom} {this.props.toCurrencySelect}
                        </div>
                    </div>
                    <div className={s.exchangePage__to}>
                        To:
                        <CurrencySelect
                            value={this.props.toCurrencySelect}
                            onChange={this.props.changeToCurrencySelect} />
                        <CurrencyInput value={this.props.toValue}
                                       onChange={value => this.props.changeToValue(value)}/>
                        <div>
                              1 {this.props.toCurrencySelect} = {this.props.exchangeTo} {this.props.fromCurrencySelect}
                        </div>
                    </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const {fromValue, toValue, fromCurrencySelect, toCurrencySelect, exchangeRate: {exchangeTo, exchangeFrom}} = state;

    return {
        fromValue,
        fromCurrencySelect,
        toCurrencySelect,
        toValue,
        exchangeFrom,
        exchangeTo
    }
};
export default connect(mapStateToProps, {
    changeFromCurrencySelect,
    changeToCurrencySelect,
    changeFromValue,
    changeToValue
})(ExchangePage);
