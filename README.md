# How to run
## Backend

If you're using Windows :
``` 
cd backend
npm install
npm start
```

If you're using UNIX/MacOS :
``` 
cd backend
npm install
npm start
```

### NOTE : We are also uploading a postman collection to make it easier to test the APIs in the root folder of the project

## Frontend
If you're using Windows :
``` 
cd pennstagram
npm install
npx eslint -c ..\pennstagram\.eslintrc.js ..\penstagram\ --fix
```
If you're using UNIX/MacOS :
``` 
cd pennstagram
npm install
npx eslint -c ../pennstagram/.eslintrc.js ../penstagram/ --fix
```

After the above command run
```
npm start
```

2. **Start Json server: `json-server --watch db.json --port 3001`**
3. **Run jest ui test: `npm run test`**

# How to login
1. Please use default email "kycjosh@seas.upenn.edu"
2. Please use default password "1"

# How to sign up
1. Enter user first name, last name, email address, and password.
2. Press submit.
3. Json server store thee new user data in the database (you can login with this email and password, however, in order to show the deliverables, you would be directed into our default user's account)

# Backend mocking notes
1. All endpoints call functions are in **api.js**.
2. Mock API file (Json server) is **db.json**.

# How to follow user
1. If the icon is gray, click to follow.
2. If the icon is red, click to unfollow.
<br />![擷取](https://user-images.githubusercontent.com/12096543/197316122-ad2f9ef5-73fc-4b59-b9fa-04f9b8d6e084.PNG)

# Navigation bar guidance
![image](https://user-images.githubusercontent.com/12096543/197316346-26472d04-3775-402d-8969-30d5771586fb.png)

# P.S.
1. **For homework2**, when we uplpoad videos, we use templorary urls instead of real urls in json server for backend mocking. Therefore, when you upload the second videos, you might not see the previous video that you uploaded. This is because the first video's url's life cycle has been terminated.
<br />**Solution**: In the future, we will be storing images and videos in real servers, so the urls will always be accessible and the issue will be resolved.
2. **For homework3**, when clicking the @mention, it will redirect to other user's page.

  
# project_design
Photo&amp;Video-sharing Social Network APP -  UI &amp; Architecture Design (HW1)

# Table of Contents
## 1. Team Agreement
Wiki page link: https://github.com/cis557/project---design-hw1-group-22/wiki/Team-Agreement
## 2. User Stories
Wiki page link: https://github.com/cis557/project---design-hw1-group-22/wiki/User-Story-List-Page
## 3. User Flow Design
Google Doc link: https://docs.google.com/document/d/e/2PACX-1vTQdduE0BEQMDTbNsS40pwThslfC3pU5uywWRwT5ympwhxBjWvMZue651eemgAW4ohP0LrjVgkeXZs7/pub
## 4. Wireframes and Prototypes
Figma link: https://www.figma.com/file/HnAwGa07uomcslR8ZbAGOS/Homework1-Wireframes?node-id=93%3A536
## 5. Data Schema Design
PDF link: https://github.com/cis557/project---design-hw1-group-22/blob/model-diagrams/database/DataDiagram%26Model.drawio.pdf
## 6. API Documentation
SwaggerHub link: https://app.swaggerhub.com/apis/HedgeHog-Head/pennstagram-api/1.0.0
