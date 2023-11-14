# Finance Health Calculator

Overview
--------

Finance Health Calculator is a web application designed to help users manage and analyze their finances for a healthier financial future. It provides features such as calculating financial health scores, visualizing financial data, and offering personalized suggestions based on the user's financial metrics.

Live at: [https://finance-helth-calculator.vercel.app](https://finance-helth-calculator.vercel.app)

Motivation
----------

The primary goal of Finance Health Calculator is to empower users with tools and insights to make informed financial decisions. By assessing various financial metrics and providing actionable suggestions, the application aims to guide users towards improved financial health.

Tech Stack
----------

* **Frontend:**

  * ReactJS
  * React Google Chart for data visualization
  * React Router for navigation
  * Tailwind CSS for styling
* **Backend:**

  * Python FastAPI for the server
  * PostgreSQL for the database
  * SqlAlchemy as the ORM
* **Authentication:**

  * JWT (JSON Web Tokens) for user authentication
* **Deployment:**

  * Vercel for both the frontend and the backend
  * PostgreSQL hosted on Vercel for the database

Features
--------

1. **User Authentication:**

   * Secure user registration and login using JWT.
   * Guest users can use the calculator without the need for authentication.
2. **Financial Health Calculation:**

   * Algorithm-based financial health score calculation.
   * Consideration of metrics such as disposable income, debt-to-income ratio, savings rate, and net worth.
3. **Data Visualization:**

   * Interactive charts and graphs to visualize financial data.
   * Monthly tracking of financial metrics for informed decision-making.
4. **Personalized Suggestions:**

   * Customized suggestions based on the user's financial health score and metrics.
   * Actionable advice to improve financial well-being.
5. **Guest User Access:**

   * Guest users can access the calculator without creating an account.
   * Full functionality available for both registered and guest users.

Installation
------------

1. **Clone the Repository:**

   `git clone https://github.com/mahfuzurrahman98/finance-health-calculator.git cd finance-health-calculator`
2. **Install Dependencies:**

   Install frontend dependencies

   `cd client`
   `npm install`

   Install backend dependencies

   `cd server`
   `pip install -r requirements.txt`
3. **Set Up Database:**

   * Create a PostgreSQL database and configure the connection in the `server/.env` file.
4. **Run the Application:**

   Run the backend server by entering the below commads:

   `cd server`
   `uvicorn main:app --reload`

   Run the frontend server by entering the below commads:

   `cd client`
   `npm run dev`

Usage
-----

1. **User Registration:**

   * Create an account to access personalized features.
2. **Guest User Access:**

   * Guest users can use the calculator without logging in.
3. **Calculate Finance:**

   * Input monthly income, expenses, debts, and assets to calculate your financial health score.
4. **Visualize Data:**

   * Explore charts and graphs to gain insights into your financial metrics.
5. **Receive Suggestions:**

   * Receive personalized suggestions based on your financial health score.

Contributing
------------

We welcome contributions from the community. Feel free to open issues, submit feature requests, or contribute code through pull requests.

License
-------

This project is licensed under the [MIT License](LICENSE).
