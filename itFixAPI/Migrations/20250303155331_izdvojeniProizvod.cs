using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace itFixAPI.Migrations
{
    /// <inheritdoc />
    public partial class izdvojeniProizvod : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "isIzdvojen",
                table: "Proizvodi",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "isIzdvojen",
                table: "Proizvodi");
        }
    }
}
