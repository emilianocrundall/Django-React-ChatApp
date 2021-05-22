import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useParams, useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import SendIcon from '@material-ui/icons/Send'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Chats from './Chats'
import { format_date } from '../actions/messages'
import SmallLoader from './common/SmallLoader'

const Chat = ({user, token}) => {

    const [ connection, setConnection ] = useState({})
    const [ loading, setLoading ] = useState(true)
    const [ message, setMessage ] = useState('')
    const [ messages, setMessages ] = useState([])

    const messagesEnd = useRef(null)
    const socket = useRef(null)

    const config = {
        headers : {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        }
    }

    const { id } = useParams()
    const history = useHistory()

    useEffect(() => {
        if (messagesEnd) {
            messagesEnd.current.addEventListener('DOMNodeInserted', event => {
                const { currentTarget: target } = event
                target.scroll({ top: target.scrollHeight, behavior: 'smooth' })
            })
        }
    }, [])
    
    useEffect(() => {
        axios
        .get(`/api/get_valid_user/${id}/`, config)
        .then((res) => {
            if(res.status === 401){
                history.push('/')
            } else if(res.status === 200){
                setLoading(false)
                setConnection(res.data)
            }
        }).catch((err) => {console.log(err)})

        socket.current = new WebSocket(`ws://${window.location.host}/ws/chats/${id}/?token=${token}`)

        socket.current.onmessage = e => {
            let data = JSON.parse(e.data)
            if(Array.isArray(data)){
                setMessages(data)
            } else {
                setMessages(prev => [ ...prev, data ])
            }
        }
        socket.current.onopen = e => {
            setLoading(false)
            socket.current.send(JSON.stringify({'type': 'chat_messages'}))
        }
        socket.current.onclose = e => {
            console.log(e)
        }
        
    }, [id])

    const sendMessage = e => {
        e.preventDefault()
        socket.current.send(JSON.stringify({'text': message}))
        setMessage('')
    }

    const valid_form = message !== '' ? (
        <button className='p-1'>
            <SendIcon />
        </button>
    ) : (
        <button className='p-1' disabled>
            <SendIcon />
        </button>
    )
    if(loading){
        return (
            <div className='main'>
                <div className='connect chat-container'>
                    <div className='bg-light-grey' ref={messagesEnd}>
                        <div className='messages p-2'>
                            <SmallLoader />
                        </div>
                    </div>
                    <Chats />
                </div>
            </div>
        )
    }
    return (
        <div className='main'>
            <div className='connect chat-container'>
                <div className='bg-light-grey' ref={messagesEnd}>
                    <div className='user-chat-details p-2'> 
                        {Object.keys(connection).length > 0 ? (
                            connection.to_user.id === user.id ? (
                                <React.Fragment>
                                    <h3 className='font-normal'>
                                        <AccountCircleIcon/>
                                        {connection.from_user.username}
                                    </h3>
                                    <button className='btn go-back' onClick={() => history.goBack()}>
                                        <ArrowBackIcon />
                                    </button>
                                </React.Fragment>
                            ) : connection.from_user.id === user.id ? (
                                <React.Fragment>
                                    <h3 className='font-normal'>
                                        <AccountCircleIcon/>
                                        {connection.to_user.username}
                                    </h3>
                                    <button className='btn go-back' onClick={() => history.goBack()}>
                                        <ArrowBackIcon />
                                    </button>
                                </React.Fragment>
                            ) : null
                        ) : null}
                    </div>
                    <div className='messages p-2'>
                        {messages.length > 0 ? (
                            messages.map((message) => (
                                message.author === user.id ? (
                                    <div className='message-cont' key={message.id}>
                                        <div className='own-message'>
                                            <span>{message.text}</span>
                                            <p>{format_date(message.date)}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className='message-cont' key={message.id}>
                                        <div className='contact-message'>
                                            <span>{message.text}</span>
                                            <p>{format_date(message.date)}</p>
                                        </div>
                                    </div>
                                )
                            )
                        )) : (
                            <h2 className='font-normal color-grey'>There's no messages yet</h2>
                        )}
                    </div>
                    <div className='message-form'>
                        <form onSubmit={sendMessage}>
                            <input
                                onChange={e => setMessage(e.target.value)}
                                value={message} 
                                placeholder='Type something...' />
                            {valid_form}
                        </form>
                    </div>
                </div>
                <Chats />
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    user: state.auth.user,
    token: state.auth.token
})

export default connect(mapStateToProps)(Chat)
