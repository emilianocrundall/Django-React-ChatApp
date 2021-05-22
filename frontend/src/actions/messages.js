import {
    GET_CHATS, LOADING_CONTENT
} from './types'
import axios from 'axios'
import { token_config } from './auth'
import moment from 'moment'

export const format_date = date => {
    let simple_date = moment(date).format("MMM D, YYYY")
    let today = moment().format('ll')

    if(simple_date === today){
        let hour = moment(date).format('h:mm a')
        return hour
    } else{
        let new_date = moment(date).format('MMMM Do YYYY, h:mm a')
        return new_date
    }
}

export const get_chats = () => (dispatch, getState) => {
    dispatch({type: LOADING_CONTENT})
    axios
    .get('/api/user_chats/', token_config(getState))
    .then((res) => {
        dispatch({
            type: GET_CHATS,
            payload: res.data
        })
    }).catch((err) => {console.log(err)})
}
