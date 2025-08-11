using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ViewModels
{
    public class Education
    {
        public string Period { get; set; }
        public string Institution { get; set; }
        public string Location { get; set; }
        public string Degree { get; set; }
    }

    public class Experience
    {
        public string Period { get; set; }
        public string Title { get; set; }
        public string Company { get; set; }
        public string Description { get; set; }
    }

    public class Skill
    {
        public string Title { get; set; }
        public List<string> Items { get; set; } = new List<string>();
    }

    public class ResumePostModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public IFormFile? Photo { get; set; }
        public string? Bio { get; set; }
        public string? Location { get; set; }
        public string? Focus { get; set; }

        public string? LinkedinUrl { get; set; }
        public string? InstagramUrl { get; set; }
        public string? BehanceUrl { get; set; }
        public string? WebsiteUrl { get; set; }

        public string EducationJson { get; set; } = "[]";
        public string ExperienceJson { get; set; } = "[]";
        public string SkillsJson { get; set; } = "[]";
    }

    public class ResumeViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string Photo { get; set; }
        public string? Bio { get; set; }
        public string? Location { get; set; }
        public string? Focus { get; set; }

        public string? LinkedinUrl { get; set; }
        public string? InstagramUrl { get; set; }
        public string? BehanceUrl { get; set; }
        public string? WebsiteUrl { get; set; }

        public string EducationJson { get; set; }
        public string ExperienceJson { get; set; }
        public string SkillsJson { get; set; }
    }
    public class ConnectPostModel
    {
        public string MobileNumber { get; set; }
        public string Email { get; set; }
        public string Message { get; set; }
    }
}
