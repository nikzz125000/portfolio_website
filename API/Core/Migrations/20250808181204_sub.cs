using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Core.Migrations
{
    /// <inheritdoc />
    public partial class sub : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SubProjectContainerId",
                table: "Projects",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "SubProjectContainers",
                columns: table => new
                {
                    SubProjectContainerId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProjectId = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_SubProjectContainers", x => x.SubProjectContainerId);
                });

            migrationBuilder.CreateTable(
                name: "SubProjects",
                columns: table => new
                {
                    SubProjectId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SubProjectContainerId = table.Column<int>(type: "int", nullable: false),
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
                    ImageFileName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MyProperType = table.Column<int>(type: "int", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubProjects", x => x.SubProjectId);
                    table.ForeignKey(
                        name: "FK_SubProjects_SubProjectContainers_SubProjectContainerId",
                        column: x => x.SubProjectContainerId,
                        principalTable: "SubProjectContainers",
                        principalColumn: "SubProjectContainerId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Projects_SubProjectContainerId",
                table: "Projects",
                column: "SubProjectContainerId");

            migrationBuilder.CreateIndex(
                name: "IX_SubProjects_SubProjectContainerId",
                table: "SubProjects",
                column: "SubProjectContainerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_SubProjectContainers_SubProjectContainerId",
                table: "Projects",
                column: "SubProjectContainerId",
                principalTable: "SubProjectContainers",
                principalColumn: "SubProjectContainerId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Projects_SubProjectContainers_SubProjectContainerId",
                table: "Projects");

            migrationBuilder.DropTable(
                name: "SubProjects");

            migrationBuilder.DropTable(
                name: "SubProjectContainers");

            migrationBuilder.DropIndex(
                name: "IX_Projects_SubProjectContainerId",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "SubProjectContainerId",
                table: "Projects");
        }
    }
}
