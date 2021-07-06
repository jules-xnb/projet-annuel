import React, { useContext } from 'react'
import PasswdContext from '../Context/PasswdContext';

class HomePage extends React.Component {

    // const contextPsswdValue = useContext(PasswdContext);

    render(){
        return (
            <div style={{display : this.props.disp ? 'block' : 'none', backgroundColor : "blue"}}>
                <button class="connectMetaMask" onclick="loadWeb3()">Connexion avec metamask</button>
                {/* <p style={{color:"white"}}>{contextPsswdValue.passwd}</p> */}
            </div>
        );
    }
}

function loadWeb3(){

}


export default HomePage;