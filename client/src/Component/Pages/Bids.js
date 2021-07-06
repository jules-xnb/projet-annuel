import React from 'react'

class Bids extends React.Component{
    render(){
        return (
            <div style={{display : this.props.disp ? 'block' : 'none', backgroundColor : "yellow"}}>
                Bids page
            </div>
        );
    }
}

export default Bids;