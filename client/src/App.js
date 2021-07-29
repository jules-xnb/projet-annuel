import React from 'react'
import './App.css';
import HomePage from './Component/Home page/HomePage';
import Bids from './Component/Pages/Bids'
import Account from './Component/Pages/Account'
import Web3 from 'web3'
import { abi } from './ABI/abi'
import axios from 'axios'
import Items from './Component/Pages/Items';
import { createItem, deleteItem } from './Functions/ItemFunc'
import { createBid, compDates } from './Functions/BidFunc'
import { updateUser } from './Functions/UserFunc'


class App extends React.Component {

  state = {
    displayAcc : true,
    displayHP : true,
    displayBids : true,
    displayItems: true,

    showCanvasCo : false,
    showCanvasNB : false,

    title : "Connexion",
    passwd : "password",

    privateKeyAdmin: "bcf1f68eac9b08b1e938079e4750f90b468d729b74366be99aac1ba16a1404da",
    publicKeyAdmin: "0x88352aDC0c6Fa220d6D5e5c797ACC5344f43ebD3",
    //chainURL: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    addressContract: "0xaba3B865A8b03f9636be1e1F47bc20248e6bad05",
    userAddress: null,
    userToken: null,
    contract : null,

    actualBalance: 0,
    totalBalance: 0,
    tokenWallet: 0,
    amountDepositWithdraw: 0,
    resDepositWithdraw: null,
    resDepositWithdraw2: null,
    resDepositWithdraw3: null,
    resDepositWithdraw4: null,

    buttonInscription : "Inscription/Connexion",
    messageInscription : null,

    allBids: [],
    allItems: [],

    newPrice:0,

    dateEnd: null,
    priceNewBid: null,

    connected: false,

    inputImageCI:"",
    inputCommentCI:"",

    idItemCreate:"",

  }

  web3 = new Web3(window.ethereum)


  // ############################################ Connexion MetaMask ############################################

  loadWeb3 = async () =>{
    if (window.ethereum) {
      await window.ethereum.enable()
      await this.web3.eth.getAccounts()
          .then(e => {
            this.setState({userAddress:e[0]})
          })
      let newcontract = await new this.web3.eth.Contract(abi, this.state.addressContract)
      this.setState({contract: newcontract})
      let res = await newcontract.methods.balanceOf(this.state.userAddress).call()
      this.setState({ tokenWallet : res })
    }

  }

  // ############################################ Connexion / Inscription ############################################

  connect = () => {
    if (this.state.passwd && this.state.userAddress){
      if (this.state.title === "Inscription"){
          const req = {
            address : this.state.userAddress,

            password : this.state.passwd,
            actualBalance : this.state.actualBalance,
            totalBalance : this.state.totalBalance

          };
          axios.post('http://localhost:4000/user/signup', req)
          .then(
            res => {
              this.setState({messageInscription: res.data.message + " Veuillez vous connecter"})
            })
          .catch(
            () => { this.setState({messageInscription: "Erreur, un utilisateur existe déja pour cette adresse"})
          })
      } else {
          const req = {
            address : this.state.userAddress,
            password : this.state.passwd,
            actualBalance : this.state.actualBalance,
            totalBalance : this.state.totalBalance
          };
          axios.post('http://localhost:4000/user/login', req)
          .then( res => {
              this.setState({userToken: res.data.token, messageInscription: "Connexion réussie", buttonInscription: "Connecté"})
              console.log("userAddress",this.state.userAddress)
              this.getUser()
          })
          .catch(() => { this.setState({messageInscription: "Erreur, utilisateur inconnu ou mot de passe incorrect"})})
      }
    } else {
      this.setState({messageInscription: "Connexion à Metamask et mot de passe requis"})
    }
  }

   // ############################################ Deposit / Withdraw ############################################

