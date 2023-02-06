<div align= >
   

# <img align=center width=75px height=75px src="https://media1.giphy.com/media/mDN904TRuZwJhmc4mf/giphy.gif?cid=ecf05e47i8t7ozdn1ted9aqqf1z56vqkt9kwei9b5d46c4hy&rid=giphy.gif&ct=s"> NonLegit API


</div>
<div align="center">
   <img align="center"  width="675px" src="https://user-images.githubusercontent.com/71986226/210291217-ebbf139b-a191-4300-b135-97b24414f7b4.gif" alt="logo">


### ”RESTful API  mimics version of Reddit Backend using its open API“
   
</div>
 
<p align="center"> 
    <br> 
</p>

## <img align= center width=50px height=50px src="https://thumbs.gfycat.com/HeftyDescriptiveChimneyswift-size_restricted.gif"> Table of Contents

<!-- - <a href ="#about"> 📙 Overview</a> -->
<!-- - <a href ="#features"> 🔍 Features</a> -->
- <a href ="#Developed_With"> 🌎 Developed With</a>
- <a href ="#Get_Started"> 💻 Get Started </a>
- <a href ="#API_Documentation"> 🏁 API Documentation</a>
- <a href ="#Software_Architecture"> 🛠 Software Architecture</a>
- <a href ="#design_patterns"> 🛠 Software Design Patterns</a>
- <a href ="#System_Structure"> 📂System Structure</a>
- <a href ="#Database_Design"> 🧾Database Design</a>
- <a href ="#contributors"> ✍️ Contributors</a>
- <a href ="#license"> 🔒 License</a>
<hr style="background-color: #4b4c60"></hr>

## 🌎 Developed With <a id ="Developed_With"></a>

- Node.js
- MongoDB
- Express.js
- Mongoose
- Firebase
- Nodemailer
- Crypto
- Bcryptjs
- Awilix
- Google auth library
- Passport
- Json web token
- Multer
- Mocha
- Super Test
- Chai

<hr style="background-color: #4b4c60"></hr>

## 💻 Get Started <a id = "Get_Started"></a>

<br>

1 - Clone the repository
```
git clone https://github.com/NonLegit/Backend-Reddit.git
```
2- Navigate to project folder

```shell
cd Backend-Reddit/API/
```
3 - Install libraries & modules
```
npm install
```

4 - Create .env file

> NODE_ENV= development <br>
PORT=  port number  <br>
DATABASE=  deployed database connection string <br>
DATABASE_LOCAL= local database connection string<br>
DATABASE_PASSWORD= database password <br>
FRONTDOMAIN = front url <br>
BACKDOMAIN = back url  <br>
CROSSDOMAIN = cross url  <br>
JWT_SECRET= token secret key <br>
JWT_EXPIRES_IN=  expire date of token <br>
JWT_COOKIE_EXPIRES_IN= expire date of cookies <br>
NONLEGITEMAIL= Sender Email <br>
NONLEGITPASSWORD= Sender password <br>
EMAIL_PORT= email port number of email service <br>
EMAIL_HOST= host of email service <br>
FACEBOOK_APP_ID = facebook app id  <br>
FACEBOOK_APP_SECRET =  facebook app password <br>
GOOGLE_APP_ID = google app id  <br>
GOOGLE_APP_SECRET = google app password <br>
FIREBASE_SERVER_KEY = firebase secret key <br>


5- Upload database seeds 

```shell
npm run migrate
```
6- Run server 

```shell
npm run start
```
7- Generate Unit testing reports

```shell
npm run test_covarage
```
8- Generate functional documentation 

```shell
npm run jsdoc
```

<hr style="background-color: #4b4c60"></hr>

<!-- ## 🔍 Features <a id = "features"></a>

<hr style="background-color: #4b4c60"></hr> -->

## 🏁 API Documentation <a id ="API_Documentation"></a>

