> This project uses .Net Core as backend and PostgreSQL as database. We build these two components on Docker because it is easy to run on different platforms. Therefore, both backend application and database will run on local network.
> All the credential setting are set up, for example, access password for database, JWT encrypt key, etc. We will keep them in related setting files for conveniency of starting applications.
> In the launching stage, backend application starts after the database gets ready and inserts default data into database.

# Steps for setting up the project (Frontend - React)
Assuming the current directory is /RestaurantFoodPlanningSystem
1. Nevigate to /rfps-web
2. Run `npm install` in command prompt to install all necessary packages
3. Run `npm run dev` in command prompt to start the web application
4. Visit the website on http://localhost:3000

# Steps for setting up the project (Backend - .NetCore & PostgreSQL)
Assuming the current directory is /RestaurantFoodPlanningSystem
1. Place docker-compose.yml in folder RestaurantFoodPlanningSystem
2. Place appsettings.json and appsettings.Development.json in folder /RestaurantFoodPlanningSystem/RestaurantFoodPlanningSystem
3. Once openning the project, the project require to restore package by using Nuget. In Intellij Rider, Go to Tools > Nuget > Nuget Restore.
4. In Intellij Rider, adding Run/Debug configuration to run docker-compose.yml to start the database and API applicaiton.
5. Then lauch application.

# Details of this Project

## Group Member
 - Chi Ho Ho (301324743)
 - Kang Yee Tang (301328548)

## Project Description
Restaurant Food Planning System

## Technologies
### Front-end
  - React
### Back-end
  - C#, .Net Core
### Database
  - Postgres

## Functionalities
### Order Subsystem
  - **Place Order**: Allow customers to place order.
  - **Cancel Order**: Allow customers to cancel order.

### Menu Management Subsystem
  - **Create Menu**: Managers can create a menu with different cuisine for different dates.
  - **Update Menu**: Allow managers to update the information of a menu, for example removing cuisine from menu.
  - **Delete Menu**: Allow managers to delete existing menus.
  - **Read Menu**: Allow customers to retrieve current menu based on the date.

### Food Stock Management Subsystem
  - **Insert Food**: Allows restaurant manager to insert the records of food
  - **Update Food**: Allows restaurant manager to update the records of food
  - **Delete Food**: Allows restaurant manager to delete the records of food
  - **Read Food**: Allows restaurant manager to review the records of food
    

### User Management Subsystem
  - **Create Account**: Allow users to sign-up.
  - **Update Account**: Allow users to update password.
  - **Delete Account**: Allow users to delete user account.
  - **Read Account**: Allow users to view existing account.

### Authentication Subsystem
  - **Authenticate users**: Allow users to login into the system.
    
