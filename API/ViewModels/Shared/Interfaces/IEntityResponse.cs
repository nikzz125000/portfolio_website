namespace ViewModels.Shared.Interfaces
{
    public interface IEntityResponse
    {
        void CreateResponseWithEntityRef(int entityRef, string message = null);
    }
}
