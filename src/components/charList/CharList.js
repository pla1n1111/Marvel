import { Component } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import './charList.scss';

class CharList extends Component{
    state = {
        chars: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false
    }

    marvelService = new MarvelService();

    itemRefs = [];

    setRef = (ref) => {
        this.itemRefs.push(ref);
    }

    focusOnItem = (id) => {
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }

    renderAllCharcs = (arr) => {
        const items = arr.map((item, i) => {
            let imgStyle;
            if (item.thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg") {
                imgStyle = {'objectFit': 'contain'};
            } else {
                imgStyle = {'objectFit': 'cover'};              
            }
            return (
                <li tabIndex={0} className="char__item"
                    key={item.id}
                    ref={this.setRef}
                    onClick={() => { this.props.onCharSelected(item.id);
                                     this.focusOnItem(i);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                            this.props.onCharSelected(item.id);
                            this.focusOnItem(i);
                        }
                    }}>
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                </li>
            )
        });

        return (
            <ul className='char__grid'>
                {items}
            </ul>
        )
    }

    componentDidMount() {
        this.onRequest();
    }

    onRequest = (offset) => {
        this.onCharsLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharsLoaded)
            .catch(this.onError);
    }

    onCharsLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onCharsLoaded = (newChars) => {
        let ended = false;
        if (newChars.length < 9) {
            ended = true;
        }

        this.setState(({offset, chars}) => ({
            chars: [...chars, ...newChars],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }));
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        });
    }

    render() {
        const {chars, loading, error, offset, newItemLoading, charEnded} = this.state;
        const items = this.renderAllCharcs(chars);
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': charEnded ? 'none' : 'block'}}
                    onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func
}

export default CharList;