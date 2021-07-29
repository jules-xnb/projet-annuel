import React from 'react'

class Account extends React.Component{
    render(){
        return (
                <div className="wrapAcc">
                    <div className="accountItem address">Votre adresse : {this.props.address}</div>
                    <div className="accountItem actualBalance">Votre balance actuelle : {this.props.actualBalance}</div>
                    <div className="accountItem totalBalance">Votre balance total : {this.props.totalBalance}</div>
                    {/* <div className="accountItem token">Votre token : {this.props.token}</div> */}
                </div>
        );
    }
}

export default Account;