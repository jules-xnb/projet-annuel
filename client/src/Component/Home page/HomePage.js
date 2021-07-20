import React from 'react'
// import PasswdContext from '../Context/PasswdContext';

class HomePage extends React.Component {

    render(){
        return (
            <div className="componentHP" style={{display : this.props.disp ? 'block' : 'none', backgroundColor : "blue"}}>
                {/* <p style={{color:"white"}}>{contextPsswdValue.passwd}</p> */}
                <h1>[nom à définir]</h1>
                <div>Le premier site d'enchère entièrement offchain.</div>
                <div>Connectez vous pour participer à de nombreuses enchères.</div>
            </div>
        );
    }
}




export default HomePage;