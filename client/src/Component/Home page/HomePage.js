import React from 'react'
// import PasswdContext from '../Context/PasswdContext';

class HomePage extends React.Component {

    state = {
        displ : this.props.disp
    }

    render(){
        return (
            <div style={{display : this.state.displ ? 'block' : 'none', backgroundColor : "blue"}}>
                {/* <p style={{color:"white"}}>{contextPsswdValue.passwd}</p> */}
                test
            </div>
        );
    }
}




export default HomePage;