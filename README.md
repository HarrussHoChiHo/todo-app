# Details of this Project

## Group Member
 - Chi Ho Ho (301324743)
 - Kang Yee Tang (301328548)

## Project Description
Restaurant Food Planning System

## Technologies
### Front-end
  - React, Next.js
### Back-end
  - C#, .Net Core
### Database
  - Microsoft SQL Server

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
       - URL: http://localhost:8081/swagger/index.html
       - After launching the application, the document can be accessed by visiting the URL above.
           
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
    "id": "<integer>",
    "isCanceled": "<boolean>"
   },
   "orderItems": [
     {
         "id": "<integer>",
         "orderId": "<integer>",
         "menuItemId": "<integer>"
      },
      {
         "id": "<integer>",
         "orderId": "<integer>",
         "menuItemId": "<integer>"
      }
   ]
}</pre></td>
   <td><pre>None</pre></td>
  </tr>
 </tbody>
</table>

### DataManagement
   1. Unit
      - POST api/DataManagement/unit/creation

        - Request Body
          
          ```JSON
          {
            "id": "<integer>",
            "name": "<string>"
          }
          ```

      - POST api/DataManagement/unit/update

        - Request Body
          
          ```JSON
          {
            "id": "<integer>",
            "name": "<string>"
          }
          ```

      - POST api/DataManagement/unit/read

        - Request Body
          
          ```JSON
          {
            "id": "<integer>",
            "name": "<string>"
          }
          ```

      - DELETE api/DataManagement/unit/{id}

        - Path Variables

           ```
           id : integer
           ```
        
   2. Type

      -  POST api/DataManagement/type/creation

         - Request Body

           ```JSON
           {
             "id": "<integer>",
             "name": "<string>"
           }
           ```
      - POST api/DataManagement/type/update

        - Request Body
       
          ```
          {
            "id": "<integer>",
            "name": "<string>"
          }
          ```

      - POST api/DataManagement/type/read

        - Request Body
       
          ```
          {
            "id": "<integer>",
            "name": "<string>"
          }
          ```

      - DELETE api/DataManagement/type/{id}

        - Path Variables

          ```
          id : integer
          ```
          
   4. FoodItem

      - POST api/DataManagement/food-item/creation

        - Request Body

          ```
          {
            "id": "<integer>",
            "name": "<string>",
            "quantity": "<integer>",
            "unit_Id": "<integer>",
            "type_Id": "<integer>"
          }
          ```

      - POST api/DataManagement/food-item/update

        - Request Body

          ```
          {
            "id": "<integer>",
            "name": "<string>",
            "quantity": "<integer>",
            "unit_Id": "<integer>",
            "type_Id": "<integer>"
          }
          ```

      - POST api/DataManagement/food-item/read

        -  Request Body
       
           ```
           {
             "id": "<integer>",
             "name": "<string>",
             "quantity": "<integer>",
             "unit_Id": "<integer>",
             "type_Id": "<integer>"
           }
           ```

      - DELETE api/DataManagement/food-item/{id}

        - Path Variables

          ```
          id : integer
          ```
        
   6. MenuItem

      - POST api/DataManagement/menu-item/creation

        - Request Body

          ```
          {
            "id": "<integer>",
            "name": "<string>"
          }
          ```

      - POST api/DataManagement/menu-item/update

        - Request Body

          ```
          {
            "id": "<integer>",
            "name": "<string>"
          }
          ```

      - POST api/DataManagement/food-item/read

        - Request Body

          ```
          {
            "id": "<integer>",
            "name": "<string>",
            "quantity": "<integer>",
            "unit_Id": "<integer>",
            "type_Id": "<integer>"
          }
          ```

      - DELETE api/DataManagement/food-item/{id}
        
   7. Menu

      - POST api/DataManagement/menu/creation

        - Request Body

          ```
          {
            "id": "<integer>",
            "date": "<dateTime>",
            "menuItem_Id": "<integer>"
          }
          ```

      - POST api/DataManagement/menu/update
     
        - Request Body
       
          ```
          {
            "id": "<integer>",
            "date": "<dateTime>",
            "menuItem_Id": "<integer>"
          }
          ```

      - POST api/DataManagement/menu/read

        - Request Body

          ```
          {
            "id": "<integer>",
            "date": "<dateTime>",
            "menuItem_Id": "<integer>"
          }
          ```

      - DELETE api/DataManagement/menu/{id}

        - Path Variables

          ```
          id : integer
          ```
          
   8. MenuItemFoodItem

      - POST api/DataManagement/menu-item-food-item/creation

        - Request Body
       
          ```
          {
            "menuItem_Id": "<integer>",
            "foodItem_Id": "<integer>",
            "consumption": "<integer>"
          }
          ```

      - POST api/DataManagement/menu-item-food-item/update
     
        - Request Body

          ```
          {
            "menuItem_Id": "<integer>",
            "foodItem_Id": "<integer>",
            "consumption": "<integer>"
          }
          ```

      - POST api/DataManagement/menu-item-food-item/read

        - Request Body
       
          ```
          {
            "menuItem_Id": "<integer>",
            "foodItem_Id": "<integer>",
            "consumption": "<integer>"
          }
          ```

      - DELETE api/DataManagement/menu-item-food-item
     
        - Request Body

          ```
          {
            "menuItem_Id": "<integer>",
            "foodItem_Id": "<integer>",
            "consumption": "<integer>"
          }
          ```
       
   9. Order

      - POST api/DataManagement/order/creation

        - Request Body

          ```
          {
            "id": "<integer>",
            "isCanceled": "<boolean>"
          }
          ```

       - POST api/DataManagement/order/update

         - Request Body

           ```
           {
             "id": "<integer>",
             "isCanceled": "<boolean>"
           }
           ```

       - POST api/DataManagement/order/read

         - Request Body

           ```
           {
             "id": "<integer>",
             "isCanceled": "<boolean>"
           }
           ```

       - DELETE api/DataManagement/order/{id}

         - Path Variables

           ```
           id : integer
           ```
           
   10. OrderItem

       - POST api/DataManagement/order-item/creation

         - Request Body

           ```
           {
             "id": "<integer>",
             "orderId": "<integer>",
             "menuItemId": "<integer>"
           }
           ```

       - POST api/DataManagement/order-item/update

         - Request Body

           ```
           {
             "id": "<integer>",
             "orderId": "<integer>",
             "menuItemId": "<integer>"
           }
           ```

       - POST api/DataManagement/order-item/read

         - Request Body

           ```
           {
             "id": "<integer>",
             "orderId": "<integer>",
             "menuItemId": "<integer>"
           }
           ```

       - POST api/DataManagement/order-item/{id}

         - Path Variables

           ```
           id : integer
           ```
       
