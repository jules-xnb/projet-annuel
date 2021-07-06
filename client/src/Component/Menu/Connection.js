import React from 'react'
// import PasswdContext from '../Context/PasswdContext';

class Connection extends React.Component {

    // constructor(props){
    //     super(props);
        // this.
        state = {
            showCanvas : false,
            title : "Connexion",
            passwd : "password"
            // display : this.state.showCanvas ? 'block' : 'none'
        }
    // }
    // const [showCanvas,setShowCanvas] = useState(false);
    // const [title,setTitle] = useState("Connexion");
    // const [passwd,setPasswd] = useState("password");

    // let styleConnection = {
    //     display: showCanvas ? 'block' : 'none'
    // }

    // const contextPsswdValue = {
    //     passwd,
    //     setPasswd
    // };

    handleConnect = () => {
        this.props.callbackFunct(this.state.passwd)
    }
    

    render(){
        return (
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
                            <label for="password" onChange={(e) => this.setState({password : e.target.value})}>Mot de passe : </label>
                            <input type="text" className="password" onChange={(e) => this.setState({passwd : e.target.value})}/>
                            <input type="button" value="Submit" onClick={() => this.handleConnect()}/>
                        </div>
                    </div>
                </div>
                {/* </PasswdContext.Provider> */}
            </div>
        );
    }
}

export default Connection;














