import React from 'react'

class Account extends React.Component{
    render(){
        return (
            <div className="componentAccount" style={{display : this.props.disp ? 'block' : 'none', backgroundColor : "red"}}>
                <div className="wrapAccount">
                    <h1>Votre compte</h1>
                    <div className="accountItem address">Votre adresse : {this.props.address}</div>
                    <div className="accountItem tokenWallet">Tokens sur Metamask : {this.props.tokenWallet}</div>
                    <div className="accountItem actualBalance">Votre balance actuelle : {this.props.actualBalance}</div>
                    <div className="accountItem totalBalance">Votre balance total : {this.props.totalBalance}</div>

                </div>
            </div>
        );
    }
}

export default Account;