All details about each endpoint can be 
[Found Here](https://htmlpreview.github.io/?https://github.com/NonLegit/Backend-Reddit/blob/API_documentation/index.html)

<hr style="background-color: #4b4c60"></hr>

## 🛠 Software Architecture <a id = "Software_Architecture"></a>

<div align="center">
   <img align="center"  width="675px" src="https://user-images.githubusercontent.com/75908511/217017523-5a84ca11-b4b7-4091-916e-946a40bea3d7.png" alt="logo">
</div>

<br>

- ### Domain Layer

  - This layer lies in the center of the architecture where we have application basic entities which are the application model classes or database model classes.

- ### Repository Layer

    - The repository layer act as a middle layer between the service layer and model objects.This contain data access pattern for reading and writing operations with the database/ domain layer.


- ### Service Layer

    - This layer is used to communicate with the presentation and repository layer. The service layer holds all the business logic of the each entity.In this layer services interfaces are kept separate from their implementation for loose coupling and separation of concerns.

- ### Presentation Layer

    - API presentation layer can be connected to our UI applications.<br>
      - [Web Application](https://github.com/NonLegit/Front-End)
      - [Mobile Application](https://github.com/NonLegit/reddit_cross_platform)



<hr style="background-color: #4b4c60"></hr>

## 🛠 Software Design Patterns <a id ="design_patterns"></a>

1- MVC
<div align="center">
   <img align="center"  width="675px" src="https://user-images.githubusercontent.com/75908511/217035072-8b76f03e-16c5-4574-b465-09defee0c32d.png" alt="logo">
</div>

<br>

2- Dependency Injecton

<div align="center">
   <img align="center"  width="675px" src="https://user-images.githubusercontent.com/75908511/217035305-05c40ff4-5acf-4613-868b-33fa692c81eb.png" alt="logo">
</div>

<br>

3- Singleton

<div align="center">
   <img align="center"  width="675px" src="https://user-images.githubusercontent.com/75908511/217035464-ba4046ab-03ab-4c64-a043-d86ac4d0f3d7.png" alt="logo">
</div>

<br>

<hr style="background-color: #4b4c60"></hr>

## 📂System Structure <a id ="System_Structure"></a>

<details> 
<summary style= "margin:10px">Structure</summary>
<ul>
<li>┣ 📂controllers	</li>		 
<li>  ┃ ┗ 📜userController.js</li>
<li>┣ 📂data-access	</li>
<li>  ┃ ┗ 📜repository.js</li>
<li> ┣ 📂error-handling	</li> 
<li> ┃ ┗ 📜appError.js</li>
<li> ┣ 📂models	</li>
<li> ┃ ┗ 📜userModel.js</li>
<li>  ┣ 📂migrations</li>
<li>  ┃ ┗ 📜seeder.js</li>
<li>  ┣ 📂public</li>
<li>  ┃ ┣ 📂posts</li>
<li> ┃ ┣ 📂subreddits</li>
<li> ┃ ┣ 📂users</li>
<li> ┣ 📂routes	</li>	
<li>  ┃ ┗ 📜userRoutes.js</li>
<li> ┣ 📂service</li>
<li>  ┃ ┣ 📜service.js</li>
<li>  ┃ ┗ 📜userService.js</li>
<li> ┣ 📂 test	</li>
<li> ┣ 📜app.js	</li>
<li> ┗ 📜server.js</li>
</ul>
</details>


<hr style="background-color: #4b4c60"></hr>

## 🧾Database Design <a id = "Database_Design"></a>

<div align="center">
   <img align="center"  width="675px" src="https://user-images.githubusercontent.com/75908511/217030333-90f1e249-e045-4a31-8613-96da759009a1.png" alt="logo">
</div>

<br>

All details about database design can be 
[Found Here](https://github.com/NonLegit/Backend-Reddit/tree/main/ER)

<hr style="background-color: #4b4c60"></hr>

## ✍️ Contributors <a id ="contributors"></a>

<table align="center" >
  <tr>
     <td align="center"><a href="https://github.com/KirollosSamy"><img src="https://user-images.githubusercontent.com/75908511/216993897-2aeec76f-10b2-441b-ba77-92754666e6e3.jpg" width="150px;" alt=""/><br /><sub><b>Kirollos Samy</b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/Ahmedsabry11"><img src="https://user-images.githubusercontent.com/75908511/216994638-9b150522-3bb0-4a1e-a78a-c9e4c5f6fffd.jpg" width="150px;" alt=""/><br /><sub><b>Ahmed Sabry</b></sub></a><br /></td>
     <td align="center"><a href="https://github.com/khaHesham"><img src="https://user-images.githubusercontent.com/75908511/216994244-7404a45d-5beb-4a85-b1a0-6b9dcb5f8c38.jpg"
 width="150px;" alt=""/><br /><sub><b>Khaled Hesham</b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/doaa281"><img src="https://user-images.githubusercontent.com/75908511/216994456-df8d6674-0906-4728-91e1-202e344e641b.png" width="150px;" alt=""/><br /><sub><b>Doaa Achraf</b></sub></a><br /></td>
    
  </tr>
</table>

<hr style="background-color: #4b4c60"></hr>

## 🔒 License <a id ="license"></a>
> This software is licensed under MIT License, See [License](https://github.com/NonLegit/Backend-Reddit/blob/main/LICENSE) for more information ©NonLegit.