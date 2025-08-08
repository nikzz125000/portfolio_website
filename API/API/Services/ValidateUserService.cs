using ViewModels.Shared;
using ViewModels;
using System.Threading.Tasks;
using AutoMapper;
using API.Helpers;
using Core.Models;
using Repository;

namespace API.Services
{
    public interface IValidateUserService
    {
        Task<BctUserViewModel> GetBctUserDetails(int BctUserId);

    }
    public class ValidateUserService: IValidateUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        readonly IMapper _mapper;
        IEncryptor _encryptor;
        IAuthService _authService;

        public ValidateUserService(IUnitOfWork unitOfWork, IMapper mapper, IEncryptor encryptor, IAuthService authService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _encryptor = encryptor;
            _authService = authService;
        }
        public async Task<BctUserViewModel> GetBctUserDetails(int BctUserId)
        {
            try
            {
                BctUserViewModel response = new BctUserViewModel();
                BctUser BctUser = await _unitOfWork.BctUsers.GetById(BctUserId);
                if (BctUser != null)
                {
                    response = _mapper.Map<BctUserViewModel>(BctUser);

                }

                return response;
            }
            catch (Exception ex) { 
                throw new Exception($"Error in GetBctUserDetails: {ex.Message}", ex);
            }
            
        }
    }
}
