using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Core.Migrations
{
    /// <inheritdoc />
    public partial class scrollsettings1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "Keyboard",
                table: "ScrollSettings",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "Momentum",
                table: "ScrollSettings",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "Touch",
                table: "ScrollSettings",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "Wheel",
                table: "ScrollSettings",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Keyboard",
                table: "ScrollSettings");

            migrationBuilder.DropColumn(
                name: "Momentum",
                table: "ScrollSettings");

            migrationBuilder.DropColumn(
                name: "Touch",
                table: "ScrollSettings");

            migrationBuilder.DropColumn(
                name: "Wheel",
                table: "ScrollSettings");
        }
    }
}
