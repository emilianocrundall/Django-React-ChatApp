import React from 'react'
import { connect } from 'react-redux'
import { Redirect, Route } from 'react-router-dom'
import Loader from './Loader'

const PrivateRoute = ({auth, loading, component:Component, ...rest}) => (
    <Route
        {...rest}
        render={props => {
            if(loading){
                return <Loader />
            } else if(!auth.isAuthenticated){
                return <Redirect to='/register' />
            } else{
                return <Component {...props} />
            }
        }}
    />
)

const mapStateToProps = state => ({
    auth: state.auth,
    loading: state.auth.loading
})

export default connect(mapStateToProps)(PrivateRoute)