import React from 'react'
import './App.css';
import MenuBar from "./Component/Menu/MenuBar";
import HomePage from './Component/Home page/HomePage';
import Connection from './Component/Menu/Connection';
import Bids from './Component/Pages/Bids'
import Account from './Component/Pages/Account'



class App extends React.Component {

  state = {
    mess:'mot de passe',
    displayAcc : true,
    displayBids : true,
    displayHP : true
  }

  handleConnect = (childData) => {
    this.setState({mess:childData})
  }

  changeDisplayAcc = (Acc) => {
    this.setState({displayAcc:Acc})
  }

  changeDisplayHP = (HP) => {
    this.setState({displayHP:HP})
  }

  changeDisplayBid = (Bid) => {
    this.setState({displayBids:Bid})
  }

  render(){
    return (
      <div className="App">
        <div className="BarMenu">
          <MenuBar 
            dispAcc={this.changeDisplayAcc} 
            dispHP={this.changeDisplayHP} 
            dispBid={this.changeDisplayBid} 
          />

          <div className="middleblock"></div>
          <Connection callbackFunct={this.handleConnect}/>
        </div>
        {this.state.mess}
        <HomePage disp = {this.state.displayHP}/>
        <Account disp = {this.state.displayAcc}/>
        <Bids disp = {this.state.displayBids}/>
      </div>
    );
  }
}

export default App;
