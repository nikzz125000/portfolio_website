using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Core.Migrations
{
    /// <inheritdoc />
    public partial class b1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BctUserCredentials",
                columns: table => new
                {
                    BctUserCredentialId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BctUserId = table.Column<int>(type: "int", nullable: false),
                    Password = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    RefreshToken = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RefreshTokenExpiryTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BctUserCredentials", x => x.BctUserCredentialId);
                });

            migrationBuilder.CreateTable(
                name: "BctUsers",
                columns: table => new
                {
                    BctUserId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    EmailId = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    MobileNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    CountryCode = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Status = table.Column<long>(type: "bigint", nullable: false),
                    IsMobileNumberVerified = table.Column<bool>(type: "bit", nullable: false),
                    IsEmailVerified = table.Column<bool>(type: "bit", nullable: false),
                    IsVerified = table.Column<bool>(type: "bit", nullable: false),
                    UserType = table.Column<long>(type: "bigint", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BctUsers", x => x.BctUserId);
                });

            migrationBuilder.CreateTable(
                name: "ExceptionLogs",
                columns: table => new
                {
                    ExceptionLogId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ExceptionType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ApiType = table.Column<long>(type: "bigint", nullable: false),
                    Api = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    VendorUserId = table.Column<int>(type: "int", nullable: true),
                    Parameters = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Message = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StackTrace = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Environment = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExceptionLogs", x => x.ExceptionLogId);
                });

            migrationBuilder.CreateTable(
                name: "ProjectContainers",
                columns: table => new
                {
                    ProjectContainerId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    BackgroundImageFileName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    BackgroundImageAspectRatio = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectContainers", x => x.ProjectContainerId);
                });

            migrationBuilder.CreateTable(
                name: "SessionResetPasswords",
                columns: table => new
                {
                    SessionResetPasswordId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Key = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SessionResetPasswords", x => x.SessionResetPasswordId);
                });

            migrationBuilder.CreateTable(
                name: "Projects",
                columns: table => new
                {
                    ProjectId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProjectContainerId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    XPosition = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    YPosition = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    HeightPercent = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Animation = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    AnimationSpeed = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    AnimationTrigger = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    IsExterior = table.Column<bool>(type: "bit", nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projects", x => x.ProjectId);
                    table.ForeignKey(
                        name: "FK_Projects_ProjectContainers_ProjectContainerId",
                        column: x => x.ProjectContainerId,
                        principalTable: "ProjectContainers",
                        principalColumn: "ProjectContainerId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Projects_ProjectContainerId",
                table: "Projects",
                column: "ProjectContainerId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BctUserCredentials");

            migrationBuilder.DropTable(
                name: "BctUsers");

            migrationBuilder.DropTable(
                name: "ExceptionLogs");

            migrationBuilder.DropTable(
                name: "Projects");

            migrationBuilder.DropTable(
                name: "SessionResetPasswords");

            migrationBuilder.DropTable(
                name: "ProjectContainers");
        }
    }
}
