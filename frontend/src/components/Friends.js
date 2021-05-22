import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router'
import { get_all_type_connections, get_friends } from '../actions/auth'
import ConnectionRequestDetails from './ConnectionRequestDetails'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import axios from 'axios'
import SmallLoader from './common/SmallLoader'

const Friends = ({friends, get_friends, user, token, loading_auth_content}) => {

    useEffect(() => {
        get_friends()
        get_all_type_connections()
    }, [])

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        }
    }

    const history = useHistory()

    const handleRedirect = id => {
        axios
        .get(`/api/find_chat/${id}/`, config)
        .then((res) => {
            if(Object.keys(res.data).length > 0){
                history.push(`/chats/${res.data.id}`)
            }
        }).catch((err) => {
            console.log(err)
        })
    }
    if(loading_auth_content){
        return(
            <div className='main'>
                <div className='connect'>
                    <div className='bg-light-grey p-2'>
                        <SmallLoader />
                    </div>
                    <ConnectionRequestDetails />
                </div>
            </div>
        )
    }
    return (
        <div className='main'>
            <div className='connect'>
                <div className='bg-light-grey p-2'>
                    <h2 className='font-normal mb-2'>Friends</h2>
                    {friends && friends.length > 0 ? (
                        friends.map((connect) => (
                            <button
                                key={connect.id}
                                onClick={() => handleRedirect(connect.id)}
                                className='chat-link p-1'
                            >
                                <AccountCircleIcon />
                                {connect.from_user ? (
                                    connect.from_user.id === user.id ? (
                                        <span>{connect.to_user.username}</span>
                                    ) : (
                                        <span>{connect.from_user.username}</span>
                                    )
                                ) : null }
                            </button>
                        ))
                    ) : (
                        <h2 className='p-2 font-normal'>Seems like you have no friends yet</h2>
                    )}
                </div>
                <ConnectionRequestDetails />
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    friends: state.auth.friends,
    user: state.auth.user,
    token: state.auth.token,
    loading_auth_content: state.auth.loading_auth_content
})

export default connect(mapStateToProps, {get_friends, get_all_type_connections})(Friends)
