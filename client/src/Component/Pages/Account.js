import React from 'react'

class Account extends React.Component{
    render(){
        return (
            <div style={{display : this.props.disp ? 'block' : 'none', backgroundColor : "red"}}>
                Account page
            </div>
        );
    }
}

export default Account;