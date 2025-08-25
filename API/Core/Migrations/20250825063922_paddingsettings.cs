using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Core.Migrations
{
    /// <inheritdoc />
    public partial class paddingsettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BackgroundColorSettings",
                columns: table => new
                {
                    BackgroundColorSettingId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BackgroundColor = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BackgroundColorSettings", x => x.BackgroundColorSettingId);
                });

            migrationBuilder.CreateTable(
                name: "PaddingSettings",
                columns: table => new
                {
                    PaddingSettingId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PaddingLeft = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PaddingRight = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PaddingBottom = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PaddingTop = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaddingSettings", x => x.PaddingSettingId);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BackgroundColorSettings");

            migrationBuilder.DropTable(
                name: "PaddingSettings");
        }
    }
}
