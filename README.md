# Nexora E-Com Cart: Full Stack Coding Assignment

## Overview
A basic full-stack shopping cart application built as a coding assignment for Vibe Commerce screening. This application handles adding/removing items, calculating totals, and a mock checkout process (without real payments). It demonstrates UI, API, and database integration for typical e-commerce flows.

## Tech Stack
*   **Frontend:** React
*   **Backend:** Node.js with Express.js
*   **Database:** MongoDB (using Mongoose ORM)

## Features

### Backend APIs
The backend provides the following RESTful API endpoints:

*   `GET /api/products`: Retrieves a list of 5-10 mock product items, each with an `id`, `name`, and `price`.
*   `POST /api/cart`: Adds a product to the cart. Requires `productId` and `qty` in the request body.
*   `DELETE /api/cart/:id`: Removes a specific item from the cart using its cart item `id`.
*   `GET /api/cart`: Fetches the current cart contents, including all items and the calculated total.
*   `POST /api/checkout`: Processes the checkout with the current `cartItems` and returns a mock receipt (total, timestamp).

### Frontend (React Application)
The React frontend offers a user-friendly interface with the following features:

*   **Products Grid:** Displays a grid of available products, each with an "Add to Cart" button.
*   **Cart View:** A dedicated page to view items in the cart, adjust quantities, see the total, and remove items.
*   **Checkout Form:** A form for users to enter their name and email (for guest checkout) or confirm details (for logged-in users) and shipping address. Submitting this form leads to a mock receipt modal.
*   **Responsive Design:** The application is designed to be responsive and work well across various device sizes.
*   **User Authentication:** Register, Login, and My Account pages for user management.
*   **Order History:** Logged-in users can view their past orders.

## Bonus Features Implemented
*   **DB Persistence:** User and product data are persisted in MongoDB. A mock user (`test@example.com` / `Password123!@#`) is created on server startup if not already present.
*   **Error Handling:** Basic error handling is implemented for API calls and user interactions.
*   **Guest Cart Functionality:** Users can add items to the cart and checkout as a guest without logging in. Guest carts are merged with user carts upon login/registration.

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites
*   Node.js (LTS version recommended)
*   npm (Node Package Manager)
*   MongoDB instance (local or cloud-hosted, e.g., MongoDB Atlas)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/royalsrivastavagithub/nexora-mock-ecom-cart.git
    cd nexora-mock-ecom-cart
    ```

2.  **Install dependencies:**
    The project uses `concurrently` to manage dependencies for both frontend and backend.
    ```bash
    npm install
    ```
    This command will automatically install dependencies for both `backend` and `frontend` directories.

### Configuration

1.  **Backend Environment Variables:**
    Create a `.env` file in the `backend/` directory with the following content:
    ```
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    JWT_EXPIRES_IN=1h
    PORT=5000
    ```
    *   Replace `your_mongodb_connection_string` with your MongoDB connection URI (e.g., `mongodb://localhost:27017/ecomcart` or your MongoDB Atlas connection string).
    *   Replace `your_jwt_secret_key` with a strong, random string for JWT signing.

### Running the Application

To start both the frontend and backend servers concurrently:

```bash
npm run dev
```

*   The backend API will run on `http://localhost:5000` (or the `PORT` specified in your `.env` file).
*   The frontend React application will run on `http://localhost:5173` (or another port if 5173 is in use).

Open your browser and navigate to the frontend URL to access the application.

## Screenshots
*(Placeholder for screenshots)*
<img width="2560" height="1440" alt="Screenshot from 2025-11-07 20-29-19" src="https://github.com/user-attachments/assets/9095b9f1-cab6-4a8d-8f4c-afef2b5ea40f" /><img width="2560" height="1440" alt="Screenshot from 2025-11-07 20-29-28" src="https://github.com/user-attachments/assets/b26314e6-4dd1-4026-bde6-38a1d4056f08" /><img width="2560" height="1440" alt="Screenshot from 2025-11-07 20-30-02" src="https://github.com/user-attachments/assets/df3d00a5-6ddb-46dd-a695-dc12ea7561ab" />
<img width="2560" height="1440" alt="Screenshot from 2025-11-07 20-30-22" src="https://github.com/user-attachments/assets/06e9075b-cf27-4e1b-a9f8-9bf3bc384bb9" />
<img width="2560" height="1440" alt="Screenshot from 2025-11-07 20-30-27" src="https://github.com/user-attachments/assets/8c1afc9d-2cc1-4fa2-bfc9-7fdfaa90ca18" />
<img width="2560" height="1440" alt="Screenshot from 2025-11-07 20-30-31" src="https://github.com/user-attachments/assets/48b64fd7-2cf7-40bd-9ad7-1ed819688f65" />
<img width="2560" height="1440" alt="Screenshot from 2025-11-07 20-30-48" src="https://github.com/user-attachments/assets/05e9b88b-d6cd-44cd-9a5c-bb0cf1530746" />
<img width="2560" height="1440" alt="Screenshot from 2025-11-07 20-30-54" src="https://github.com/user-attachments/assets/95b80c0b-7a03-4225-8857-12eb29418bbc" />

<img width="2560" height="1440" alt="Screenshot from 2025-11-07 20-31-01" src="https://github.com/user-attachments/assets/450669f2-7f3d-4c55-80cb-7e894219d04b" />
<img width="2560" height="1440" alt="Screenshot from 2025-11-07 20-31-15" src="https://github.com/user-attachments/assets/33813da7-e19b-411f-aea1-e72ccd1ed7f9" />


## Demo Video
*(Placeholder for Loom/YouTube unlisted link)*

## Project Structure

```
nexora-mock-ecom-cart/
├───backend/
│   ├───config/             # Database configuration
│   ├───controllers/        # API logic handlers
│   ├───middleware/         # Authentication and session middleware
│   ├───models/             # Mongoose schemas for data models
│   ├───routes/             # API route definitions
│   ├───server.js           # Main backend server file
│   ├───package.json
│   └───.env                # Environment variables (create this file)
├───frontend/
│   ├───public/             # Static assets
│   ├───src/
│   │   ├───components/     # Reusable React components
│   │   ├───contexts/       # React Context API for state management
│   │   ├───pages/          # Page-level React components
│   │   └───App.jsx         # Main React application component
│   ├───index.html
│   ├───package.json
│   └───vite.config.js      # Vite configuration for proxying API requests
└───package.json            # Root package.json for concurrent scripts
```
