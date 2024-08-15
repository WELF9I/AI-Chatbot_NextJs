# AI Chatbot

![image](https://github.com/user-attachments/assets/bd9c1974-1573-4299-b210-35ca864d75be)

## Overview

Welcome to the **AI Chatbot** project! This web application is designed to be your personal AI assistant, capable of engaging in conversations, answering queries, and assisting with various tasks. The chatbot is built with modern web technologies, ensuring a seamless and responsive user experience.

## Features

- **Real-time Conversations**: Engage in real-time conversations with the AI assistant.
- **Chat History**: View past conversations and continue from where you left off.
- **User Authentication**: Secure user authentication with Clerk.
- **Dark Mode**: Supports dark mode for a comfortable viewing experience.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Tech Stack

### Frontend

- **Next.js 14**: The React framework used for building the frontend.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Shadcn UI**: For advanced and accessible UI components.
- **TypeScript**: Strongly typed programming language that builds on JavaScript.

### Backend

- **Node.js**: JavaScript runtime for executing backend code.
- **Express.js**: Minimal and flexible Node.js web application framework.
- **PostgreSQL**: SQL database for storing conversations and user data.
- **Clerk**: User management and authentication.
- **Gemini API**: AI model powering the chatbot's conversational capabilities.

## Installation

### Prerequisites

- Node.js (version 14 or higher)
- PostgreSQL
- Clerk account for user authentication
- Gemini API access for AI chat

### Setup

1. **Clone the repository**:
    ```bash
    git clone https://github.com/WELF9I/AI-Chatbot_NextJs.git
    cd AI-Chatbot_NextJs
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Setup environment variables**:
   Create a `.env` file in the root directory and add your environment variables. Example:
    ```env
    DATABASE_URL=your_postgresql_database_url
    CLERK_SECRET_KEY=your_clerk_api_key
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_public_api_key
    API_KEY=your_gemini_api_key
    ```
    
5. **Start the development server**:
    ```bash
    npm run dev
    ```

   The application will be running at `http://localhost:3000`.

## Usage

- **Sign Up/Sign In**: Users can sign up or sign in using Clerk.
- **Start a Conversation**: Begin chatting with the AI assistant right away.
- **View Chat History**: Access your previous conversations through the sidebar.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue to discuss potential changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

For any inquiries or support, please contact [your-email@example.com](mailto:your-email@example.com).

