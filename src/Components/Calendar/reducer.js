import {ADD_EVENT} from './action'

export default function reducer(state={event:[]},action){
    
    switch (action.type) {
        case ADD_EVENT:
          return Object.assign({}, state, {
            visibilityFilter: action.filter
          })
        default:
          return state
      }



}