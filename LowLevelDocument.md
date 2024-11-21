<center><h2>Low-Level Document for Todo_Renewed</h2></center>

**1. Overview**

This document provides technical details on the implementation of the "Todo_Renewed" application, focusing on specific components, data flows, and configurations.

---

**2. Module Descriptions**

**Frontend**

- **Tech Stack**: React.js, Zustand (state management), Tailwind CSS, Vite.
- **Components**:
  - `App.jsx`: Entry point of the application.
  - `TodoList.jsx`: Renders the list of tasks and handles task actions.
  - `Auth.jsx`: Manages user authentication screens (login, signup, etc.).
  - `Navbar.jsx`: Provides navigation options.
- **APIs Used**:
  - `/api/auth`: For user authentication (login, signup, verify).
  - `/api/todos`: CRUD operations for todo items.

**Backend**

- **Tech Stack**: Node.js, Express.js.
- **APIs**:
  - **Authentication APIs**:
    - `POST /auth/signup`: Registers a new user.
    - `POST /auth/login`: Authenticates and returns a JWT.
    - `POST /auth/reset-password`: Handles password resets.
  - **Todo APIs**:
    - `GET /todos`: Fetches all todos for a user.
    - `POST /todos`: Creates a new todo.
    - `PUT /todos/:id`: Updates a specific todo.
    - `DELETE /todos/:id`: Deletes a specific todo.
- **Middleware**:
  - `authMiddleware.js`: Verifies JWT for protected routes.
  - `errorHandler.js`: Handles global errors.

**Database**

- **Tech Stack**: MongoDB (via Mongoose ODM).
- **Collections**:
  - **Users**:
    - Fields: `\_id`, `email`, `passwordHash`, `isVerified`, `resetToken`.
  - **Todos**:
    - Fields: `\_id`, `title`, `description`, `completed`, `userId`.

---

**3. Data Flow**

1. User initiates a request from the frontend (e.g., create a new todo).
1. The frontend sends an HTTP request to the backend API with the necessary data.
1. The backend processes the request, interacts with the database, and returns the response.
1. The frontend updates the UI based on the response.

---

**4. Configurations**

- **Environment Variables**:
  - `MONGO_URI`: MongoDB connection string.
  - `JWT_SECRET`: Secret for signing JWTs.
  - `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASS`: For email service configuration.
- **File Structure**:
  - **Frontend**: `/src` contains React components and state management.
  - **Backend**: `/routes`, `/middleware`, `/controllers`, and `/models`.

---

**5. Testing**

- **Unit Testing**:
  - Tools: Jest (backend), React Testing Library (frontend).
  - Coverage: APIs, state management, component rendering.
- **Integration Testing**:
  - Simulate user actions (e.g., login and creating todos) to test end-to-end flows.

---

This LLD outlines detailed implementation guidelines for development and debugging. Additional information is available in the [GitHub repository](https://github.com/soumya3969/Todo_Renewed).
