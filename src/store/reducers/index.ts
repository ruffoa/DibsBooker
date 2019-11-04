import { combineReducers } from 'redux';
import dibs from './dibs';
import roomState from './rooms';
import user from './user';

const reducers = combineReducers({
  dibs,
  roomState,
  user
});

export default reducers;
