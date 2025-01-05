# Task manager 
## Steps to setup locally
- Need have a node js version above 18 
- Clone the repository
```
git clone https://github.com/rash-27/task-manager.git
```
- Go the parent directory and install the dependencies using
```
npm install
```
- Create a .env file with the attributes present in .env.sample
- Run the local deployment server
```
npm run dev
```
- The deployment server will start at http://localhost:3000

## Features 
- Users can create an account using unique email Id and password
- Once the account is created and the user logs in, he can manage (Create, Read, Update, Delete) his tasks.
- On clicking the profile icon a menu pops up showing the details of the user along with the nummber of tasks he has completed till date !!  
