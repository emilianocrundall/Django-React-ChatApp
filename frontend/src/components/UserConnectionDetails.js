import React from 'react'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import CloseIcon from '@material-ui/icons/Close'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import CheckIcon from '@material-ui/icons/Check'
import { useSelector, useDispatch } from 'react-redux'
import {
    send_connection_request,
    cancel_connection_request,
    accept_connection_request
} from '../actions/auth'

const UserConnectionDetails = ({user}) => {

    const dispatch = useDispatch()

    const array = useSelector(state => state.auth.all_type_connection)

    const type_of_connection = id => {
        if(array && array.find((connect) => connect.to_user.id === id && !connect.accepted)){
            return (
                <button onClick={() => dispatch(cancel_connection_request(id))}>
                    Cancel connection request <CloseIcon />
                </button>
            )
        } else if(array && array.find((connect) => connect.to_user.id === id && connect.accepted)){
            return (
                <span>Friends <CheckIcon /></span>
            )
        } else if(array && array.find((connect) => connect.from_user.id === id && !connect.accepted)){
            return (
                <button onClick={() => dispatch(accept_connection_request(id))}>
                    Accept connection request <PersonAddIcon />
                </button>
            )
        } else if(array && array.find((connect) => connect.from_user.id === id && connect.accepted)){
            return (
                <span>Friends <CheckIcon /></span>
            )
        } else{
            return (
                <button onClick={() => dispatch(send_connection_request(id))}>
                    Send connection request <ArrowForwardIcon />
                </button>
            )
        }
    }

    return (
        <div className='user_connection_details p-1'>
            <span>{user.username}</span>
            {type_of_connection(user.id)}
        </div>
    )
}

export default UserConnectionDetails
