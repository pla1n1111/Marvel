import { Component } from 'react';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import './charList.scss';

class CharList extends Component{
    state = {
        chars: [],
        loading: true,
        error: false
    }

    marvelService = new MarvelService();

    renderAllCharcs = (arr) => {
        const items = arr.map(item => {
            let imgStyle;
            if (item.thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg") {
                imgStyle = {'objectFit': 'contain'};
            } else {
                imgStyle = {'objectFit': 'cover'};              
            }
            return (
                <li className="char__item"
                    key={item.id}>
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
        this.updateChars();
    }

    onCharsLoaded = (chars) => {
        this.setState({
            chars,
            loading: false
        });
    }

    onCharsLoading = () => {
        this.setState({
            loading: true
        })
    }

    updateChars = () => {
        this.onCharsLoading();
        this.marvelService
            .getAllCharacters()
            .then(this.onCharsLoaded)
            .catch(this.onError);
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        });
    }

    render() {
        const {chars, loading, error} = this.state;
        const items = this.renderAllCharcs(chars);
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;