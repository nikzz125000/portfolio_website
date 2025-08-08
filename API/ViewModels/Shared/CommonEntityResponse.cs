namespace ViewModels.Shared
{
    public class CommonEntityResponse : BaseEntityResponse
    {
        public CommonEntityResponse(int entityRef) : base(entityRef)
        {

        }

        public CommonEntityResponse()
        {

        }
    }
    public class ModelEntityResponse<T> : CommonEntityResponse
    {
        public T Data { get; set; }
    }
}
