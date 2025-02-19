using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace itFixAPI.Migrations
{
    /// <inheritdoc />
    public partial class obavjestupdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SearchTerm",
                table: "Obavijesti",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SearchTerm",
                table: "Obavijesti");
        }
    }
}
