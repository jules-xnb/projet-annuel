import React from 'react'
import Connection from './Connection';

const MenuBar = () => {

    return (
        <div className="menubar">
            <div className="firstBlock">
              <div className="itemmenu home">
                  <button>💰</button>
                </div>

              <div className="itemmenu second">
                  <button>test2</button>
                </div>

              <div className="itemmenu third">
                  <button>test3</button>
                </div>
            </div>
            <div className="middleblock"></div>
            <Connection/>
        </div>
    );
}

export default MenuBar;