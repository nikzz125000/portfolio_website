using ViewModels.Shared.Interfaces;

namespace ViewModels.Shared
{
    public abstract class BaseEntityResponse : BaseResponse, IBaseResponse, IEntityResponse
    {
        public int EntityId { get; set; }

        protected BaseEntityResponse(int id) : base()
        {
            EntityId = id;
        }

        protected BaseEntityResponse() : this(0)
        {

        }

        public virtual void CreateResponseWithEntityRef(int entityRef, string message = null)
        {
            EntityId = entityRef;
            base.CreateSuccessResponse(message);
        }
    }
}
