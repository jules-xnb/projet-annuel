import React from 'react'
import './App.css';
import MenuBar from "./Component/Menu/MenuBar";
import HomePage from './Component/Home page/HomePage';
// import Connection from './Component/Menu/Connection';
import Bids from './Component/Pages/Bids'
import Account from './Component/Pages/Account'
import Web3 from 'web3'
import { abi } from './ABI/abi'
import axios from 'axios'


class App extends React.Component {

  state = {
    mess:'mot de passe',
    displaycdAcc : true,
    displayBids : true,
    displayHP : true,
    showCanvas : false,

    title : "Connexion",
    passwd : "password", 

    addressContract: "0x939E52397527b709193B7Eb3A7E249f9803C60dE", 
    userAddress: null, 
    userToken: null, 
    contract : null, 
    

    messageInscription : null, 
  }

  web3 = new Web3(window.ethereum)


  // handleConnect = (childData) => {
  //   this.setState({mess:childData})
  //   // console.log(mess)
  // }



  changeDisplayAcc = (Acc) => {
    this.setState({displayAcc:Acc})
    console.log('app this: '+this.state.displayAcc)
  }

  changeDisplayHP = (HP) => {
    this.setState({displayHP:HP})
    console.log('app this: '+this.state.displayHP)
  }

  changeDisplayBid = (Bid) => {
    this.setState({displayBids:Bid})
    console.log('app this: '+this.state.displayBids)
  }

  loadWeb3 = async () =>{
    if (window.ethereum) {
      await window.ethereum.enable()
      await this.web3.eth.getAccounts()
          .then(e => {
            this.setState({userAddress:e[0]})
          })
      let newcontract = await new this.web3.eth.Contract(abi, this.state.addressContract)
      this.setState({contract: newcontract})
      console.log(this.state.userAddress)
    }
    //console.log('connection metamask')
  }

  connect = async () => {
    if (this.state.passwd && this.state.userAddress){
      if (this.state.title === "Inscription"){
          const req = {
            address : this.state.userAddress,
            password : this.state.passwd
          };
          const res = await axios.post('http://localhost:4000/user/signup', req);
          if (res.status === 201){
            this.setState({messageInscription: res.data.message + " Veuillez vous connecter"})
          }
      } else {
          const req = {
            address : this.state.userAddress,
            password : this.state.passwd
          };
          const res = await axios.post('http://localhost:4000/user/login', req)
          if (res.status === 200){
            this.setState({userToken: res.data.token, messageInscription: "Connexion réussie"})
            console.log(this.state.userToken)
          }
      }
    } else {
      this.setState({messageInscription: "Connexion à Metamask et mot de passe requis"})
    }
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
          <div className="connect">
                {/* <PasswdContext.Provider value={contextPsswdValue}> */}
                <div className="itemlast connection">
                        <button className="button connexion" onClick={() => this.setState({showCanvas : true})}>Connexion</button>
                </div>
                <div className="canvas" style={{display : this.state.showCanvas ? 'block' : 'none'}}>
                    <div className="background" onClick={() => this.setState({showCanvas : false})}></div>
                    <div className="form">
                        <div className="titles">
                            <div className="itemtitles signin" onClick={() => this.setState({title : "Inscription"})}>Inscription</div>
                            <div className="itemtitles login" onClick={() => this.setState({title : "Connexion"})}>Connexion</div>
                        </div>

                        <div className="forms">
                            <h1>{this.state.title}</h1>
                            <div><button className="connectMetaMask" onClick={() => this.loadWeb3()}>Connexion avec metamask</button></div>
                            <div>{ this.state.userAddress }</div>
                            <label for="password" onChange={(e) => this.setState({password : e.target.value})}>Mot de passe : </label>
                            <input type="text" className="password" onChange={(e) => this.setState({passwd : e.target.value})}/>
                            <input type="button" value="Submit" onClick={() => this.connect()}/>
                            <div>{ this.state.messageInscription }</div>
                        </div>
                    </div>
                </div>
                {/* </PasswdContext.Provider> */}
            </div>
        </div>
        {this.state.passwd}
        <HomePage disp = {this.state.displayHP}/>
        <Account disp = {this.state.displayAcc}/>
        <Bids disp = {this.state.displayBids}/>
      </div>
    );
  }
}

export default App;
