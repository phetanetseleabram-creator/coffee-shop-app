# ☕ Bean & Brew - Coffee Shop Management System

A full-stack web application designed to modernise coffee shop operations. Customers can view the menu and place orders, while staff can manage the menu, process orders, and view daily summaries.

##  Live Deployment
* **Frontend (React):** https://coffee-shop-app-nu.vercel.app
* **Backend API (Express):** https://coffee-shop-ap2.onrender.com
* **Database:** Upstash Redis (Persistent Key-Value Store)

##  Technologies Used
* **Frontend:** React (Vite), React Router, Fetch API, Vanilla CSS
* **Backend:** Node.js, Express.js
* **Database:** Redis (Upstash)
* **Deployment:** Vercel (Frontend), Render (Backend)

##  Features
* **Customer Interface:** View menu, add/remove items from cart, place an order, and view order confirmation.
* **Staff Dashboard:** Protected by an API key. Staff can add/delete menu items, update prices, mark items as unavailable, view all orders, update order statuses (Pending, Preparing, Ready, Collected), and view daily revenue summaries.

##  API Endpoints
* `GET /api/health` - Check backend availability
* `GET /api/menu` - Retrieve all menu items
* `POST /api/menu` - Add a new item (Staff only)
* `PUT /api/menu/:id` - Update an item (Staff only)
* `DELETE /api/menu/:id` - Delete an item (Staff only)
* `GET /api/orders` - Retrieve all orders (Staff only)
* `POST /api/orders` - Place a new order
* `PATCH /api/orders/:id/status` - Update order status (Staff only)

##  Running Locally
1. Clone the repository: `git clone https://github.com/phetanetseleabram-creator/coffee-shop-app.git`
2. **Backend Setup:**
   * `cd backend`
   * `npm install`
   * Create a `.env` file with: `PORT=5000`, `REDIS_URL=your_redis_url`, `STAFF_API_KEY=staff-secret-123`, `FRONTEND_URL=http://localhost:5173`
   * `npm run dev`
3. **Frontend Setup:**
   * `cd frontend`
   * `npm install`
   * Create a `.env` file with: `VITE_API_URL=http://localhost:5000`
   * `npm run dev`
