import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { get_chats } from '../actions/messages'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import { format_date } from '../actions/messages'
import SmallLoader from './common/SmallLoader'

const Chats = ({chats, get_chats, user, loading_content, chat_style}) => {

    useEffect(() => {
        get_chats()
    }, [])

    if(loading_content){
        return (
            <div className={chat_style ? chat_style : 'p-2 chats'}>
                <SmallLoader />
            </div>
        )
    }
    return(
        <div className={chat_style ? chat_style : 'p-2 chats'}>
            <h2 className='font-normal p-1'>Chats</h2>
            {chats && chats.length > 0 ? (
                chats.map((chat) => (
                    chat.connection ? (
                        chat.connection.from_user.username == user.username ? (
                            <Link key={chat.id} to={`/chats/${chat.id}`} className='sec-chat-link p-1'>
                                <p>
                                    <AccountCircleIcon/>
                                    {chat.connection.to_user.username}
                                </p>
                                <span>{format_date(chat.last_modification)}</span>
                            </Link>
                        ) : (
                            <Link key={chat.id} to={`/chats/${chat.id}`} className='sec-chat-link p-1'>
                                <p>
                                    <AccountCircleIcon/>
                                    {chat.connection.from_user.username}
                                </p>
                                <span>{format_date(chat.last_modification)}</span>
                            </Link>
                        )
                    ) : null
                ))
            ) : (
                <div className='p-2 flex-cont'>
                    <h2 className='font-normal mb-2'>There's no recent chats to show</h2>
                    <Link to='/connect'>
                        <span>Start one</span>
                        <ArrowForwardIcon />
                    </Link>
                </div>
            )}
        </div>
    )
}

const mapStateToProps = state => ({
    chats: state.messages.chats,
    user: state.auth.user,
    loading_content: state.messages.loading_content
})

export default connect(mapStateToProps, {get_chats})(Chats)
