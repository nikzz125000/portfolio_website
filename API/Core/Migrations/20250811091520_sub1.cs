using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Core.Migrations
{
    /// <inheritdoc />
    public partial class sub1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MyProperType",
                table: "SubProjects");

            migrationBuilder.AddColumn<int>(
                name: "BackgroundType",
                table: "SubProjectContainers",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BackgroundType",
                table: "SubProjectContainers");

            migrationBuilder.AddColumn<int>(
                name: "MyProperType",
                table: "SubProjects",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
