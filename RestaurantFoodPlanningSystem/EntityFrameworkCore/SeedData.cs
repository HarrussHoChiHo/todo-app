using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Type = Domain.Type;

namespace EntityFrameworkCore;

public class SeedData
{
    public static async Task CreateSeedData(RoleManager<Role> roleManager,
                                            UserManager<User> userManager,
                                            RFPSDbContext     _context,
                                            ILogger<SeedData>
                                                _logger)
    {
        if (roleManager == null)
        {
            throw new ArgumentNullException(nameof(roleManager));
        }

        if (userManager == null)
        {
            throw new ArgumentNullException(nameof(userManager));
        }

        if (!roleManager.Roles.Any())
        {
            List<Role> roles = new List<Role>()
                               {
                                   new Role(
                                            "Manager",
                                            "Manager",
                                            DateTime.Now),
                                   new Role(
                                            "Staff",
                                            "Staff",
                                            DateTime.Now),
                               };

            foreach (var role in roles)
            {
                await roleManager.CreateAsync(role);
            }
        }

        if (roleManager.Roles.Any() && !userManager.Users.Any())
        {
            List<User> users = new List<User>()
                               {
                                   new User(
                                            "Kathy",
                                            "kathy"),
                                   new User(
                                            "Harus",
                                            "harus"),
                               };

            foreach (var user in users)
            {
                await userManager.CreateAsync(user);
                await userManager.AddToRoleAsync(
                                                 user,
                                                 "Manager");
            }

            List<User> staffs = new List<User>()
                                {
                                    new User(
                                             "KathyStaff",
                                             "kathy_staff"),
                                    new User(
                                             "HarusStaff",
                                             "harus_staff"),
                                };

            foreach (var staff in staffs)
            {
                await userManager.CreateAsync(staff);
                await userManager.AddToRoleAsync(
                                                 staff,
                                                 "Staff");
            }
        }

        if (!_context.Type.Any())
        {
            List<Type> types = new List<Type>()
                               {
                                   new Type()
                                   {
                                       Name = "Meat"
                                   },
                                   new Type()
                                   {
                                       Name = "Vegetable"
                                   },
                                   new Type()
                                   {
                                       Name = "Sauce"
                                   }
                               };

            _context.Type.AddRange(types);
            _logger.LogDebug($"Type insertion result: {await _context.SaveChangesAsync()}");
        }

        if (!_context.Unit.Any())
        {
            List<Unit> units = new List<Unit>()
                               {
                                   new Unit()
                                   {
                                       Name = "milliliter"
                                   },
                                   new Unit()
                                   {
                                       Name = "liter"
                                   },
                                   new Unit()
                                   {
                                       Name = "gram"
                                   },
                                   new Unit()
                                   {
                                       Name = "kilogram"
                                   }
                               };

            _context.Unit.AddRange(units);
            _logger.LogDebug($"Unit insertion result: {await _context.SaveChangesAsync()}");
        }

        if (!_context.FoodItem.Any() && _context.Unit.Any() && _context.Type.Any())
        {
            List<FoodItem> foodItems = new List<FoodItem>()
                                       {
                                           new FoodItem()
                                           {
                                               Name     = "Beef",
                                               Quantity = 10,
                                               Type_Id  = 1,
                                               Unit_Id  = 4
                                           },
                                           new FoodItem()
                                           {
                                               Name     = "Carrot",
                                               Quantity = 10,
                                               Type_Id  = 2,
                                               Unit_Id  = 4
                                           },
                                           new FoodItem()
                                           {
                                               Name     = "Soy Sauce",
                                               Quantity = 10,
                                               Type_Id  = 3,
                                               Unit_Id  = 2
                                           },
                                           new FoodItem()
                                           {
                                               Name     = "Chicken",
                                               Quantity = 20,
                                               Type_Id  = 1,
                                               Unit_Id  = 4
                                           }
                                       };
            _context.FoodItem.AddRange(foodItems);
            _logger.LogDebug($"FoodItem insertion result: {await _context.SaveChangesAsync()}");
        }

        if (!_context.MenuItem.Any())
        {
            List<MenuItem> menuItems = new List<MenuItem>()
                                       {
                                            new MenuItem()
                                            {
                                                Name = "BBQ Beef"
                                            },
                                            new MenuItem()
                                            {
                                                Name = "Roasted Chicken"
                                            },
                                            new MenuItem()
                                            {
                                                Name = "Steamed Chicken"
                                            }
                                       };
            
            _context.MenuItem.AddRange(menuItems);
            _logger.LogDebug($"MenuItem insertion result: {await _context.SaveChangesAsync()}");
        }
        
        if (!_context.Menu.Any() && _context.MenuItem.Any())
        {
            List<Menu> menus = new List<Menu>()
                                       {
                                           new Menu()
                                           {
                                               MenuItem_Id = 1,
                                               Date = DateTime.Parse("2024-06-23")
                                           },
                                           new Menu()
                                           {
                                               MenuItem_Id = 2,
                                               Date        = DateTime.Parse("2024-06-23")
                                           },
                                           new Menu()
                                           {
                                               MenuItem_Id = 3,
                                               Date        = DateTime.Parse("2024-06-22")
                                           }
                                       };
            
            _context.Menu.AddRange(menus);
            _logger.LogDebug($"Menu insertion result: {await _context.SaveChangesAsync()}");
        }

        if (!_context.MenuItemFoodItem.Any() && _context.FoodItem.Any() && _context.MenuItem.Any())
        {
            List<MenuItemFoodItem> menuItemFoodItems = new List<MenuItemFoodItem>()
                                                      {
                                                          new MenuItemFoodItem()
                                                          {
                                                            MenuItem_Id = 1,
                                                            FoodItem_Id = 1,
                                                            Consumption = 2
                                                          },
                                                          new MenuItemFoodItem()
                                                          {
                                                              MenuItem_Id = 1,
                                                              FoodItem_Id = 3,
                                                              Consumption = 1
                                                          },
                                                          new MenuItemFoodItem()
                                                          {
                                                              MenuItem_Id = 2,
                                                              FoodItem_Id = 4,
                                                              Consumption = 2
                                                          },
                                                          new MenuItemFoodItem()
                                                          {
                                                              MenuItem_Id = 3,
                                                              FoodItem_Id = 4,
                                                              Consumption = 2
                                                          },
                                                          new MenuItemFoodItem()
                                                          {
                                                              MenuItem_Id = 3,
                                                              FoodItem_Id = 2,
                                                              Consumption = 2
                                                          }
                                                      };
            
            _context.MenuItemFoodItem.AddRange(menuItemFoodItems);
            _logger.LogDebug($"MenuItemFoodItem insertion result: {await _context.SaveChangesAsync()}");
        }
    }
}