import React, { Component } from 'react';

import SimpleStorage from 'react-simple-storage';
import { Input, Card, Form, Icon, Button } from 'antd';

import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import uuid from 'uuid';

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputListTitle: false,
            card: {
                'sample_card' : {
                    id: 'sample_card',
                    body: 'Sample Card'
                },
                'sample_card_2' : {
                    id: 'sample_card_2',
                    body: 'Sample Card 2'
                },
                'sample_card_3' : {
                    id: 'sample_card_3',
                    body: 'Sample Card 3'
                }
            },
            list: {
                'sample_list': {
                    id: 'sample_list',
                    title: 'Sample List',
                    inputCardTitle: false,
                    taskId: ['sample_card', 'sample_card_2']
                },
                'sample_list_2': {
                    id: 'sample_list_2',
                    title: 'Sample List 2',
                    inputCardTitle: false,
                    taskId: ['sample_card_3']
                }
            },
            listOrder: ['sample_list_2', 'sample_list'],
            submit: false
        }
        this.handleDeleteList = this.handleDeleteList.bind(this);
    }

    handleClick = (e) => {
        e.preventDefault();
        const { list } = this.state;
        const listId = uuid().replace(/-/g, '');
        const newList = Object.assign(list, {
            [listId] : {
                id: listId,
                title: '',
                taskId: []
            }
        });
        this.setState({
            list: newList,
            inputListTitle: true
        });
        for(let li in list){
            this.setState({
                listOrder: [...this.state.listOrder, li]
            })
        }
    }

    handleInputTitleChange = (id, e) => {
        const { list } = this.state;
        for (let li in list) {
            if(list[li].id == id) {
                list[li].title = e.target.value;
            }
        }
        this.setState({list});
    }

    handleTitleSubmit = (e) => {
        e.preventDefault();
        this.setState({
            inputListTitle: false,
            submit: true
        })
    }

    handleDelete = (e) => {
        e.preventDefault();
        const { list, listOrder } = this.state;
        const id = listOrder[listOrder.length-1];
        delete list[id];
        listOrder.pop();
        this.setState({
            inputListTitle: false
        })
    }

    deleteCard = (listId) => {
        return new Promise((resolve, reject) => {
            const { card, list } = this.state;
            for (var key in card) {
                if (list[listId].taskId.includes(card[key].id)){
                    resolve(true);
                    delete card[key]
                }
            }
        })
        
    }

    async handleDeleteList (listId, e) {
        e.preventDefault();
        const { list, listOrder } = this.state;
        await this.deleteCard(listId);  
        delete list[listId];
        const index = listOrder.findIndex(lo => lo === listId);   
        listOrder.splice(index, 1);
        this.forceUpdate();
    }

    handleAddCardClick = (e, listId) => {
        e.preventDefault()
        const { list, card } = this.state;
        const cardId = uuid().replace(/-/g, '');
        const newCard = Object.assign(card, {
            [cardId] : {
                id: cardId,
                body: ''
            }
        });
        this.setState({
            card: newCard
        });

        list[listId].taskId.push(cardId);
        list[listId].inputCardTitle = true;
        this.setState({
            list
        })
    }

    handleDeleteCard = (listId, cardId, e) => {
        e.preventDefault();
        const { list, card } = this.state;
        delete card[cardId];
        list[listId].taskId.pop();
        list[listId].inputCardTitle = false;
        this.setState({
            list,
            card
        })
    }

    handleCardTitleChange = (cardId, e) => {
        const { card } = this.state;
        for (let ca in card) {
            if(card[ca].id == cardId) {
                card[ca].body = e.target.value;
            }
        }
        this.setState({card});
    }

    handleCardTitleSubmit = (listId, e) => {
        e.preventDefault();
        const { list } = this.state;
        list[listId].inputCardTitle = false;
        this.setState({
            list
        }) 
    }

    onDragEnd = result => {
        const { destination, source, draggableId, type } = result;
        if(!destination){
            return;
        }

        if(
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        if (type === 'column'){
            const newListOrder = Array.from(this.state.listOrder);
            newListOrder.splice(source.index, 1);
            newListOrder.splice(destination.index, 0, draggableId);
            const newState = {
                ...this.state,
                listOrder: newListOrder
            };
            this.setState(newState);
            return;
        }

        const home = this.state.list[source.droppableId];
        const foreign = this.state.list[destination.droppableId];

        // Reorder if moving card within list
        if(home === foreign){
            const newCardId = Array.from(home.taskId);
            newCardId.splice(source.index, 1);
            newCardId.splice(destination.index, 0, draggableId);
            const newList = {
                ...home,
                taskId: newCardId
            }
            const newState = {
                ...this.state,
                list: {
                    ...this.state.list,
                    [newList.id]: newList
                }
            };
            this.setState(newState);
            return;
        }

        // Moving between list
        const homeTaskId = Array.from(home.taskId);
        homeTaskId.splice(source.index, 1);
        const newHome = {
            ...home,
            taskId: homeTaskId
        }
        const foreignTaskId = Array.from(foreign.taskId);
        foreignTaskId.splice(destination.index, 0, draggableId);
        const newForeign = {
            ...foreign,
            taskId: foreignTaskId
        }
        const newState = {
            ...this.state,
            list: {
                ...this.state.list,
                [newHome.id]: newHome,
                [newForeign.id]: newForeign
            }
        };
        this.setState(newState);
    }

    render() {
        const {inputListTitle, listOrder, list } = this.state;
        return(
            <div className='board-body'>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <Droppable
                        droppableId='all-columns'
                        direction='horizontal'
                        type='column'
                        key={list.id}
                    >
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}                                
                            >
                                {/* <SimpleStorage parent={this} prefix='test' /> */}                                
                                <div className='lists-flex-row'>
                                {listOrder.map((listId, index) => {                                    
                                    const list = this.state.list[listId];
                                    return (
                                        
                                        <Draggable
                                            draggableId={listId}
                                            index={index}
                                        >                                            
                                            {(provided)=> (
                                                <div
                                                    {...provided.draggableProps}
                                                    ref={provided.innerRef}                                                    
                                                    {...provided.dragHandleProps}
                                                >
                                                    <div className='lists-flex-row'>
                                                        {list.title
                                                        ?
                                                            <div className='add-list'>
                                                                <div className='list-body'>
                                                                    {/* <span className='list-heading'>{list.title}</span> */}
                                                                    <Input id='list-heading' value={list.title} onChange={(e) => this.handleInputTitleChange(listId, e)} />
                                                                    <Icon className='icon-right' type='cross' style={{color: 'red'}} onClick={(e) => this.handleDeleteList(listId, e)} />
                                                                </div>
                                                                {provided.placeholder}

                                                                <Droppable
                                                                    droppableId={listId}
                                                                    type='task'
                                                                >
                                                                    {(provided) => (
                                                                        <div
                                                                            ref={provided.innerRef}
                                                                            {...provided.droppableProps}
                                                                        >
                                                                            {provided.placeholder}
                                                                            {list.taskId.map((id, index) => (
                                                                                <Draggable
                                                                                    key={id}
                                                                                    draggableId={id}
                                                                                    index={index}
                                                                                >
                                                                                    {(provided) => (
                                                                                        <div                                                                                            
                                                                                            {...provided.draggableProps}
                                                                                            {...provided.dragHandleProps}
                                                                                            ref={provided.innerRef}
                                                                                        >
                                                                                            {provided.placeholder}
                                                                                            {this.state.card[id].body
                                                                                            ? 
                                                                                            <div className='list-card'>
                                                                                                <p className='card-title'>{this.state.card[id].body}</p>
                                                                                            </div>  
                                                                                            : 
                                                                                            null}                                                          
                                                                                        </div>
                                                                                    )
                                                                                }                                                                                
                                                                                </Draggable>                                                                                
                                                                            ))}

                                                                        </div>
                                                                    )}
                                                                    
                                                                </Droppable>                                                                                                
                                                                
                                                                {this.state.list[listId].inputCardTitle 
                                                                ?
                                                                <div className='add-card'>
                                                                    <Form className='list-form'>
                                                                        <Icon id='cross-icon' type='cross' style={{color: 'red'}} onClick={(e) => this.handleDeleteCard(listId, this.state.list[listId].taskId[this.state.list[listId].taskId.length-1], e)} />
                                                                        <Input name='list-title' id='list-title-input' size='large' placeholder='Enter title of the card' onChange={(e) => this.handleCardTitleChange(this.state.list[listId].taskId[this.state.list[listId].taskId.length-1], e)} />                        
                                                                        <Button id='list-title-submit' type='primary' onClick={(e) => this.handleCardTitleSubmit(listId, e)} >Submit</Button>    
                                                                    </Form>
                                                                </div>
                                                                :
                                                                <Button 
                                                                    size='large'
                                                                    onClick={(e) => this.handleAddCardClick(e, listId)}
                                                                    className='add-card-btn'
                                                                >
                                                                    <Icon type='plus' />Add a card
                                                                </Button>
                                                                }
                                                            </div>                                
                                                        :
                                                        null
                                                        }
                                                    </div>
                                                </div>
                                            )}
                                                                                                                                
                                        </Draggable>
                                    )
                                })}         
                                {provided.placeholder}                       

                                <div className='lists-flex-column'>
                                    <Button 
                                        size='large'
                                        onClick={this.handleClick}
                                        className='add-list-btn'
                                    >
                                        <Icon type='plus' />
                                        Add another list
                                    </Button>

                                    {inputListTitle 
                                    ?
                                    <div className='add-list'>
                                        <Form className='list-form' onSubmit={this.handleSubmit}>
                                            <Icon id='cross-icon' type='cross' style={{color: 'red'}} onClick={this.handleDelete} />
                                            <Input name='list-title' id='list-title-input' size='large' placeholder='Enter title of the list' onChange={(e) => this.handleInputTitleChange(listOrder[listOrder.length-1], e)} />                        
                                            <Button id='list-title-submit' type='primary' onClick={this.handleTitleSubmit} >Submit</Button>    
                                        </Form>
                                    </div>
                                    :
                                    null
                                    }
                                </div>  

                            </div>                            
                        </div>
                        )}
                        
                    </Droppable>
                </DragDropContext>  
            </div>
        );
    }
}

export default List;