  deposit = async () => {
    this.setState({
      resDepositWithdraw1 : null,
      resDepositWithdraw2 : null,
      resDepositWithdraw3 : null,
      resDepositWithdraw4 : null,
    })
    if (this.state.userAddress && this.state.userToken && this.state.amountDepositWithdraw > 0){
      let res = await this.state.contract.methods.deposit(this.state.amountDepositWithdraw).send({
        from: this.state.userAddress,
        to: this.state.addressContract
      })
      this.setState({ resDepositWithdraw1 : 'Dépot sur le smart-contract, en attente de confirmation :  ' + res.transactionHash })

      let web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545')
      res = await this.state.contract.methods.getWaitingDepot(this.state.userAddress).call()
      this.setState({ resDepositWithdraw2 : res + " tokens ont été déposés sur le contrat, transfert vers le dépot en cours" })

      let gasPrice = await web3.eth.getGasPrice()
      let gasEstimate = await this.state.contract.methods.transferToDepot(this.state.userAddress)
      .estimateGas({ from: this.state.publicKeyAdmin })
      let encoded = await this.state.contract.methods.transferToDepot(this.state.userAddress).encodeABI()
      let tx = {
          to: this.state.addressContract,
          data : encoded,
          gasPrice,
          gas: gasEstimate
      }
      let signedtx = await web3.eth.accounts.signTransaction(tx, this.state.privateKeyAdmin)
      let res2 = await web3.eth.sendSignedTransaction(signedtx.rawTransaction)
      this.setState({ resDepositWithdraw3 : " Dépot sur la plateforme confirmé, mise à jour de vos balances : " + res2.transactionHash })

      var ac = this.state.actualBalance + res
      var tb = this.state.totalBalance + res

      updateUser(ac,tb,this.state.userAddress,this.state.userToken)
      
      let res3 = await this.state.contract.methods.balanceOf(this.state.userAddress).call()
      this.setState({ tokenWallet : res3 })
      this.setState({ resDepositWithdraw4 : "Balances mises à jour" })
    } else {
      this.setState({ resDepositWithdraw1 : "Vous n'êtes pas connecté ou montant incorrect" })
    }
  }

  withdraw = async () => {
    this.setState({
      resDepositWithdraw1 : null,
      resDepositWithdraw2 : null,
      resDepositWithdraw3 : null,
      resDepositWithdraw4 : null,
    })

    if (this.state.userAddress && this.state.userToken
      && this.state.amountDepositWithdraw > 0 && this.state.amountDepositWithdraw <= this.state.actualBalance ){
        this.setState({ resDepositWithdraw2 : "Demande de retrait en cours de traitement" })
      let web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545')
      let gasPrice = await web3.eth.getGasPrice()
      let gasEstimate = await this.state.contract.methods.withdraw(this.state.userAddress, this.state.amountDepositWithdraw)
      .estimateGas({ from: this.state.publicKeyAdmin })
      let encoded = await this.state.contract.methods.withdraw(this.state.userAddress, this.state.amountDepositWithdraw).encodeABI()
      let tx = {
        to: this.state.addressContract,
        data : encoded,
        gasPrice,
        gas: gasEstimate
    }
    let signedtx = await web3.eth.accounts.signTransaction(tx, this.state.privateKeyAdmin)
    let res2 = await web3.eth.sendSignedTransaction(signedtx.rawTransaction)
    this.setState({ resDepositWithdraw3 : " Retrait sur la plateforme confirmé, mise à jour de vos balances : " + res2.transactionHash })

    var ac = this.state.actualBalance - this.state.amountDepositWithdraw
    var tb = this.state.totalBalance - this.state.amountDepositWithdraw

    updateUser(ac,tb,this.state.userAddress,this.state.userToken)

    let res3 = await this.state.contract.methods.balanceOf(this.state.userAddress).call()
    this.setState({ tokenWallet : res3 })
    this.setState({ resDepositWithdraw4 : "Balances mises à jour" })
    } else {
      this.setState({ resDepositWithdraw1 : "Vous n'êtes pas connecté ou montant incorrect" })
    }
  }


