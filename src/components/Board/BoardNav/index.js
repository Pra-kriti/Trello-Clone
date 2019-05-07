import React, { Component } from 'react';

import SimpleStorage from 'react-simple-storage';

import { Button, Input } from 'antd';

class BoardNav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            boardName: 'Add Board Name'
        }
    }

    handleChange = (e) => {
        this.setState({
            boardName: e.target.value
        })
    } 

    render() {
        const { boardName } = this.state;
        return (
            <div id='board-nav'>
                <SimpleStorage parent={this} prefix='BoardName' />
                <Input
                    id='board-name-input'
                    value={boardName}
                    onChange={this.handleChange}
                />
            </div>
        );
    }
}

export default BoardNav;