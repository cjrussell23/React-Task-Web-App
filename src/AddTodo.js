import React from 'react'

export default function AddTodo({ todoNameRef, handleAddTodo }) {
    return (
        <div className="input-group my-2">
            <input type="textarea" className="form-control" ref={todoNameRef} 
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    handleAddTodo();
                }
            }}/>
            <button className="btn btn-primary" onClick={handleAddTodo}>Add Todo</button>
        </div>
    )
}