  render(){
    return (
      <div className="App">

        {/* ############################################ Boutton MenuBar ############################################ */}

       <div className="BarMenu">
        <div className="firstBlock">
            <div className="itemmenu home">
                <button onClick={() => {
                  this.state.displayHP ? this.setState({displayHP: false}) : this.setState({displayHP: true})
                  }}>💰</button>
              </div>

            <div className="itemmenu second">
                <button onClick={() =>{
                  this.state.displayAcc ? this.setState({displayAcc: false}) : this.setState({displayAcc: true})
                }}>Account</button>
              </div>

            <div className="itemmenu third">
                <button onClick={() => {
                this.state.displayBids ? this.setState({displayBids: false}) : this.setState({displayBids: true})
                }}>Bids</button>
              </div>
          <div className="itemmenu third">
                <button onClick={() => {
                this.state.displayItems ? this.setState({displayItems: false}) : this.setState({displayItems: true})
                }}>Items</button>
              </div>
          </div>

          <div className="middleblock"></div>

          {/* ############################################ Boutton connexion ############################################ */}

          <div className="connect">
                <div className="itemlast connection">
                  <button className="button connexion" onClick={() => this.setState({showCanvasCo : true})}>{ this.state.buttonInscription }</button>
                </div>
                <div className="canvas" style={{display : this.state.showCanvasCo ? 'block' : 'none'}}>
                    <div className="background" onClick={() => this.setState({showCanvasCo : false})}></div>
                    <div className="form">
                        <div className="titles">
                            <div className="itemtitles signin" onClick={() => this.setState({title : "Inscription"})}>Inscription</div>
                            <div className="itemtitles login" onClick={() => this.setState({title : "Connexion"})}>Connexion</div>
                        </div>

                        <div className="formsCo">
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
            </div>
        </div>

        {/* ############################################ Blocks Main Page ############################################ */}

        <HomePage disp = {this.state.displayHP}/>
        <div className="componentAccount" style={{display : this.state.displayAcc ? 'block' : 'none', backgroundColor : "red"}}>
          <div className="divBidFlex">
            <h1>Votre compte</h1>
            <div></div>
            <button onClick={() => this.getUser()}>🔄 Reload</button>
          </div>
          <Account
            address = {this.state.userAddress}
            actualBalance = {this.state.actualBalance}
            totalBalance = {this.state.totalBalance}
          />
        </div>

        <input type="text" onChange={e => this.setState({ amountDepositWithdraw: e.target.value })}/>
        <button onClick={()=> this.deposit()}>Deposit</button>
        <button onClick={()=> this.withdraw()}>Withdraw</button>
        <div>{ this.state.resDepositWithdraw1 }</div>
        <div>{ this.state.resDepositWithdraw2 }</div>
        <div>{ this.state.resDepositWithdraw3 }</div>
        <div>{ this.state.resDepositWithdraw4 }</div>
        <div className="componentBid" style={{display : this.state.displayBids ? 'block' : 'none', backgroundColor : "green"}}>
          <div className="divBidFlex">
            <h1>Les enchères</h1>
            <div></div>
            <button onClick={() => this.getAllBids()}>🔄 Reload</button>
          </div>
          {this.state.allBids.map((e) =>
            <div>
              <Bids
                id = {e._id}
                idItem = {e.idItem}
                dateEnd = {e.dateEnd}
                actualPrice = {e.actualPrice}
                bidderAddress = {e.bidderAddress}
                creatorAddress = {e.creatorAddress}
              />
              <input
                type="number"
                placeholder="Le montant"
                onChange={event => this.setState({newPrice: event.target.value})}
              />

              <button
                onClick={() => this.updateBid(this.state.newPrice,e._id,e.actualPrice,this.state.userAddress,this.state.userToken,e.creatorAddress,true)}
              >Enchérir</button>
            </div>
          )}
        </div>

        <div className="componentItems" style={{display : this.state.displayItems ? 'block' : 'none', backgroundColor : "brown"}}>
          <div className="divBidFlex">
            <h1>Tous vos items</h1>
            <div></div>
            <button onClick={() => this.getItemsByAddress()}>🔄 Reload</button>
          </div>
          {this.state.allItems.map((e) =>
            <div>
              <Items
                id = {e._id}
                image = {e.image}
                possAddress = {e.possAddress}
                creatorAddress = {e.creatorAddress}
                comment = {e.comment}
                createdTimestamp = {e.createdTimestamp}
              />
              <button onClick={() => deleteItem(e._id,this.state.userAddress,this.state.userToken)}>
                Supprimer
              </button>
              <div>
                  <input type="text" placeholder="AAAA-MM-JJ" className="formDateEnd" onChange={(e) => this.setState({dateEnd : e.target.value})}/>
                  <input type="number" placeholder="Prix" className="formPrice" onChange={(e) => this.setState({priceNewBid : e.target.value})}/>
                <button onClick={() => createBid(this.state.dateEnd,this.state.priceNewBid,e._id,this.state.userAddress, this.state.userToken)}>
                  Créer un enchère
                </button>
              </div>

            </div>
          )}

          <div className="createItem">
            <h3>Créer un item</h3>
            <input type="text" placeholder="image" className="inputImageCI" onChange={(e) => this.setState({inputImageCI:e.target.value})}/>
            <input type="text" placeholder="comment" className="inputCommentCI" onChange={(e) => this.setState({inputCommentCI:e.target.value})}/>
            <button onClick={() => createItem(this.state.inputImageCI,this.state.inputCommentCI,this.state.userAddress, this.state.userToken)}>Créer</button>
          </div>
        </div>

      </div>
    );
  }




