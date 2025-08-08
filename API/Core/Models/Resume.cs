using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Core.Models
{
    public class Resume
    {
        [Key]
        public int Id { get; set; }

        // Personal Info - Flattened
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string Photo { get; set; }
        public string Bio { get; set; }
        public string Location { get; set; }
        public string Focus { get; set; }

        // Social Media - Flattened
        public string LinkedinUrl { get; set; }
        public string InstagramUrl { get; set; }
        public string BehanceUrl { get; set; }
        public string WebsiteUrl { get; set; }

        // Collections stored as JSON strings
        public string EducationJson { get; set; }
        public string ExperienceJson { get; set; }
        public string SkillsJson { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Helper methods to serialize/deserialize
        public void SetEducation(List<Education> education)
        {
            EducationJson = JsonSerializer.Serialize(education);
        }

        public List<Education> GetEducation()
        {
            return string.IsNullOrEmpty(EducationJson)
                ? new List<Education>()
                : JsonSerializer.Deserialize<List<Education>>(EducationJson);
        }

        public void SetExperience(List<Experience> experience)
        {
            ExperienceJson = JsonSerializer.Serialize(experience);
        }

        public List<Experience> GetExperience()
        {
            return string.IsNullOrEmpty(ExperienceJson)
                ? new List<Experience>()
                : JsonSerializer.Deserialize<List<Experience>>(ExperienceJson);
        }

        public void SetSkills(List<Skill> skills)
        {
            SkillsJson = JsonSerializer.Serialize(skills);
        }

        public List<Skill> GetSkills()
        {
            return string.IsNullOrEmpty(SkillsJson)
                ? new List<Skill>()
                : JsonSerializer.Deserialize<List<Skill>>(SkillsJson);
        }
    }

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

}
