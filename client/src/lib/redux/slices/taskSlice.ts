import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTasks, createTask, updateTask, deleteTask } from '@/lib/appwriteConfig';
import { Task } from '@shared/schema';

export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  activeTask: Task | null;
  isFormOpen: boolean;
  isEditing: boolean;
  draggedTask: Task | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
  activeTask: null,
  isFormOpen: false,
  isEditing: false,
  draggedTask: null,
};

// Async thunks
export const fetchUserTasks = createAsyncThunk(
  'tasks/fetchUserTasks',
  async (userId: string, { rejectWithValue }) => {
    try {
      const tasks = await fetchTasks(userId);
      return tasks;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch tasks');
    }
  }
);

export const addNewTask = createAsyncThunk(
  'tasks/addNewTask',
  async (taskData: any, { rejectWithValue }) => {
    try {
      const response = await createTask(taskData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add task');
    }
  }
);

export const editTask = createAsyncThunk(
  'tasks/editTask',
  async ({ taskId, data }: { taskId: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await updateTask(taskId, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update task');
    }
  }
);

export const removeTask = createAsyncThunk(
  'tasks/removeTask',
  async (taskId: string, { rejectWithValue }) => {
    try {
      await deleteTask(taskId);
      return taskId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete task');
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setActiveTask: (state, action: PayloadAction<Task | null>) => {
      state.activeTask = action.payload;
      state.isEditing = !!action.payload;
    },
    toggleTaskForm: (state, action: PayloadAction<boolean>) => {
      state.isFormOpen = action.payload;
      if (!action.payload) {
        state.activeTask = null;
        state.isEditing = false;
      }
    },
    setDraggedTask: (state, action: PayloadAction<Task | null>) => {
      state.draggedTask = action.payload;
    },
    moveTask: (state, action: PayloadAction<{ taskId: string; quadrant: number }>) => {
      const { taskId, quadrant } = action.payload;
      const taskIndex = state.tasks.findIndex(task => task.$id === taskId);
      
      if (taskIndex !== -1) {
        state.tasks[taskIndex].quadrant = quadrant;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchUserTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchUserTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add task
      .addCase(addNewTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
        state.isFormOpen = false;
      })
      .addCase(addNewTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Edit task
      .addCase(editTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(task => task.$id === action.payload.$id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        state.isFormOpen = false;
        state.activeTask = null;
        state.isEditing = false;
      })
      .addCase(editTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete task
      .addCase(removeTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter(task => task.$id !== action.payload);
      })
      .addCase(removeTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Toggle task completion
      .addCase(toggleTaskCompletion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleTaskCompletion.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(task => task.$id === action.payload.$id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(toggleTaskCompletion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const toggleTaskCompletion = createAsyncThunk(
  'tasks/toggleCompletion',
  async (taskId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const task = state.tasks.tasks.find(t => t.$id === taskId);
      if (!task) throw new Error('Task not found');
      
      const response = await updateTask(taskId, { completed: !task.completed });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to toggle task completion');
    }
  }
);

export const { setActiveTask, toggleTaskForm, setDraggedTask, moveTask } = taskSlice.actions;
export default taskSlice.reducer;