  getItemsByAddress = async () => {
      if (this.state.userAddress && this.state.userToken){
        axios.post("http://localhost:4000/item/items", { address: this.state.userAddress })
        .then(res => {
          this.setState({allItems: res.data.data})
        })
      }
  }


  getAllBids = () => {
      axios.get("http://localhost:4000/bid/bids")
      .then(res => {
        var resp = res.data.data
        var dateNow = new Date().toISOString()
        console.log(resp[0].dateEnd)
        console.log(dateNow)
        var key;
        for(key in resp){
          console.log("compare",compDates(resp[key].dateEnd,dateNow))
          console.log("token",this.state.userToken)
          if(compDates(resp[key].dateEnd,dateNow) && this.state.userToken){
            console.log(resp)
            let active = false
            console.log("id with false",resp[key]._id)
            this.updateBid(resp[key].newPrice, resp[key]._id, resp[key].newPrice,resp[key].userAddress,this.state.userToken,resp[key].userAddress,active)

            console.log("done")
          }
        }
        this.setState({allBids: resp})
      })
  }

  updateBid = (newPrice, idBidUpdate, oldPrice,userAddress,userToken,creatorAddress,actif) => {
    if(userAddress !== creatorAddress && actif && this.state.actualBalance >= newPrice && userAddress && userToken && creatorAddress && newPrice > oldPrice){
      let data = JSON.stringify({
        "id": idBidUpdate,
        "active": actif,
        "actualPrice": newPrice,
        "bidderAddress": userAddress
      })
  
      let config = {
        method: 'put',
        url: 'http://localhost:4000/bid/update',
        headers: { 
          'Authorization': 'Bearer ' + userToken, 
          'Content-Type': 'application/json'
        },
        data : data
      };
  
      axios(config) 
      .then(res => {

          let ac
          let tb = this.state.totalBalance

          ac = this.state.actualBalance - newPrice

          updateUser(ac,tb,userAddress,userToken)

          ac = this.state.actualBalance + oldPrice

          updateUser(ac,tb,creatorAddress,userToken)

          console.log("updated")
      })
    }
    else if (!actif){
      let data = JSON.stringify({
        "id": idBidUpdate,
        "active": actif,
        "actualPrice": newPrice,
        "bidderAddress": userAddress
      })
  
      let config = {
        method: 'put',
        url: 'http://localhost:4000/bid/update',
        headers: { 
          'Authorization': 'Bearer ' + userToken, 
          'Content-Type': 'application/json'
        },
        data : data
      };
  
      axios(config) 
    }
    else{
      console.log("erreur")
    }
  }

  getUser = () => {
    if(this.state.userAddress && this.state.userToken){
      axios.post("http://localhost:4000/user/user", { address : this.state.userAddress})
      .then(res2 => {
        console.log("getUser :",res2)
        this.setState({
          actualBalance : res2.data.actualBalance,
          totalBalance : res2.data.totalBalance,
          connected: true
        })
      })
    }
    else{
      console.log("pas connecté")
    }
  }

}

export default App;
