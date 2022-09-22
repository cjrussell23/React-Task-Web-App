import React from 'react'
import Todo from './Todo'

export default function TodoList({todos, toggleTodo, updateTodoName, handleDeleteTodo, editing }) {
    return (
        <div>
            {todos.map(todo => {
                return <Todo key={todo.id} todo={ todo } toggleTodo={toggleTodo} updateToDoName={updateTodoName} handleDeleteTodo={handleDeleteTodo} editing={editing} />
                })
            }
        </div>
    )
}
