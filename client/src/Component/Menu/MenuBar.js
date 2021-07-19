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
    this.props.displayHP(this.state.displayHomePage)
  }

  changeDisplayBid = () => {
    this.props.dispBid(this.state.displayBid)
  }
  

  render(){
    return (
          <div className="firstBlock">
            <div className="itemmenu home">
                <button onClick={() => {
                  this.state.displayHomePage ? this.setState({displayHomePage: false}) : this.setState({displayHomePage: true})
                  console.log('this'+this.state.displayHomePage)
                  }}>💰</button>
              </div>

            <div className="itemmenu second">
                <button onClick={() =>{
                  this.state.displayAccount ? this.setState({displayAccount: false}) : this.setState({displayAccount: true})
                  console.log('this'+this.state.displayAccount)
                }}>Account</button>
              </div>

            <div className="itemmenu third">
                <button onClick={() => {
                this.state.displayBid ? this.setState({displayBid: false}) : this.setState({displayBid: true})
                console.log('this'+this.state.displayBid)
                }}>Bids</button>
              </div>
          </div>
          
    )
  }
}

export default MenuBar;