<center> <h2> High-Level Document for Todo_Renewed  </h2></center>

**1. Overview**

The "Todo_Renewed" is a web-based **Todo Application** developed using the **MERN stack**. It allows users to manage tasks efficiently with features such as adding, editing, deleting, and marking tasks as completed. The application incorporates user authentication with functionalities like sign-up, login, email verification, and password reset.

---

**2. System Architecture**

- **Frontend**: Built with React.js and Tailwind CSS, responsible for the user interface and interaction.
- **Backend**: Developed using Node.js and Express.js to manage APIs, business logic, and authentication.
- **Database**: MongoDB is used for data persistence, including user information and todos.

---

**3. Key Features**

- **Task Management**: Add, edit, delete, and view todos.
- **User Authentication**: Sign-up, login, password reset, email verification, and session management.
- **Data Synchronization**: Cross-device access through cloud-stored data.

---

**4. Technologies Used**

- **Frontend**: React.js, Zustand (state management), Vite, Tailwind CSS, Axios.
- **Backend**: Node.js, Express.js, Mongoose, JSON Web Tokens, Bcrypt.js.
- **Database**: MongoDB.
- **Others**: Email integration for verification.

---

**5. Integration Points**

- **Frontend and Backend Communication**: RESTful APIs.
- **Database Interaction**: Mongoose ODM for MongoDB.
- **Email Services**: Configured using NodeMailer and Gmail.

---

**6. Deployment & Hosting**

- **Development**: Runs locally via npm scripts.
- **Production**: Can be deployed on platforms like AWS, Heroku, or Vercel for full-stack hosting.

---

**7. Assumptions and Constraints**

- Users need a stable internet connection for cross-device functionality.
- Email verification is required for account activation.
- Uses free-tier cloud services for deployment.

---

For detailed instructions and screenshots, visit the GitHub repository: [Todo_Renewed](https://github.com/soumya3969/Todo_Renewed).
