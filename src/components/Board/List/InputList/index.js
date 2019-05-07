import React, { Component } from 'react';

import { Icon, Input, Button, Form } from 'antd';

class InputList extends Component {
    render() {
        return(
            <div className='add-list'>
                <Form className='list-form' onSubmit={this.handleSubmit}>
                    <Icon id='cross-icon' type='cross' style={{color: 'red'}} />
                    <Input name='list-title' id='list-title-input' size='large' placeholder='Enter title of the list' onChange={this.handleInputTitleChange} />                        
                    <Button id='list-title-submit' type='primary' onClick={this.handleTitleSubmit} >Submit</Button>    
                </Form>
            </div>
        )
    }
}


export default InputList;