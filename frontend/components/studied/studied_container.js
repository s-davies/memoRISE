import { connect } from 'react-redux';
import { fetchDecks } from '../../actions/deck_actions';
import { fetchDeckStudy, deleteDeckStudy, createDeckStudy } from '../../actions/deck_study_actions'
import { fetchCards } from '../../actions/card_actions';
import { fetchUsers } from '../../actions/session_actions';
import Studied from './studied';

const mapStateToProps = (state, ownProps) => {
  let allDecks = Object.keys(state.entities.decks).map(key => state.entities.decks[key]);
  let visibleDecks = [];
  let createdDecksCt = 0;
  for (let i = 0; i < allDecks.length; i++) {
    const deck = allDecks[i];
    if (deck.ownerId === parseInt(ownProps.ownProps.match.params.userId)
      && (deck.visibility === "Everyone" || (deck.visibility === "Just me" && parseInt(ownProps.ownProps.match.params.userId) === state.entities.users[state.session.id].id))) {
      createdDecksCt += 1;
      visibleDecks.push(deck);
    }
  }

  return {
    decks: visibleDecks,
    deckStudy: Object.values(state.entities.deckStudies)[0],
    createdDecksCount: createdDecksCt,
    users: state.entities.users,
    currentUser: state.entities.users[state.session.id],
    user: state.entities.users[ownProps.ownProps.match.params.userId]
  }
};

const mapDispatchToProps = dispatch => ({
  fetchDecks: (optUserId) => dispatch(fetchDecks(optUserId)),
  fetchCards: (deckId) => dispatch(fetchCards(deckId)),
  fetchUsers: () => dispatch(fetchUsers()),
  fetchDeckStudy: deckId => dispatch(fetchDeckStudy(deckId)),
  deleteDeckStudy: deckStudyId => dispatch(deleteDeckStudy(deckStudyId)),
  createDeckStudy: deckStudy => dispatch(createDeckStudy(deckStudy))
});

export default connect(mapStateToProps, mapDispatchToProps)(Studied);