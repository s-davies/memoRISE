import React from 'react';
import {
  Link,
  NavLink,
  Redirect
} from 'react-router-dom';

class Search extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      decks: [],
      decksSorted: false,
      redirect: null,
      usersLoaded: false
    }
  }

  componentDidMount() {
    // debugger
    this.props.searchDecks(this.props.match.params.searchTerm);
    this.props.fetchCards();
    this.props.fetchUsers().then(() => this.setState({usersLoaded: true}));
  }


  render() {
    if (!this.state.usersLoaded) return null;

    return (
      <div className="search">
        <div className="search-inner">
          {this.props.decks.map(deck => (
            <div key={deck.id} className="search-deck">
              <div className="search-deck-info">
                <div>
                  <p>{deck.cardCount} terms</p>
                  <Link to={`/${deck.ownerId}/created`}>{this.props.users[deck.ownerId].username}</Link>
                </div>
                <p>{deck.title}</p>
              </div>
              <div className="search-cards">
                {deck["1"] ? 
                  <div>
                    <h4>{deck["1"].term}</h4>
                    <p>{deck["1"].definition}</p>
                  </div>
                  : ""}
                {deck["2"] ?
                  <div>
                    <h4>{deck["2"].term}</h4>
                    <p>{deck["2"].definition}</p>
                  </div>
                  : ""}
                {deck["3"] ?
                  <div>
                    <h4>{deck["3"].term}</h4>
                    <p>{deck["3"].definition}</p>
                  </div>
                  : ""}
                {deck["4"] ?
                  <div>
                    <h4>{deck["4"].term}</h4>
                    <p>{deck["4"].definition}</p>
                  </div>
                  : ""}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default Search;