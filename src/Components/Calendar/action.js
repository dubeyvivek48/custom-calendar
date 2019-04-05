export  const ADD_EVENT = 'ADD_EVENT'

export function AddEvent(payload){

    return{
     Type : ADD_EVENT,
     payload
    }
}