import React from 'react'
// import Account from '../Pages/Account';
// import Bids from '../Pages/Bids';
// import HomePage from '../Home page/HomePage';
// import { BrowserRouter, Route} from 'react-router-dom';

class MenuBar extends React.Component {

  state = {
    displayAccount : true,
    displayHomePage : true,
    displayBid : true
  }

  changeDisplayAcc = () => {
    this.props.dispAcc(this.state.displayAccount)
  }

  changeDisplayHP = () => {
    this.props.dispHP(this.state.displayHomePage)
  }

  changeDisplayBid = () => {
    this.props.dispBid(this.state.displayBid)
  }
  

  render(){
    return (
          <div className="firstBlock">
            <div className="itemmenu home">
                <button onClick={() => {
                  // this.changeDisplayHP(),
                  console.log(this.state.displayHomePage)
                  }}>💰</button>
              </div>

            <div className="itemmenu second">
                <button onClick={() => 
                  // this.changeDisplayAcc(),
                  console.log(this.state.displayHomePage)}>Account</button>
              </div>

            <div className="itemmenu third">
                <button onClick={() => 
                // this.changeDisplayBid(),
                console.log(this.state.displayHomePage)}>Bids</button>
              </div>
          </div>
          
    )
  }
}

export default MenuBar;