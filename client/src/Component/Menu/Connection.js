import React, { useState } from 'react'
import PasswdContext from '../Context/PasswdContext';

const Connection = () => {
    const [showCanvas,setShowCanvas] = useState(false);
    const [title,setTitle] = useState("Connexion");
    const [passwd,setPasswd] = useState("password");

    let styleConnection = {
        display: showCanvas ? 'block' : 'none'
    }

    const contextPsswdValue = {
        passwd,
        setPasswd
    };

    return (
        <div className="connect">
            {/* <PasswdContext.Provider value={contextPsswdValue}> */}
            <div className="itemlast connection">
                    <button className="button connexion" onClick={() => setShowCanvas(true)}>Connexion</button>
            </div>
            <div className="canvas" style={styleConnection}>
                <div className="background" onClick={() => setShowCanvas(false)}></div>
                <div className="form">
                    <div className="titles">
                        <div className="itemtitles signin" onClick={() => setTitle("Inscription")}>Inscription</div>
                        <div className="itemtitles login" onClick={() => setTitle("Connexion")}>Connexion</div>
                    </div>

                    <div className="forms">
                        <h1>{title}</h1>
                        <label for="password" onChange={(e) => setPasswd(e.target.value)}>Mot de passe : </label><input type="text" className="password"/>
                    </div>
                </div>
            </div>
            {/* </PasswdContext.Provider> */}
        </div>
    );
}

export default Connection;














