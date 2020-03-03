import { combineReducers } from 'redux';

import sessionErrorsReducer from './session_errors_reducer';
import decksErrorsReducer from './decks_errors_reducer';
import cardsErrorsReducer from './cards_errors_reducer';

export default combineReducers({
  session: sessionErrorsReducer,
  decks: decksErrorsReducer,
  cards: cardsErrorsReducer
});