### Database Design
![Database Design](https://github.com/HarusHoChiHo/Restaurant_Food_Planning_System/blob/main/RestaurantFoodPlanningDatabase.png)

### API Document
  - The API document can be viewed in the ways below:
    1. Swagger UI
       - After launching the application, the document can be accessed by visiting the URL above.
       - URL: http://localhost:8081/swagger/index.html

    2. Postman
       - Importing "Postman_collection-RestaurantFoodPlanningSystem.json" into Postman.

    3. HTML file
       - Unzipping the html-api-documentation.zip and open the file "index.html."

## API Endpoints
### User
<table>
 <thead>
  <th>Method</th>
  <th>Route</th>
  <th>Request Body</th>
  <th>Path Variable</th>
 </thead>
 <tbody>
  <tr>
   <td>GET</td>
   <td>/api/User/{id}</td>
   <td>None</td>
   <td>id : integer</td>
  </tr>
  <tr>
   <td>GET</td>
   <td>/api/User</td>
   <td>None</td>
   <td>None</td>
  </tr>
  <tr>
   <td>POST</td>
   <td>/api/User/login</td>
   <td> <pre>{<br/>  "name": "&lt;string&gt;",<br/>  "password": "&lt;string&gt;"<br/>}</pre> </td>
   <td>None</td>
  </tr>
  <tr>
   <td>POST</td>
   <td>/api/User/register</td>
   <td> <pre>{<br/>  "name": "&lt;string&gt;",<br/>  "password": "&lt;string&gt;"<br/>}</pre> </td>
   <td>None</td>
  </tr>
  <tr>
   <td>POST</td>
   <td>/api/User/assign-role/{userId}/{roleId}</td>
   <td>None</td>
   <td><pre>userId : integer,<br/>roleId : integer</pre></td>
  </tr>
  <tr>
   <td>POST</td>
   <td>/api/User/remove-role/{userId}/{roleId}</td>
   <td>None</td>
   <td><pre>userId : integer,<br/>roleId : integer</pre></td>
  </tr>
  <tr>
   <td>DELETE</td>
   <td>/api/User/{id}</td>
   <td>None</td>
   <td><pre>id : integer</pre></td>
  </tr>
 </tbody>
</table>


### Role
<table>
 <thead>
  <th>Method</th>
  <th>Route</th>
  <th>Request Body</th>
  <th>Path Variable</th>
 </thead>
 <tbody>
  <tr>
   <td>POST</td>
   <td>/api/Role/creation</td>
   <td><pre>{<br/>  "name": "&lt;string&gt;",<br/>  "description": "&lt;string&gt;"<br/>}</pre></td>
   <td>None</td>
  </tr>
  <tr>
   <td>DELETE</td>
   <td>/api/Role/{id}</td>
   <td>None</td>
   <td><pre>id : integer</pre></td>
  </tr>
  <tr>
   <td>POST</td>
   <td>/api/Role/read</td>
   <td><pre>{<br/>  "name": "&lt;string&gt;",<br/>  "description": "&lt;string&gt;",<br/>  "id": "&lt;integer&gt;",<br/>  "createdDate": "&lt;dateTime&gt;"<br/>}</pre></td>
   <td>None</td>
  </tr>
  <tr>
   <td>POST</td>
   <td>/api/Role/update</td>
   <td><pre>{<br/>  "name": "&lt;string&gt;",<br/>  "description": "&lt;string&gt;",<br/>  "id": "&lt;integer&gt;"<br/>}</pre></td>
   <td>None</td>
  </tr>
 </tbody>
</table>


### Order
<table>
 <thead>
  <th>Method</th>
  <th>Route</th>
  <th>Request Body</th>
  <th>Path Variable</th>
 </thead>
 <tbody>
 <tr>
   <td>GET</td>
   <td>/api/Order/cancel-order/{id}</td>
   <td><pre>None</pre></td>
   <td><pre>id : integer</pre></td>
  </tr>
  <tr>
   <td>POST</td>
   <td>/api/Order/place-order</td>
   <td><pre>{
  "order": {
    "id": "&lt;integer&gt;",
    "isCanceled": "&lt;boolean&gt;"
   },
   "orderItems": [
     {
         "id": "&lt;integer&gt;",
         "orderId": "&lt;integer&gt;",
         "menuItemId": "&lt;integer&gt;"
      },
      {
         "id": "&lt;integer&gt;",
         "orderId": "&lt;integer&gt;",
         "menuItemId": "&lt;integer&gt;"
      }
   ]
}</pre></td>
   <td><pre>None</pre></td>
  </tr>
 </tbody>
</table>


### DataManagement

  1. Unit
   <table>
   <thead>
     <th>Method</th>
     <th>Route</th>
     <th>Request Body</th>
     <th>Path Variable</th>
    </thead>
    <tbody>
   	<tr>
   	  <td>POST</td>
   	  <td>api/DataManagement/unit/creation</td>
   	  <td><pre>{<br/>  "id": "&lt;integer&gt;",<br/>  "name": "&lt;string&gt;"}</pre></td>
   	  <td><pre>None</pre></td>
   	</tr>
   	<tr>
   	  <td>POST</td>
   	  <td>api/DataManagement/unit/update</td>
   	  <td><pre>{<br/>  "id": "&lt;integer&gt;",<br/>  "name": "&lt;string&gt;"}</pre></td>
   	  <td><pre>None</pre></td>
   	</tr>
   	<tr>
   	  <td>POST</td>
   	  <td>api/DataManagement/unit/read</td>
   	  <td><pre>{<br/>  "id": "&lt;integer&gt;",<br/>  "name": "&lt;string&gt;"}</pre></td>
   	  <td><pre>None</pre></td>
   	</tr>
   	<tr>
   	  <td>DELETE</td>
   	  <td>api/DataManagement/unit/{id}</td>
   	  <td><pre>None</pre></td>
   	  <td><pre>id : integer</pre></td>
   	</tr>
   </tbody>
   </table>


  2. Type
   <table>
   <thead>
     <th>Method</th>
     <th>Route</th>
     <th>Request Body</th>
     <th>Path Variable</th>
    </thead>
    <tbody>
   	<tr>
   	  <td>POST</td>
   	  <td>api/DataManagement/type/creation</td>
   	  <td><pre>{<br/>  "id": "&lt;integer&gt;",<br/>  "name": "&lt;string&gt;"}</pre></td>
   	  <td><pre>None</pre></td>
   	</tr>
   	<tr>
   	  <td>POST</td>
   	  <td>api/DataManagement/type/update</td>
   	  <td><pre>{<br/>  "id": "&lt;integer&gt;",<br/>  "name": "&lt;string&gt;"}</pre></td>
   	  <td><pre>None</pre></td>
   	</tr>
   	<tr>
   	  <td>POST</td>
   	  <td>api/DataManagement/type/read</td>
   	  <td><pre>{<br/>  "id": "&lt;integer&gt;",<br/>  "name": "&lt;string&gt;"}</pre></td>
   	  <td><pre>None</pre></td>
   	</tr>
   	<tr>
   	  <td>DELETE</td>
   	  <td>api/DataManagement/type/{id}</td>
   	  <td><pre>None</pre></td>
   	  <td><pre>id : integer</pre></td>
   	</tr>
   </tbody>
   </table>

          
  4. FoodItem
   <table>
     <thead>
       <th>Method</th>
       <th>Route</th>
       <th>Request Body</th>
       <th>Path Variable</th>
      </thead>
      <tbody>
     	<tr>
     	  <td>POST</td>
     	  <td>api/DataManagement/food-item/creation</td>
     	  <td><pre>{<br/>  "id": "&lt;integer&gt;",<br/>  "name": "&lt;string&gt;" ,<br/>  "quantity": "&lt;string&gt;",<br/>  "unit_Id": "&lt;string&gt;",<br/>  "type_Id": "&lt;string&gt;"}</pre></td>
     	  <td><pre>None</pre></td>
     	</tr>
     	<tr>
     	  <td>POST</td>
     	  <td>api/DataManagement/food-item/update</td>
     	  <td><pre>{<br/>  "id": "&lt;integer&gt;",<br/>  "name": "&lt;string&gt;" ,<br/>  "quantity": "&lt;string&gt;",<br/>  "unit_Id": "&lt;string&gt;",<br/>  "type_Id": "&lt;string&gt;"}</pre></td>
     	  <td><pre>None</pre></td>
     	</tr>
     	<tr>
     	  <td>POST</td>
     	  <td>api/DataManagement/food-item/read</td>
     	  <td><pre>{<br/>  "id": "&lt;integer&gt;",<br/>  "name": "&lt;string&gt;" ,<br/>  "quantity": "&lt;string&gt;",<br/>  "unit_Id": "&lt;string&gt;",<br/>  "type_Id": "&lt;string&gt;"}</pre></td>
     	  <td><pre>None</pre></td>
     	</tr>
     	<tr>
     	  <td>DELETE</td>
     	  <td>api/DataManagement/type/{id}</td>
     	  <td><pre>None</pre></td>
     	  <td><pre>id : integer</pre></td>
     	</tr>
     </tbody>
   </table>


  6. MenuItem
   <table>
   <thead>
     <th>Method</th>
     <th>Route</th>
     <th>Request Body</th>
     <th>Path Variable</th>
    </thead>
    <tbody>
   	<tr>
   	  <td>POST</td>
   	  <td>api/DataManagement/menu-item/creation</td>
   	  <td><pre>{<br/>  "id": "&lt;integer&gt;",<br/>  "name": "&lt;string&gt;"<br/>}</pre></td>
   	  <td><pre>None</pre></td>
   	</tr>
   	<tr>
   	  <td>POST</td>
   	  <td>api/DataManagement/menu-item/update</td>
   	  <td><pre>{<br/>  "id": "&lt;integer&gt;",<br/>  "name": "&lt;string&gt;"<br/>}</pre></td>
   	  <td><pre>None</pre></td>
   	</tr>
   	<tr>
   	  <td>POST</td>
   	  <td>api/DataManagement/menu-item/read</td>
   	  <td><pre>{<br/>  "id": "&lt;integer&gt;",<br/>  "name": "&lt;string&gt;"<br/>}</pre></td>
   	  <td><pre>None</pre></td>
   	</tr>
   	<tr>
   	  <td>DELETE</td>
   	  <td>api/DataManagement/food-item/{id}</td>
   	  <td><pre>None</pre></td>
   	  <td><pre>id : integer</pre></td>
   	</tr>
   </tbody>
   </table>
      
        
  7. Menu
   <table>
   <thead>
     <th>Method</th>
     <th>Route</th>
     <th>Request Body</th>
     <th>Path Variable</th>
    </thead>
    <tbody>
   	<tr>
   	  <td>POST</td>
   	  <td>api/DataManagement/menu/creation</td>
   	  <td><pre>{<br/>  "id": "&lt;integer&gt;",<br/>  "date": "&lt;dateTime&gt;" ,<br/>  "menuItem_Id": "&lt;integer&gt;"}</pre></td>
   	  <td><pre>None</pre></td>
   	</tr>
   	<tr>
   	  <td>POST</td>
   	  <td>api/DataManagement/menu/update</td>
   	  <td><pre>{<br/>  "id": "&lt;integer&gt;",<br/>  "date": "&lt;dateTime&gt;" ,<br/>  "menuItem_Id": "&lt;integer&gt;"}</pre></td>
   	  <td><pre>None</pre></td>
   	</tr>
   	<tr>
   	  <td>POST</td>
   	  <td>api/DataManagement/menu/read</td>
   	  <td><pre>{<br/>  "id": "&lt;integer&gt;",<br/>  "date": "&lt;dateTime&gt;" ,<br/>  "menuItem_Id": "&lt;integer&gt;"}</pre></td>
   	  <td><pre>None</pre></td>
   	</tr>
   	<tr>
   	  <td>DELETE</td>
   	  <td>api/DataManagement/menu/{id}</td>
   	  <td><pre>None</pre></td>
   	  <td><pre>id : integer</pre></td>
   	</tr>
   </tbody>
   </table>

          
  8. MenuItemFoodItem
   <table>
   <thead>
     <th>Method</th>
     <th>Route</th>
     <th>Request Body</th>
     <th>Path Variable</th>
    </thead>
    <tbody>
   	<tr>
   	  <td>POST</td>
   	  <td>api/DataManagement/menu-item-food-item/creation</td>
   	  <td><pre>{<br/>  "menuItem_Id": "&lt;integer&gt;",<br/>  "foodItem_Id": "&lt;integer&gt;" ,<br/>  "consumption": "&lt;integer&gt;"}</pre></td>
   	  <td><pre>None</pre></td>
   	</tr>
   	<tr>
   	  <td>POST</td>
   	  <td>api/DataManagement/menu-item-food-item/update</td>
   	  <td><pre>{<br/>  "menuItem_Id": "&lt;integer&gt;",<br/>  "foodItem_Id": "&lt;integer&gt;" ,<br/>  "consumption": "&lt;integer&gt;"}</pre></td>
   	  <td><pre>None</pre></td>
   	</tr>
   	<tr>
   	  <td>POST</td>
   	  <td>api/DataManagement/menu-item-food-item/read</td>
   	  <td><pre>{<br/>  "menuItem_Id": "&lt;integer&gt;",<br/>  "foodItem_Id": "&lt;integer&gt;" ,<br/>  "consumption": "&lt;integer&gt;"}</pre></td>
   	  <td><pre>None</pre></td>
   	</tr>
   	<tr>
   	  <td>DELETE</td>
   	  <td>api/DataManagement/menu-item-food-item</td>
   	  <td><pre>{<br/>  "menuItem_Id": "&lt;integer&gt;",<br/>  "foodItem_Id": "&lt;integer&gt;" ,<br/>  "consumption": "&lt;integer&gt;"}</pre></td>
   	  <td><pre>None</pre></td>
   	</tr>
   </tbody>
   </table>


  9. Order
   <table>
   <thead>
     <th>Method</th>
     <th>Route</th>
     <th>Request Body</th>
     <th>Path Variable</th>
    </thead>
    <tbody>
   	<tr>
   	  <td>POST</td>
   	  <td>api/DataManagement/order/creation</td>
   	  <td><pre>{<br/>  "id": "&lt;integer&gt;",<br/>  "isCanceled": "&lt;integer&gt;"<br/>}</pre></td>
   	  <td><pre>None</pre></td>
   	</tr>
   	<tr>
   	  <td>POST</td>
   	  <td>api/DataManagement/order/update</td>
   	  <td><pre>{<br/>  "id": "&lt;integer&gt;",<br/>  "isCanceled": "&lt;integer&gt;"<br/>}</pre></td>
   	  <td><pre>None</pre></td>
   	</tr>
   	<tr>
   	  <td>POST</td>
   	  <td>api/DataManagement/order/read</td>
   	  <td><pre>{<br/>  "id": "&lt;integer&gt;",<br/>  "isCanceled": "&lt;integer&gt;"<br/>}</pre></td>
   	  <td><pre>None</pre></td>
   	</tr>
   	<tr>
   	  <td>DELETE</td>
   	  <td>api/DataManagement/order/{id}</td>
   	  <td><pre>None</pre></td>
   	  <td><pre>id : integer</pre></td>
   	</tr>
   </tbody>
   </table>


  10. OrderItem
   <table>
   <thead>
     <th>Method</th>
     <th>Route</th>
     <th>Request Body</th>
     <th>Path Variable</th>
    </thead>
    <tbody>
   	<tr>
   	  <td>POST</td>
   	  <td>api/DataManagement/order-item/creation</td>
   	  <td><pre>{<br/>  "id": "&lt;integer&gt;",<br/>  "orderId": "&lt;integer&gt;",<br/>  "menuItemId": "&lt;integer&gt;"<br/>}</pre></td>
   	  <td><pre>None</pre></td>
   	</tr>
   	<tr>
   	  <td>POST</td>
   	  <td>api/DataManagement/order-item/update</td>
   	  <td><pre>{<br/>  "id": "&lt;integer&gt;",<br/>  "orderId": "&lt;integer&gt;",<br/>  "menuItemId": "&lt;integer&gt;"<br/>}</pre></td>
   	  <td><pre>None</pre></td>
   	</tr>
   	<tr>
   	  <td>POST</td>
   	  <td>api/DataManagement/order-item/read</td>
   	  <td><pre>{<br/>  "id": "&lt;integer&gt;",<br/>  "orderId": "&lt;integer&gt;",<br/>  "menuItemId": "&lt;integer&gt;"<br/>}</pre></td>
   	  <td><pre>None</pre></td>
   	</tr>
   	<tr>
   	  <td>DELETE</td>
   	  <td>api/DataManagement/order-item/{id}</td>
   	  <td><pre>None</pre></td>
   	  <td><pre>id : integer</pre></td>
   	</tr>
   </tbody>
   </table>
