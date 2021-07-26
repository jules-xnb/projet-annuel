import React from 'react'

class Items extends React.Component{
    render(){
        return (
            <div className="wrapItems"> 
                <div className="itemsItem id">id : {this.props.id}</div>
                <div className="itemsItem image">image : {this.props.image}</div>
                <div className="itemsItem possAddress">possAddress : {this.props.possAddress}</div>
                <div className="itemsItem creatorAddress">creatorAddress : {this.props.creatorAddress}</div>
                <div className="itemsItem comment">comment : {this.props.comment}</div>
                <div className="itemsItem createdTimestamp">createdTimestamp : {this.props.createdTimestamp}</div>
            </div>
        );
    }
}

export default Items;