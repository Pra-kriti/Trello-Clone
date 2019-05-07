import React, { Component } from 'react';

import BoardNav from './BoardNav';
import List from './List';

class Board extends Component {
    render() {
        return (
            <div id='board'>
                <BoardNav />
                <List />
            </div>
        );
    }
}

export default Board;