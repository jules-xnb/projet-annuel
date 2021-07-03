import React, { useContext } from 'react'
import PasswdContext from '../Context/PasswdContext';

const HomePage = () => {

    const contextPsswdValue = useContext(PasswdContext);

    return (
        <div>
            <button class="connectMetaMask" onclick="loadWeb3()">Connexion avec metamask</button>
            <p style={{color:"white"}}>{contextPsswdValue.passwd}</p>
        </div>
    );
}

function loadWeb3(){

}


export default HomePage;