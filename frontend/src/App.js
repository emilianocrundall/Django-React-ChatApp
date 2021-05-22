import React, { useEffect } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import './styles/styles.css'
import { Provider } from 'react-redux'
import store from './store'
import { load_user } from './actions/auth'
import PrivateRoute from './components/common/PrivateRoute'
import Register from './components/Register'
import Login from './components/Login'
import SideBar from './components/SideBar'
import FindFriends from './components/FindFriends'
import Friends from './components/Friends'
import Chat from './components/Chat'

const App = () => {

    useEffect(() => {
        store.dispatch(load_user())
    }, [])

    return (
        <Provider store={store}>
            <BrowserRouter>
            <div>
                <SideBar />
                <Switch>
                    <PrivateRoute exact path='/' component={Dashboard} />
                    <Route exact path='/register' component={Register} />
                    <Route exact path='/login' component={Login} />
                    <PrivateRoute exact path='/connect' component={FindFriends} />
                    <PrivateRoute exact path='/friends' component={Friends} />
                    <PrivateRoute exact path='/chats/:id' component={Chat}/>
                </Switch>
            </div>
            </BrowserRouter>
        </Provider>
    )
}

export default App
