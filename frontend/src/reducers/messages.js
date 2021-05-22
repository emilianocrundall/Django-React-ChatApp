import {
    GET_CHATS,
    LOADING_CONTENT
} from '../actions/types'

const initialState = {
    chats: [],
    loading_content: false
}

export default function(state=initialState, action){
    switch(action.type){
        case LOADING_CONTENT:
            return {
                ...state,
                loading_content: true
            }
        case GET_CHATS:
            return {
                ...state,
                chats: action.payload,
                loading_content: false
            }
        default:
            return state
    }
}