import { Client, Databases, Account, Storage, ID, Query } from "appwrite";

// Appwrite configuration
const appwriteEndpoint =
  import.meta.env.VITE_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
const appwriteProjectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const appwriteDatabaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const appwriteTasksCollectionId = import.meta.env
  .VITE_APPWRITE_TASKS_COLLECTION_ID;

console.log('Appwrite Config:', {
  endpoint: appwriteEndpoint,
  projectId: appwriteProjectId,
  databaseId: appwriteDatabaseId,
  tasksCollectionId: appwriteTasksCollectionId
});

if (!appwriteProjectId || !appwriteDatabaseId || !appwriteTasksCollectionId) {
  throw new Error("Missing Appwrite environment configuration.");
}

// Initialize Appwrite client
export const client = new Client();
client.setEndpoint(appwriteEndpoint).setProject(appwriteProjectId);

// Initialize Appwrite services
export const databases = new Databases(client);
export const account = new Account(client);
export const storage = new Storage(client);

// Collection IDs
export const TASKS_COLLECTION_ID = appwriteTasksCollectionId;
export const DATABASE_ID = appwriteDatabaseId;

// Task Interface
export interface Task {
  $id?: string;
  title: string;
  description: string;
  userId: string;
  quadrant: number;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  tags: string[];
  priority: number;
  color: string;
}

// Create a new user
export const createUser = async (
  email: string,
  password: string,
  username: string,
) => {
  try {
    const userAccount = await account.create(
      ID.unique(),
      email,
      password,
      username,
    );
    if (userAccount.$id) {
      return loginUser(email, password);
    }
    return { success: false, error: "Failed to create account" };
  } catch (error: any) {
    console.error("Error creating user:", error);
    return {
      success: false,
      error: error.message || "Registration failed. Please try again.",
      code: error?.code || "Unknown code",
      type: error?.type || "Unknown type",
    };
  }
};

// Login existing user
export const loginUser = async (email: string, password: string) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    const user = await account.get();
    console.log("Login successful");
    return { success: true, user, session };
  } catch (error: any) {
    console.error("Error logging in:", error);
    return {
      success: false,
      error: error.message || "Login failed. Please try again.",
      code: error?.code || "Unknown code",
      type: error?.type || "Unknown type",
    };
  }
};

// Logout current user
export const logoutUser = async () => {
  try {
    await account.deleteSessions();
    return { success: true, message: "Successfully logged out." };
  } catch (error: any) {
    console.error("Logout error:", error);
    return { success: false, message: "Failed to log out." };
  }
};

// Fetch tasks for a specific user
export const fetchTasks = async (userId: string) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      TASKS_COLLECTION_ID,
      [Query.equal("userId", userId)],
    );
    return response.documents;
  } catch (error: any) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

// Create a new task
export const createTask = async (taskData: Partial<Task>) => {
  try {
    const taskId = ID.unique();
    const timestamp = new Date().toISOString();

    // Only include valid Appwrite fields
    const defaultData = {
      title: taskData.title || "Untitled Task",
      description: taskData.description || "",
      userId: taskData.userId!,
      quadrant: taskData.quadrant || 1,
      completed: false,
      priority: taskData.priority || "medium",
      dueDate: taskData.dueDate || "",
      createdAt: timestamp,
      updatedAt: timestamp,
      tags: taskData.tags || [],
      color: taskData.color || "",
    };

    const response = await databases.createDocument(
      DATABASE_ID,
      TASKS_COLLECTION_ID,
      taskId,
      defaultData,
    );
    return response;
  } catch (error: any) {
    console.error("Error creating task:", error);
    throw error;
  }
};

// Update an existing task
export const updateTask = async (taskId: string, taskData: Partial<Task>) => {
  try {
    // Only include valid Appwrite fields
    const cleanData = {
      title: taskData.title,
      description: taskData.description,
      quadrant: taskData.quadrant,
      completed: taskData.completed,
      priority: taskData.priority,
      dueDate: taskData.dueDate,
      tags: taskData.tags,
      color: taskData.color,
      updatedAt: new Date().toISOString(),
    };
    
    // Remove undefined values
    Object.keys(cleanData).forEach(key => 
      cleanData[key] === undefined && delete cleanData[key]
    );

    const response = await databases.updateDocument(
      DATABASE_ID,
      TASKS_COLLECTION_ID,
      taskId,
      cleanData,
    );
    return response;
  } catch (error: any) {
    console.error("Error updating task:", error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (taskId: string) => {
  try {
    await databases.deleteDocument(DATABASE_ID, TASKS_COLLECTION_ID, taskId);
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting task:", error);
    throw error;
  }
};
