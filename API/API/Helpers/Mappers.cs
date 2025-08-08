using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Models;
using ViewModels;
using NetTopologySuite.Index.HPRtree;
using Twilio.TwiML.Voice;
using ViewModels.User;

namespace API.Helpers
{
    public class Mappers:Profile
    {
        public Mappers()
        {
            CreateMap<BctUser, BctUserViewModel>().ReverseMap();
            CreateMap<BctUser, BctUserRegistrationModel>().ReverseMap();
            CreateMap<ProjectContainer, ProjectContainerPostModel>().ReverseMap();
            CreateMap<Project, ProjectPostModel>().ReverseMap();
            CreateMap<ProjectContainer, ProjectContainerViewModel>().ReverseMap();
            CreateMap<ProjectContainer, ProjectContainerDetailsViewModel>().ReverseMap();
            CreateMap<Project, ProjectViewModel>().ReverseMap();
            
        }
    }
}
