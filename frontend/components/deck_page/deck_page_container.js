import { connect } from 'react-redux';
import { fetchDeck, deleteDeck } from '../../actions/deck_actions';
import { fetchCards } from '../../actions/card_actions';
import { fetchDeckStudy, fetchDeckStudies, updateDeckStudy } from '../../actions/deck_study_actions';
import { fetchUsers } from '../../actions/session_actions';
import { fetchCardStudies } from '../../actions/card_study_actions';
import DeckPage from './deck_page'

const mapStateToProps = (state, ownProps) => {
    let creator = state.entities.decks[ownProps.match.params.deckId] === undefined ? {} : state.entities.users[state.entities.decks[ownProps.match.params.deckId].ownerId]
    // debugger
    let deckStudies = Object.values(state.entities.deckStudies);
    let ratSum = 0
    let ratCount = 0
    for (let i = 0; i < deckStudies.length; i++) {
        const deckStudy = deckStudies[i];
        if (deckStudy.rating) {
            ratSum += deckStudy.rating
            ratCount += 1;
        }
    }
    let avgRating;
    if (ratCount === 0) {
        avgRating = 0;
    } else {
        let avgRatingUnrounded = ratSum / ratCount;
        avgRating = (Math.round(avgRatingUnrounded * 10) / 10).toFixed(1);
    }

    //assigning card study information to cards
    let cards = Object.keys(state.entities.cards).map(key => state.entities.cards[key]);
    let cardKeys = {};
    let cardStudies = Object.values(state.entities.cardStudies);
    if (Object.values(cardStudies).length > 0 && cards.length === cardStudies.length) {
        for (let i = 0; i < cardStudies.length; i++) {
            const cardStudy = cardStudies[i];
            cardKeys[cardStudy.cardId] = cardStudy;
        }
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            card.cardStudyId = cardKeys[card.id].id;
            card.starred = cardKeys[card.id].starred;
            card.correctnessCount = cardKeys[card.id].correctnessCount;
        }
    }
    /////
    return {
        deck: state.entities.decks[ownProps.match.params.deckId],
        cards: cards.sort((a, b) => (a.order > b.order) ? 1 : -1),
        deckStudies: deckStudies,
        creator: creator,
        currentUser: state.entities.users[state.session.id],
        avgRating: avgRating,
        numRatings: ratCount
        // deckStudies: Object.values(state.entities.deckStudies)
    }
};

const mapDispatchToProps = dispatch => ({
    fetchDeck: deckId => dispatch(fetchDeck(deckId)),
    deleteDeck: deckId => dispatch(deleteDeck(deckId)),
    fetchCards: (deckId) => dispatch(fetchCards(deckId)),
    fetchDeckStudy: (deckId) => dispatch(fetchDeckStudy(deckId)),
    fetchDeckStudies: (deckId) => dispatch(fetchDeckStudies(deckId)),
    updateDeckStudy: (deckStudy) => dispatch(updateDeckStudy(deckStudy)),
    fetchUsers: () => dispatch(fetchUsers()),
    fetchCardStudies: deckId => dispatch(fetchCardStudies(deckId))
});

export default connect(mapStateToProps, mapDispatchToProps)(DeckPage);