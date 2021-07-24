import React from 'react'
import './App.css';
import HomePage from './Component/Home page/HomePage';
import Bids from './Component/Pages/Bids'
import Account from './Component/Pages/Account'
import Web3 from 'web3'
import { abi } from './ABI/abi'
import axios from 'axios'


class App extends React.Component {

  

  state = {
    mess:'mot de passe',
    displayAcc : true,
    displayHP : true,
    displayBids : true,

    showCanvas : false,

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

    imageItem : "test", 
    commentItem : "test", 


    allBids: [],

    idBidUpdate:'60fb5dcbadecb778f701af9c',
    oldPrice:250,
    newPrice:350,

    connected: false

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
              axios.post("http://localhost:4000/user/user", { address : this.state.userAddress})
              .then(res2 => {
              //console.log(res)
                this.setState({
                  actualBalance : res2.data[0].actualBalance, 
                  totalBalance : res2.data[0].totalBalance,
                  connected: true

                })
              })
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
      
      var ac = this.state.actualBalance * 1 + res * 1
      var tb = this.state.totalBalance * 1 + res * 1

      let data = JSON.stringify({
        "address" : this.state.userAddress, 
        "actualBalance" : ac,
        "totalBalance" : tb
      })
      let config = {
        method: 'put',
        url: 'http://localhost:4000/user/update',
        headers: { 
          'Authorization': 'Bearer ' + this.state.userToken, 
          'Content-Type': 'application/json'
        },
        data : data
      };
      axios(config)
      .then(() => {
        this.setState({
          actualBalance : ac, 
          totalBalance : tb,
        })
        
      })
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

    var ac = this.state.actualBalance * 1 - this.state.amountDepositWithdraw * 1
    var tb = this.state.totalBalance * 1 - this.state.amountDepositWithdraw * 1

    let data = JSON.stringify({
      "address" : this.state.userAddress, 
      "actualBalance" : ac,
      "totalBalance" : tb
    })

    let config = {
      method: 'put',
      url: 'http://localhost:4000/user/update',
      headers: { 
        'Authorization': 'Bearer ' + this.state.userToken, 
        'Content-Type': 'application/json'
      },
      data : data
    };

    axios(config)
    .then(() => {
      this.setState({
        actualBalance : ac, 
        totalBalance : tb,
      })
    })
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
          </div>

          <div className="middleblock"></div>

          {/* ############################################ Boutton connexion ############################################ */}
          
          <div className="connect">
                <div className="itemlast connection">
                        <button className="button connexion" onClick={() => this.setState({showCanvas : true})}>{ this.state.buttonInscription }</button>
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
            </div>
        </div>

        {/* ############################################ Blocks Main Page ############################################ */}
        
        <HomePage disp = {this.state.displayHP}/>
        <Account 
          disp = {this.state.displayAcc}
          address = {this.state.userAddress}
          actualBalance = {this.state.actualBalance}
          totalBalance = {this.state.totalBalance}
          tokenWallet = {this.state.tokenWallet}
        />
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
                disp = {this.state.displayBids}
                idItem = {e._id}
                dateEnd = {e.dateEnd}
                actualPrice = {e.actualPrice}
                bidderAddress = {e.bidderAddress}
                creatorAddress = {e.creatorAddress}
              />
              <input 
                type="number" 
                placeholder="Le montant" 
              //   onChange={eve => console.log('yesy'),
              //   this.setState({
              //     newPrice: value,
              //     oldPrice: e.actualPrice,
              //     idBidUpdate: e._id
              //   }),
              //   console.log("oldprice: ",this.state.oldPrice, "newprice: ",this.state.newPrice, "idBidUpdate: ",this.state.idBidUpdate, "_id: ",e._id)
              // }
                
              />
              
              <button 
              onClick={() => 
              // this.setState({
              //     oldPrice: e.actualPrice,
              //     idBidUpdate: e._id
              //   }),
              //   console.log("oldprice: ",this.state.oldPrice, "newprice: ",this.state.newPrice, "idBidUpdate: ",this.state.idBidUpdate, "_id: ",e._id)
                this.updateBid()
              }
              >Enchérir</button>
            </div>
          )}
            <button>🔄 Reload</button>
          </div>
          <Bids 
            disp = {this.state.displayBids}
          />
        </div>
      </div>
    );
  }

  createItem = async () => {
    if (this.state.userAddress && this.state.userToken && this.state.imageItem && this.state.commentItem){ 
      let data = JSON.stringify({
        "image" :  this.state.imageItem,
        "address" : this.state.userAddress,
        "comment" : this.state.commentItem,
      })
  
      let config = {
        method: 'post',
        url: 'http://localhost:4000/item/create',
        headers: { 
          'Authorization': 'Bearer ' + this.state.userToken, 
          'Content-Type': 'application/json'
        },
        data : data
      };
  
      axios(config)
      .then(() => {
        // Ce que tu veux que ca fasse en retour
      })
    }
  }

  getItemsByAddress = async () => {
    if (this.state.userAddress && this.state.userToken ){ 
  
      axios.post("http://localhost:4000/item/items", { address: this.state.userAddress })
      .then( res => {
        console.log(res)
        // Ce que tu veux que ca fasse en retour
      })
    }
  }

  deleteItem = async () => {
    if (this.state.userAddress && this.state.userToken ){ 
      let data = JSON.stringify({
        "id" :  "60fb310cfba5196b4a3a952a" // La variable id de l'item à supprimer
      })
  
      let config = {
        method: 'delete',
        url: 'http://localhost:4000/item/delete',
        headers: { 
          'Authorization': 'Bearer ' + this.state.userToken, 
          'Content-Type': 'application/json'
        },
        data : data
      };
  
      axios(config)
      .then(res => {
        console.log(res)
        // Ce que tu veux que ca fasse en retour
      })
    }
  }

  createBid = async () => {
    if (this.state.userAddress && this.state.userToken){ 
      // Vérification qu'une enchère n'est pas déja présente pour un item 
      let idItem = "60fb392a970d0e0d01eb9f9f" // a changer par la varibale de l'id de l'item 
      axios.post("http://localhost:4000/bid/bidsItem", { id : idItem })
      .then( res => {
        if (res.status === 200){
          // enchere déja présente pour cet item, impossible de créer une deuxième OU item id item incorrect 
          console.log("enchère déja présente pout cet item ou id item incorrect")
        } else {
          let data = JSON.stringify({
            "idItem" :  idItem, 
            "dateEnd" : "2021-12-12", // a changer par la variable date end 
            "actualPrice" : 150, // a changer par la variable prix
            "creatorAddress" : this.state.userAddress,
          })
      
          let config = {
            method: 'post',
            url: 'http://localhost:4000/bid/create',
            headers: { 
              'Authorization': 'Bearer ' + this.state.userToken, 
              'Content-Type': 'application/json'
            },
            data : data
          };
      
          axios(config) 
          .then(res => { 
            console.log(res) 
            // Ce que tu veux que ca fasse en retour 
          })
        } 
      })
    } 
  } 

  getAllBids = () => {
    axios.get("http://localhost:4000/bid/bids")
    .then(res => {
      this.setState({allBids : res.data.data})
      console.log("res: ",res)
      console.log("allBids: ",this.state.allBids)

      // Ce que tu veux que ca fasse en retour 
    })
  }

  deleteBid = () => {
    if (this.state.userAddress && this.state.userToken){ 
      let data = JSON.stringify({
        "id" : "60fb5506adecb778f701af88" // A remplacer par une variable
      })

      let config = {
        method: 'delete',
        url: 'http://localhost:4000/bid/delete',
        headers: { 
          'Authorization': 'Bearer ' + this.state.userToken, 
          'Content-Type': 'application/json'
        },
        data : data
      };

      axios(config) 
      .then(res => { 
        console.log(res) 
        // Ce que tu veux que ca fasse en retour 
      })
    }
  }

  updateBid = () => {

    let actualPriceOfBid = this.state.oldPrice
    let newprice = this.state.newPrice
    if (this.state.userAddress && this.state.userToken && newprice > actualPriceOfBid){ 
      let data = JSON.stringify({
        "id": this.state.idBidUpdate,

        "active": true,
        "actualPrice": newprice,
        "bidderAddress": this.state.userAddress
      })

      let config = {
        method: 'put',
        url: 'http://localhost:4000/bid/update',
        headers: { 
          'Authorization': 'Bearer ' + this.state.userToken, 
          'Content-Type': 'application/json'
        },
        data : data
      };

      axios(config) 
      .then(res => { 
        console.log(res)
        console.log("updated")

        // Ce que tu veux que ca fasse en retour 
      })
    }
  }

}

export default App;