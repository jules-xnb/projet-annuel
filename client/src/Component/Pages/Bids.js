import React from 'react'

class Bids extends React.Component{
    render(){
        return (
            <div className="wrapBid">
                <div className="bidsItem address">Le numéro de l'enchère : {this.props.idItem}</div>
                <div className="bidsItem actualBalance">Date de fin : {this.props.dateEnd}</div>
                <div className="bidsItem totalBalance">Prix actuel : {this.props.actualPrice}</div>
                <div className="bidsItem totalBalance">Adresse du dernière enchérisseur : {this.props.bidderAddress}</div>
                <div className="bidsItem totalBalance">Addresse du propriétaire de l'enchère : {this.props.creatorAddress}</div>
            </div>
        );
    }
}

export default Bids;