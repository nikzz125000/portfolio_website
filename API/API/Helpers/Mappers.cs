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
            CreateMap<ProjectContainer, ProjectContainerPostModel>();
            CreateMap<ProjectContainerPostModel, ProjectContainer>()
                .ForMember(dest => dest.Projects, opt => opt.Ignore());
            CreateMap<Project, ProjectPostModel>();
            CreateMap<ProjectPostModel, Project>()
                .ForMember(dest => dest.ImageFileName, opt => opt.Ignore());
            CreateMap<ProjectContainer, ProjectContainerViewModel>().ReverseMap();
            CreateMap<ProjectContainer, ProjectContainerDetailsViewModel>().ReverseMap();
            CreateMap<Project, ProjectViewModel>().ReverseMap();

            CreateMap<SubProjectContainer, SubProjectContainerPostModel>();
            CreateMap<SubProjectContainerPostModel, SubProjectContainer>()
                .ForMember(dest => dest.Projects, opt => opt.Ignore());
            CreateMap<SubProject, SubProjectPostModel>();
            CreateMap<SubProjectPostModel, SubProject>()
                .ForMember(dest => dest.ImageFileName, opt => opt.Ignore());
            CreateMap<SubProjectContainer, SubProjectContainerViewModel>().ReverseMap();
            CreateMap<SubProject, SubProjectViewModel>().ReverseMap();
            
        }
    }
}
