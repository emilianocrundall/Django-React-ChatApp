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
    SEND_CONNECTION_REQUEST,
    ALL_TYPE_CONNECTIONS,
    CANCEL_CONNECTION_REQUEST,
    ACCEPT_CONNECTION_REQUEST,
    GET_FRIENDS,
    LOADING_AUTH_CONTENT
} from './types'
import axios from 'axios'

export const token_config = (getState) => {
    
    const token = getState().auth.token

    let config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    if(token){
        config.headers['Authorization'] = `Token ${token}`
    }

    return config
}

export const load_user = () => (dispatch, getState) => {
    dispatch({type: LOADING})
    axios
    .get('/api/load_user', token_config(getState))
    .then((res) => {
        dispatch({
            type: LOAD_USER,
            payload: res.data
        })
    }).catch((err) => {
        dispatch({
            type: AUTH_ERROR,
            payload: err.response.data
        })
    })
}

export const register = ({username, email, password}) => (dispatch, getState) => {

    let form = JSON.stringify({username, email, password})

    axios
    .post('/api/register', form, token_config(getState))
    .then((res) => {
        dispatch({
            type: REG_SUCCESS,
            payload: res.data
        })
    }).catch((err) => {
        dispatch({
            type: REG_FAIL,
            payload: err.response.data
        })
    })
}

export const login = (username, password) => (dispatch, getState) => {
    
    let form = JSON.stringify({username, password})
    axios
    .post('/api/login', form, token_config(getState))
    .then((res) => {
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        })
    }).catch((err) => {
        dispatch({
            type: LOGIN_FAIL,
            payload: err.response.data
        })
    })
}

export const logout = () => (dispatch, getState) => {
    axios
    .post('/api/logout', null, token_config(getState))
    .then((res) => {
        dispatch({
            type: LOGOUT
        })
    }).catch((err) => {
        console.log(err)
    })
}

export const get_connection_request_received = () => (dispatch, getState) => {
    axios
    .get('/api/connection_request_received/', token_config(getState))
    .then((res) => {
        dispatch({
            type: CONNECTION_REQUEST_RECEIVED,
            payload: res.data
        })
    }).catch((err) => {
        console.log(err)
    })
}

export const get_all_type_connections = () => (dispatch, getState) => {
    axios
    .get('/api/all_type_connections/', token_config(getState))
    .then((res) => {
        dispatch({
            type: ALL_TYPE_CONNECTIONS,
            payload: res.data
        })
    }).catch((err) => {
        console.log(err)
    })
}

export const send_connection_request = id => (dispatch, getState) => {
    axios
    .post(`/api/send_connection_request/${id}/`, null, token_config(getState))
    .then((res) => {
        if(res.status === 201){
            dispatch({
                type: SEND_CONNECTION_REQUEST,
                payload: res.data
            })
        }
    }).catch((err) => {console.log(err)})
}

export const cancel_connection_request = id => (dispatch, getState) => {
    axios
    .delete(`/api/cancel_connection_request/${id}/`, token_config(getState))
    .then((res) => {
        if(res.status === 200){
            dispatch({
                type: CANCEL_CONNECTION_REQUEST,
                payload: id
            })
        }
    }).catch((err) => {console.log(err)})
}

export const accept_connection_request = id => (dispatch, getState) => {
    axios
    .put(`/api/accept_connection_request/${id}/`, null, token_config(getState))
    .then((res) => {
        dispatch({
            type: ACCEPT_CONNECTION_REQUEST,
            payload: res.data
        })
    }).catch((err) => {console.log(err)})
}

export const get_friends = () => (dispatch, getState) => {
    dispatch({type: LOADING_AUTH_CONTENT})
    axios
    .get('/api/get_friends/', token_config(getState))
    .then((res) => {
        dispatch({
            type: GET_FRIENDS,
            payload: res.data
        })
    }).catch((err) => {console.log(err)})
}