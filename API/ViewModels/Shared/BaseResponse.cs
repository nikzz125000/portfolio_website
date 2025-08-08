using System;
using System.Linq;
using Shared.Enums;
using ViewModels.Shared.Interfaces;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace ViewModels.Shared
{
	public abstract class BaseResponse : IBaseResponse, IModelStateValidationResponse, ISuccessResponse, IFailureResponse
	{
		public string Message { get; set; }
		public ResponseType Type { get; set; }
		public bool IsSuccess { get; set; }
		public ResponseCode Code { get; set; }

		protected BaseResponse()
		{
			Message = string.Empty;
			Type = ResponseType.Info;
			IsSuccess = false;
			Code = ResponseCode.Ok;
		}

		public virtual void CreateModelStateValidationResponse(string message = null)
		{
			IsSuccess = false;
			Type = ResponseType.Warning;
			Message = string.IsNullOrEmpty(message) ? $"The provided data is not correct. while processing the request data validation failed. please check all data entered are correct and try again." : $"Data validation failed with following errors: {message}";
			Code = ResponseCode.InvalidData;
		}

		public virtual void CreateModelStateValidationResponse(ModelStateDictionary modelState)
		{
			string message = string.Join("; ", modelState.Values
										.SelectMany(x => x.Errors)
										.Select(x => x.ErrorMessage));
			IsSuccess = false;
			Type = ResponseType.Warning;
			Message = string.IsNullOrEmpty(message) ? $"The provided data is not correct. while processing the request data validation failed. please check all data entered are correct and try again." : $"Data validation failed with following errors: {message}";
			Code = ResponseCode.InvalidData;
		}

		public virtual void CreateSuccessResponse(string message = null)
		{
			IsSuccess = true;
			Type = ResponseType.Success;
			Message = string.IsNullOrEmpty(message) ? $"The request has been completed successfully." : message;
			Code = ResponseCode.RequestWasSuccess;
		}

		public virtual void CreateFailureResponse(string message = null)
		{
			IsSuccess = false;
			Type = ResponseType.Error;
			Message = string.IsNullOrEmpty(message) ? $"The last request was a failure." : message;
			Code = ResponseCode.RequestWasFailure;
		}

		public virtual void GenerateCustomError(string message = null)
		{
			throw new NotImplementedException("Should be implemented in derived class before usage.");
		}
	}
}
