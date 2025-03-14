const taskReducer = (state, action) => {
    switch (action.type) {
        case "SET_TASK":
            return action.payload;
        case "ADD_TASK":
            return [...state, action.payload];
        case "REMOVE_TASK":
            return state.filter((task) => task._id !== action.id);
        case "UPDATE_TASK":
            return state.map((task) =>
                task._id === action.payload._id ? action.payload : task
            );
        case "MARK_DONE":
            return state.map((task) =>
                task._id === action.id ? { ...task, completed: !task.completed } : task
            );
        default:
            return state;
    }
};

export default taskReducer; 