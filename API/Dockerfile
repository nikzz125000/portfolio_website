# Base image for running the application
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

# Build image with SDK
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files
COPY ["API/API.csproj", "API/"]
COPY ["Core/Core.csproj", "Core/"]
COPY ["Repository/Repository.csproj", "Repository/"]
COPY ["Shared/Shared.csproj", "Shared/"]
COPY ["ViewModels/ViewModels.csproj", "ViewModels/"]

# Restore dependencies
RUN dotnet restore "API/API.csproj"

# Copy all source files
COPY . .

# Build the application
RUN dotnet build "API/API.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "API/API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "API.dll"]