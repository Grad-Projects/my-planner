# My Planner App
Your daily go-to planner app

## How to run locally
- Clone the repo into the directory of your choice on WSL
- cd into the root directory of the code (the same directory as the `docker-compose.yml` file)
- Ensure you have docker and docker-compose installed on WSL (you can run `docker --version` and `docker-compose --version` to check)
- While in the root directory, open your terminal and run `docker-compose pull`
- After succesfully pulling all three images, run `docker-compose up`
- This will run the database server, api, and frontend which are all available on localhost

## Once it is running
- The api will be running on `https://localhost:8080`
- The frontend will be running on `https://localhost:5500`
- **NB:Ensure that you enter both of these URLs into your browser and approve/accept that they are safe (they are using self signed certificates). If this step is not done you will get CORS errors**
- Refer to our backend/Testing/test.rest file to see the list of valid API calls that can be made
- For aquiring an access token to make your API calls, I would recommend to login using the frontend, and then inspect your browser's localStorage for the accessToken obtained, this should be placed in an `Authorization: Bearer <token>` heading with all of your requests

## Test data
- When the database server starts in the container it initialized the tables and test data using the SQL script in the backend/Testing folder

## API documentation
https://documenter.getpostman.com/view/33335643/2sA3Qza8zu