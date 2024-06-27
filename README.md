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
   1. POST /api/User/login
      - Request Body
        
        ```JSON
        {
          "name": "<string>",
          "password": "<string>"
        }
        ```
       
   2. POST /api/User/register
      - Request Body
        
        ```JSON
        {
          "name": "<string>",
          "password": "<string>"
        }
        ```
       
  3. GET /api/User/:id
  4. DELETE /api/User/:id
  5. GET /api/User
  6. POST /api/User/assign-role/{userId}/{roleId}
  7. POST /api/User/remove-role/{userId}/{roleId}

### Role
   1. POST /api/Role/creation
      - Request Body
        
        ```JSON
         {
           "name": "<string>",
           "description": "<string>"
         }
        ```
   
   2. DELETE /api/Role/{id}
   
   3. POST /api/Role/read
      - Request Body
        
        ```JSON
        {
          "name": "<string>",
          "description": "<string>",
          "id": "<integer>",
          "createdDate": "<dateTime>"
        }
        ```
      
   4. POST /api/Role/update
      - Request Body
        
        ```JSON
        {
          "name": "<string>",
          "description": "<string>",
          "id": "<integer>"
        }
        ```

### Order
   1. GET /api/Order/cancel-order/{id}
   
   2. POST /api/Order/place-order
      - Request Body
        
        ```JSON
        {
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
        }
        ```

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
        
   5. MenuItem
   
   6. Menu
   
   7. MenuItemFoodItem
   
   8. Order
   
   9. OrderItem
       
