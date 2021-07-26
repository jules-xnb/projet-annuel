import React from 'react'

class Items extends React.Component{
    render(){
        return (
                <div className="wrapItems">
                    <div className="itemsItem address">Le numéro de l'enchère : {this.props.id}</div>
                    <div className="itemsItem actualBalance">Date de fin : {this.props.image}</div>
                    <div className="itemsItem totalBalance">Prix actuel : {this.props.possAddress}</div>
                    <div className="itemsItem totalBalance">Adresse du dernière enchérisseur : {this.props.creatorAddress}</div>
                    <div className="itemsItem totalBalance">Addresse du propriétaire de l'enchère : {this.props.comment}</div>
                    <div className="itemsItem totalBalance">Addresse du propriétaire de l'enchère : {this.props.createdTimestamp}</div>
                </div>
        );
    }
}

export default Items;