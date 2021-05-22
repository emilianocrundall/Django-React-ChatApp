import Cookies from 'js-cookie'
import {
    LOADING,
    LOAD_USER,
    AUTH_ERROR,
    REG_SUCCESS,
    REG_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    CONNECTION_REQUEST_RECEIVED,
    ALL_TYPE_CONNECTIONS,
    SEND_CONNECTION_REQUEST,
    CANCEL_CONNECTION_REQUEST,
    ACCEPT_CONNECTION_REQUEST,
    GET_FRIENDS,
    LOADING_AUTH_CONTENT
} from '../actions/types'

const initialState = {
    loading: true,
    user: {},
    isAuthenticated: false,
    token: Cookies.get('token'),
    error: null,
    connection_request_received: [],
    all_type_connection: [],
    friends: [],
    loading_auth_content: false
}

export default function(state=initialState, action){
    switch(action.type){
        case LOADING:
            return {
                ...state,
                loading: true
            }
        case LOAD_USER:
            return {
                ...state,
                loading: false,
                user: action.payload,
                isAuthenticated: true,
                error: null
            }
        case REG_SUCCESS:
        case LOGIN_SUCCESS:
            Cookies.set('token', action.payload.token)
            return {
                loading: false,
                isAuthenticated: true,
                ...action.payload,
                error: null
            }
        case REG_FAIL:
        case LOGIN_FAIL:
        case AUTH_ERROR:
            Cookies.remove('token')
            return {
                loading: false,
                isAuthenticated: false,
                user: false,
                token: null,
                error: action.payload
            }
        case LOGOUT:
            Cookies.remove('token')
            return {
                loading: false,
                isAuthenticated: false,
                user: null,
                token: null,
                error: null
            }
        case CONNECTION_REQUEST_RECEIVED:
            return {
                ...state,
                connection_request_received: action.payload
            }
        case ALL_TYPE_CONNECTIONS:
            return {
                ...state,
                all_type_connection: action.payload
            }
        case SEND_CONNECTION_REQUEST:
            return {
                ...state,
                all_type_connection: [
                    ...state.all_type_connection,
                    action.payload
                ]
            }
        case CANCEL_CONNECTION_REQUEST:
            return {
                ...state,
                all_type_connection: [
                    ...state.all_type_connection.filter((connect) => connect.to_user.id !== action.payload)
                ]
            }
        case ACCEPT_CONNECTION_REQUEST:
            if(state.friends.length > 0){
                return {
                    ...state,
                    all_type_connection: [
                        ...state.all_type_connection.filter((cnt) => cnt.from_user.id !== action.payload.from_user.id),
                        action.payload
                    ],
                    connection_request_received: [
                        ...state.connection_request_received.filter((cnt) => cnt.from_user.id !== action.payload.from_user.id)
                    ],
                    friends: [
                        ...state.friends,
                        action.payload
                    ]
                }
            }else{
                return {
                    ...state,
                    all_type_connection: [
                        ...state.all_type_connection.filter((cnt) => cnt.from_user.id !== action.payload.from_user.id),
                        action.payload
                    ],
                    connection_request_received: [
                        ...state.connection_request_received.filter((cnt) => cnt.from_user.id !== action.payload.from_user.id)
                    ],
                    friends: action.payload
                }
            }
        case GET_FRIENDS:
            return {
                ...state,
                friends: action.payload,
                loading_auth_content: false
            }
        case LOADING_AUTH_CONTENT:
            return {
                ...state,
                loading_auth_content: true
            }
        default:
            return state
    }
}