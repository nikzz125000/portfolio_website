using AutoMapper;
using API.Helpers;
using Core.Models;
using ViewModels.Shared;
using ViewModels;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System;
using Repository;

namespace API.Services
{

    public interface ICommonService
    {
        Task<BctUser> getCurrentUser(int userId);
        Task<bool> SaveExceptionLog(ExceptionLog model);

    }
    public class CommonService : ICommonService
    {

        private readonly IUnitOfWork _unitOfWork;
        readonly IMapper _mapper;
        IEncryptor _encryptor;
        IEmailSender _emailSender;
        IConfiguration _configuration;

        public CommonService(IUnitOfWork unitOfWork, IMapper mapper, IEncryptor encryptor, IEmailSender emailSender, IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _encryptor = encryptor;
            _emailSender = emailSender;
            _configuration = configuration;
        }

        

        public Task<BctUser> getCurrentUser(int userId)
        {
            return _unitOfWork.BctUsers.GetById(userId);
        }



        public Task<bool> SaveExceptionLog(ExceptionLog model)
        {
            try
            {
                return _unitOfWork.ExceptionLogs.Create(model);

            }
            catch(Exception e)
            {
                throw e;
            }
        }
    }
}
