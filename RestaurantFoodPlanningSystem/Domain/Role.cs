﻿using Microsoft.AspNetCore.Identity;

namespace Domain;

public class Role : IdentityRole<int>
{
    public string  Description { get; set; }
    public DateTime CreatedDate { get; set; }

    public Role()
        : base()
    {
        
    }

    public Role(string roleName)
        : base(roleName)
    {
        
    }

    public Role(string   roleName,
                string   description,
                DateTime createdDate)
        : base(roleName)
    {
        Description = description;
        CreatedDate = createdDate;
    }
}